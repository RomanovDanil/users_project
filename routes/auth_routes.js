const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserData = require("../models/UserData");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const path = require("path");
const { check, validationResult, body } = require("express-validator");
const { exception } = require("console");
const base64img = require("base64-img");
const router = Router();

//инициализация хранилища изображений
var storage = multer.diskStorage({
  destination: "./uploads/user_images/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
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

// /api/auth/registrate
router.post(
  "/registrate",
  [
    check("email", "Incorrect email address entered").isEmail(),
    check("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
    check("firstName", "First name not filled in!").notEmpty(),
    check("secondName", "Secind name not filled in!").notEmpty(),
    check("thirdName", "Third name not filled in!").notEmpty(),
    check("country", "Country not selected!").notEmpty(),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
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
      res.status(200).json({ message: "User was created successfully" });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Invalid email address entered").normalizeEmail().isEmail(),
    check("password", "The minimum password length is 6 characters").isLength({
      min: 6,
    }),
    check("password", "An empty password was entered").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid login information was entered",
        });
      }
      const { email, password } = req.body;

      //поиск пользователя в базе
      const currentUser = await User.findOne({
        email: email,
        confirmed: true,
        deleted: false,
      }).populate({
        path: "userData",
        populate: {
          path: "country",
        },
      });

      if (!currentUser) {
        return res.status(400).json({ message: "User is not exists" });
      }

      bcrypt.compare(password, currentUser.password, function (err, result) {
        if (err) return res.status(500).json({ message: err.message });
        else if (!result) {
          return res
            .status(400)
            .json({ message: "Email or password entered incorrectly" });
        } else {
          const token = jwt.sign(
            { userId: currentUser._id },
            config.get("jwtSecretKey"),
            { expiresIn: "1d" }
          );
          return res.status(200).json({
            token,
            id: currentUser._id,
            email: currentUser.email,
            isAdmin: currentUser.isAdmin,
            userData: currentUser.userData,
          });
        }
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
