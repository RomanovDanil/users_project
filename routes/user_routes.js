const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserData = require("../models/UserData");
//const Role = require("../models/Role");
const Event = require("../models/Event");
//const multer = require("multer");
//const path = require("path");
//const validator = require("validator");
const { check, validationResult, body } = require("express-validator");
const base64img = require("base64-img");
const jwt = require("jsonwebtoken");
const config = require("config");
const fs = require("fs");

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
router.use(authenticateJWT);

// /api/user/getById
router.get("/getById", async (req, res) => {
  try {
    const { userId } = req.query;
    const currentUser = await User.findOne({
      _id: userId,
      confirmed: true,
      deleted: false,
    }).populate({
      path: "userData",
      populate: {
        path: "country",
      },
    });

    if (currentUser) {
      return res.json({ user: currentUser });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/user/updatePassword
router.put(
  "/updatePassword",
  [
    check(
      "currentPassword",
      "The minimum password length is 6 characters"
    ).isLength({
      min: 6,
    }),
    check(
      "newPassword",
      "The minimum password length is 6 characters"
    ).isLength({
      min: 6,
    }),
    body("newPasswordConfirmation").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const {
        userId,
        currentPassword,
        newPassword,
        newPasswordConfirmation,
      } = req.body;
      const currentUser = await User.findOne({
        _id: userId,
        deleted: false,
        confirmed: true,
      });
      if (!currentUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Password entered incorrectly", status: false });
      }

      newPasswordHash = await bcrypt.hash(newPassword, 15);

      currentUser.password = newPasswordHash;
      await currentUser.save();

      return res.json({
        message: "The password change is successful",
        status: true,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message, status: false });
    }
  }
);

// /api/user/getAll
router.get("/getAll", async (req, res) => {
  try {
    const users = await User.find({ confirmed: true, deleted: false }).populate(
      {
        path: "userData",
        populate: {
          path: "country",
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
router.post(
  "/updateUserData",
  [
    check("firstName", "First name not filled in!").notEmpty(),
    check("secondName", "Secind name not filled in!").notEmpty(),
    check("thirdName", "Third name not filled in!").notEmpty(),
    check("countryId", "Country not selected!").notEmpty(),
  ],
  async (req, res) => {
    try {
      //validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data was entered during update",
        });
      }

      const {
        userDataId,
        firstName,
        secondName,
        thirdName,
        about,
        countryId,
      } = req.body;

      const userData = await UserData.findByIdAndUpdate(
        userDataId,
        { firstName, secondName, thirdName, about, country: countryId },
        {
          new: true,
        }
      ).populate({
        path: "country",
      });

      if (!userData) {
        return res
          .status(400)
          .json({ status: false, message: "User's data not found" });
      }

      return res.json({ status: true, userData: userData });
    } catch (e) {
      res.status(500).json({ status: false, message: e.message });
    }
  }
);

router.post("/setPin", async (req, res) => {
  try {
    const { userDataId, pin } = req.body;

    userData = await UserData.findByIdAndUpdate(
      userDataId,
      { pin: pin },
      { new: true }
    );

    if (userData) {
      return res.json({
        message: "PIN was updated success",
        status: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "User's data not found", status: false });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, status: false });
  }
});

// /api/user/uploadImage
router.post("/uploadImage", async (req, res) => {
  try {
    const { userDataId, imageBase64 } = req.body;

    if (imageBase64) {
      base64img.img(
        imageBase64.image,
        "./uploads/user_images",
        Date.now(),
        async function (err, filepath) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          const pathArr = filepath.split("\\");
          const imageName = pathArr[pathArr.length - 1];
          userData = await UserData.findByIdAndUpdate(
            userDataId,
            { image: imageName },
            { new: true }
          );

          if (userData) {
            return res.json({
              message: "Data was successfully updated",
              image: imageName,
              status: true,
            });
          } else {
            return res
              .status(400)
              .json({ message: "User's data not found", status: false });
          }
        }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Image not found", status: false });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, status: false });
  }
});

// /api/user/deleteImage
router.post("/deleteImage", async (req, res) => {
  try {
    const { userDataId } = req.body;
    userData = await UserData.findByIdAndUpdate(userDataId, { image: "" });
    if (userData) {
      fs.unlink("./uploads/user_images/" + userData.image, (err) => {
        if (err) console.log(err);
      });

      return res.json({ status: true });
    } else {
      return res
        .status(400)
        .json({ message: "User's data not found", status: false });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, status: false });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: userId, deleted: false },
      { deleted: true }
    );
    if (user) {
      await Event.findOneAndUpdate(
        { deleted: false, "participants.user": userId },
        {
          $pull: {
            participants: { user: userId },
          },
        }
      );
      res.json({ message: "User successfully deleted" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/setAdmin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
      deleted: false,
      confirmed: true,
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.isAdmin = true;
    await user.save();
    return res.json({ message: "The role is successfully assigned" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

router.post(
  "/create",
  [
    check("email", "Incorrect email address entered").isEmail(),
    check("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
    check("firstName", "First name not filled in!").notEmpty(),
    check("secondName", "Secind name not filled in!").notEmpty(),
    check("thirdName", "Third name not filled in!").notEmpty(),
    check("country", "Country not selected!").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data was entered during registration",
        });
      }
      const {
        email,
        password,
        passwordConfirmation,
        firstName,
        secondName,
        thirdName,
        country,
        imageBase64,
      } = req.body;

      //проверить наличие email в базе
      const currentUser = await User.findOne({ email });
      if (currentUser) {
        return res
          .status(400)
          .json({ message: "A user with this email already exists" });
      }

      if (password !== passwordConfirmation) {
        return res.status(400).json({ message: "Passwords dont match" });
      }

      //создание пользовательских данных
      const userData = new UserData({
        firstName,
        secondName,
        thirdName,
        country,
      });

      if (imageBase64) {
        const filepath = base64img.imgSync(
          imageBase64.image,
          "./uploads/user_images",
          Date.now()
        );
        const pathArr = filepath.split("\\");
        const imageName = pathArr[pathArr.length - 1];
        userData.image = imageName;
      }

      //сохранение пользовательских данных
      await userData.save();

      //хеширование пароля
      const hashPassword = await bcrypt.hash(password, 15);

      //создание пользователя
      const user = new User({ email, password: hashPassword, userData });
      //сохранение пользователя в базе
      await user.save();
      //ответ
      res.status(201).json({ message: "User was created successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
