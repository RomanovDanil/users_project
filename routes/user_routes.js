const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserData = require("../models/UserData");
const multer = require("multer");
const path = require("path");
const validator = require("validator");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = Router();

//аутентификация токена
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, config.get("jwtSecretKey"), (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

//инициализация хранилища изображений
var storage = multer.diskStorage({
  destination: "./uploads/user_images/",
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString() +
        "_" +
        file.filename +
        "_" +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
      const err = new Error("Extention");
      err.code = "EXTENTION";
      return cb(err);
    }
    cb(null, true);
  },
}).single("image");

// /api/user/getById
router.get("/getById", async (req, res) => {
  try {
    const { _id } = req.query;
    const currentUser = await User.findOne({
      _id: _id,
      confirmed: true,
      deleted: false,
    }).populate({
      path: "userData",
      populate: {
        path: "country role",
      },
    });

    if (currentUser) {
      return res.json({ user: currentUser });
    } else {
      return res.status(400).json({ message: "User is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/user/updatePassword
router.put("/updatePassword", authenticateJWT, async (req, res) => {
  try {
    const { _id, currentPassword, newPassword, repeat_newPassword } = req.body;
    const currentUser = await User.findOne({
      _id,
      deleted: false,
      confirmed: true,
    });
    if (!currentUser) {
      return res.status(400).json({ message: "User is not exists" });
    }

    if (newPassword !== repeat_newPassword) {
      return res
        .status(400)
        .json({ message: "New passwords don't match", status: false });
    }

    const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password entered incorrectly", status: false });
    }

    newPasswordHash = await bcrypt.hash(newPassword, 15);

    const user = await User.findOneAndUpdate(
      { _id, deleted: false, confirmed: true },
      { password: newPasswordHash }
    );
    if (user) {
      return res.json({
        message: "The password change is successful",
        status: true,
      });
    } else {
      return res.status(400).json("User not found");
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, status: false });
  }
});

// /api/user/get
router.get("/get", async (req, res) => {
  try {
    const users = await User.find({ confirmed: true, deleted: false }).populate(
      {
        path: "userData",
        populate: {
          path: "country role",
        },
      }
    );

    if (users) {
      return res.json({ users });
    } else {
      return res.status(400).json({ message: "Users not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/user/update
router.put("/updateUserData", authenticateJWT, async (req, res) => {
  try {
    const { userDataId, newUserData } = req.body;

    errors = [];
    for (key in newUserData) {
      if (newUserData[key] == null || newUserData[key] == "") {
        errors.push({ property: key, message: "Value is empty" });
      }
    }

    if (errors.lenght > 0) {
      return res
        .status(400)
        .json({ errors: errors, message: "Incorrect user's data" });
    }

    const userData = await UserData.findByIdAndUpdate(userDataId, newUserData, {
      new: true,
    }).populate("country role");

    if (!userData) {
      return res
        .status(400)
        .json({ errors: errors, message: "User's data not found" });
    }

    return res.json({ userData });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/uploadImage", authenticateJWT, async (req, res) => {
  const { userDataId } = req.body;

  await upload(req, res, (err) => {
    errorMessage = "";
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "The image size is no more than 4 MB!" });
      } else if (err.code === "EXTENTION") {
        return res.status(400).json({
          message: "The image must be in .png, .jpg, or .jpeg format",
        });
      } else {
        return res.status(400).json({ message: err.message });
      }
    }
  });

  if (req.file) {
    imagePath = req.file.path;

    userData = UserData.findByIdAndUpdate(
      userDataId,
      { image: imagePath },
      { new: true }
    );

    if (userData) {
      return res.status.json({
        message: "Data was successfully updated",
        userData,
      });
    } else {
      return res.status(400).json({ message: "Users data is not exists" });
    }
  } else {
    return res.status(400).json({ message: "Image not found" });
  }
});

// /api/user/deleteImage
router.put("/deleteImage", authenticateJWT, async (req, res) => {
  try {
    const { userDataId } = req.body;
    userData = await UserData.findByIdAndUpdate(
      userDataId,
      { image: "default" },
      { new: true }
    );
    if (userData) {
      return res.json({ userData });
    } else {
      return res.status(400).json({ message: "User's data not found" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.delete("/delete", authenticateJWT, async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findOneAndUpdate({ _id }, { deleted: true });
    if (user) {
      res.status.json({ message: "User was successfully deleted" });
    } else {
      res.status(400).json({ message: "User is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
