const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserData = require("../models/UserData");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const path = require("path");
const { check, validationResult } = require("express-validator");
const { exception } = require("console");

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
    check("firstName", "Name not filled in!").isEmpty(),
    check("secondName", "Last name not filled in!").isEmpty(),
    check("thirdName", "Middle name not filled in!").isEmpty(),
    check("country", "Country not selected!").isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data was entered during registration",
        });
      }
      const {
        email,
        password,
        repeatPassword,
        firstName,
        secondName,
        thirdName,
        country,
      } = req.body;

      //проверить наличие email в базе
      const curUser = await User.findOne({ email });
      if (curUser) {
        return res
          .status(400)
          .json({ message: "A user with this email already exists" });
      }

      if (password !== repeatPassword) {
        return res.status(400).json({ message: "Passwords dont match" });
      }

      //роль по умолчанию
      const role = Role.findOne({ name: "No role" });
      if (!role) {
        console.log({ message: "Role 'No role' is not exists" });
        return res.status(400).json("Role 'No role' is not exists");
      }

      //создание пользовательских данных
      const userData = new UserData({
        firstName,
        secondName,
        thirdName,
        country,
        role: (await role)._id,
      });

      //если было загружено изображение
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
        userData.image = imagePath;
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
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid login information was entered",
        });
      }
      const { email, password } = req.body;

      //поиск пользователя в базе
      const curUser = await await User.findOne({
        email: email,
        confirmed: true,
        deleted: false,
      }).populate({
        path: "userData",
        populate: {
          path: "country",
        },
      });

      if (!curUser) {
        return res.status(400).json({ message: "User is not exists" });
      }

      bcrypt.compare(password, curUser.password, function (err, result) {
        if (err) return res.status(500).json({ message: err.message });
        else if (!result) {
          return res
            .status(400)
            .json({ message: "Email or password entered incorrectly" });
        } else {
          const token = jwt.sign(
            { user: curUser },
            config.get("jwtSecretKey"),
            { expiresIn: "1d" }
          );
          return res.status(200).json({
            token,
            id: curUser._id,
            email: curUser.email,
            password: curUser.password,
            userData: curUser.userData,
          });
        }
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
