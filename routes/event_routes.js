const { Router } = require("express");
const Event = require("../models/Event");
const UserEvent = require("../models/UserEvent");
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
  destination: "./uploads/event_images/",
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
}).single("photo");

// /api/event/create
router.post(
  "/create",
  [
    check("event_title", '"Event Title" is empty').isEmpty(),
    check("start_date", '"Start Date" is empty').isEmpty(),
    check("c_1_date", '"C1 Date" is empty!').isEmpty(),
    check("c_plus_1_date", '"C+1 Date is empty"!').isEmpty(),
    check("finish_date", '"Finish Date" is empty!').isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data was entered when creating the event.",
        });
      }
      const {
        event_title,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
      } = req.body;

      //проверить наличие события в базе
      const curEvent = await Event.findOne({ event_title });
      if (curEvent) {
        return res
          .status(400)
          .json({ message: "Event with current title is exists." });
      }

      if (start_date >= Date.now) {
        return res.status(400).json({
          message: "You cant create an event that has already ended.",
        });
      }

      //проверить правильность введенных дат
      const date_errors = await isCorrectDates(
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date
      );
      if (date_errors.count > 0) {
        return res.status(400).json({ message: date_errors });
      }

      const event = new Event({
        event_title,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
      });

      //если было загружено изображение
      await upload(req, res, (err) => {
        errorMessage = "";
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ message: "Изображение не более 4 мб!" });
          } else if (err.code === "EXTENTION") {
            return res.status(400).json({
              message: "Изображение должно быть в формате .png, .jpg или .jpeg",
            });
          } else {
            return res.status(400).json({ message: err.message });
          }
        }
        console.log({ status: !!err, message: err.message });
      });

      if (req.file) {
        imageName = req.file.filename;
        event.image = imageName;
      }

      //ответ
      res.status(201).json({ message: "Event is successfully created" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

async function isCorrectDates(
  start_date,
  c_1_date,
  c_plus_1_date,
  finish_date
) {
  date_errors = array();
  if (start_date >= c_1_date) {
    date_errors.push({
      field: "C1 Date",
      message: '"C1 Date" must be greater then "Start Date"',
    });
  }

  if (c_1_date >= c_plus_1_date) {
    date_errors.push({
      field: "C+1 Date",
      message: '"C+1 Date" must be greater then "C1 Date"',
    });
  }

  if (c_plus_1_date >= finish_date) {
    date_errors.push({
      field: "Finish Date",
      message: '"Finish Date" must be greater then "C+1 Date"',
    });
  }

  return date_errors;
}

// /api/event/getByUserId
router.get("/getByUserId", authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.query;
    const currentEvent = await UserEvent.findOne({ user: userId }).populate(
      "event"
    );
    if (currentEvent) {
      return res.json({ event: currentEvent.event });
    } else {
      return res.status(400).json({ message: "Event is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/getById
router.get("/getById", async (req, res) => {
  try {
    const { _id } = req.body;
    const curEvent = await Event.findById({ _id });
    if (curEvent) {
      return res.json({ message: curEvent });
    } else {
      return res.status(400).json({ message: "Event is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/get
router.get("/get", async (req, res) => {
  try {
    const events = await Event.find();
    if (events) {
      return res.json({ message: events });
    } else {
      return res.status(400).json({ message: "Events are not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/update
router.put("/update", async (req, res) => {
  try {
    const { _id, newData } = req.body;

    errors = array();
    correctNewData = {};
    for (property in newData) {
      value = req.body[property];
      if (validator.isEmpty(value)) {
        array.push({ prop: property, val: value, message: "Value is empty" });
      } else {
        correctNewData[property] = value;
      }
    }

    await upload(req, res, (err) => {
      errorMessage = "";
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "Изображение не более 4 мб!" });
        } else if (err.code === "EXTENTION") {
          return res.status(400).json({
            message: "Изображение должно быть в формате .png, .jpg или .jpeg",
          });
        } else {
          return res.status(400).json({ message: err.message });
        }
      }
      console.log({ status: !!err, message: err.message });
    });

    if (req.file) {
      imageName = req.file.filename;
      correctUserData.image = imageName;
    }

    const event = await Event.findByIdAndUpdate({ _id }, correctNewData);
    if (!event) {
      return res.status(400).json({ message: "Event is not exists" });
    } else {
      return res
        .status(200)
        .json({ message: "Event's data is successfully updated" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/delete
router.delete("/delete", async (req, res) => {
  try {
    const { _id } = req.body;
    const event = await Event.findByIdAndUpdate({ _id }, { deleted: true });
    if (event) {
      res.status.json({ message: "Event is successfully deleted" });
    } else {
      res.status(400).json({ message: "Event is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
