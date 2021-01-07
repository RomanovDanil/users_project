const { Router } = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const Role = require("../models/Role");
const UserEvent = require("../models/UserEvent");
const Document = require("../models/Document");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

const base64img = require("base64-img");
const fs = require("fs");
const { DH_CHECK_P_NOT_PRIME } = require("constants");
const e = require("express");

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

// /api/event/create
router.post(
  "/create",
  [
    check("title", '"Event Title" is empty').notEmpty(),
    check("start_date", '"Start Date" is empty').notEmpty(),
    check("c_1_date", '"C1 Date" is empty!').notEmpty(),
    check("c_plus_1_date", '"C+1 Date is empty"!').notEmpty(),
    check("finish_date", '"Finish Date" is empty!').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data was entered when creating the event",
        });
      }

      const {
        title,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
        imageBase64,
      } = req.body;

      //проверить наличие события в базе
      const currentEvent = await Event.findOne({ title });
      if (currentEvent) {
        return res
          .status(400)
          .json({ message: "Event with current title is exists." });
      }

      if (start_date >= Date.now()) {
        return res.status(400).json({
          message: "You cant create an event that has already started.",
        });
      }

      //проверить правильность введенных дат
      const date_errors = await isCorrectDates(
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date
      );

      if (date_errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Incorrect dates", errors: date_errors });
      }

      const event = new Event({
        title,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
      });

      if (imageBase64) {
        base64img.img(
          imageBase64.image,
          "./uploads/event_images",
          Date.now(),
          async function (err, filepath) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            const pathArr = filepath.split("\\");
            const imageName = pathArr[pathArr.length - 1];
            event.image = imageName;
          }
        );
      }

      await event.save();
      //ответ
      res.json({ message: "Event is successfully created" });
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
  let date_errors = [];
  if (start_date >= c_1_date) {
    date_errors.push({
      param: "C1 Date",
      msg: '"C1 Date" must be greater then "Start Date"',
    });
  }

  if (c_1_date >= c_plus_1_date) {
    date_errors.push({
      param: "C+1 Date",
      msg: '"C+1 Date" must be greater then "C1 Date"',
    });
  }

  if (c_plus_1_date >= finish_date) {
    date_errors.push({
      param: "Finish Date",
      msg: '"Finish Date" must be greater then "C+1 Date"',
    });
  }

  return date_errors;
}

// /api/event/getByUserId
router.get("/getByUserId", async (req, res) => {
  try {
    const { userId } = req.query;
    const currentEvent = await Event.findOne({
      deleted: false,
      "participants.user": userId,
      finish_date: { $gte: Date.now() },
    })
      .populate("documents")
      .exec(async function (err, doc) {
        if (err) return res.status(500).json({ message: err.message });
        if (doc == null) return res.json({ event: doc });
        const usersRole = doc.participants
          .toObject()
          .find((assign) => assign.user == userId).role;
        doc.documents = await Document.find({
          deleted: false,
          event: doc._id,
          for_role: usersRole,
        });
        res.json({ event: doc });
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

function getDocumentsByRole(docs, roleId) {
  let documents = [];
  console.log(typeof docs[0].for_role);
  for (let i = 0; i < docs.length; i++) {
    if (
      docs[i].for_role.toString() === roleId ||
      docs[i].for_role._id.toString() === roleId
    )
      documents.push(docs[i]);
  }
  return documents;
}

// /api/event/getById
router.get("/getById", async (req, res) => {
  try {
    const { eventId } = req.query;
    const currentEvent = await Event.findOne({
      _id: eventId,
      finish_date: { $gte: Date.now() },
      deleted: false,
    }).populate("documents.document");
    if (!currentEvent) {
      return res.status(400).json({ message: "Event not found" });
    }
    return res.json({ event: currentEvent });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/getAll
router.get("/getAll", async (req, res) => {
  try {
    const events = await Event.find({
      finish_date: { $gte: Date.now() },
      deleted: false,
    });
    if (events) {
      return res.json({ events: events });
    } else {
      return res.status(400).json({ message: "Events are not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/getAllWithDocuments
router.get("/getAllWithDocuments", async (req, res) => {
  try {
    const events = await Event.find({
      finish_date: { $gte: Date.now() },
      deleted: false,
    })
      .populate({
        path: "documents",
        populate: {
          path: "for_role",
          model: "Role",
        },
      })
      .populate({
        path: "participants.user participanets.role",
      });
    if (events) {
      return res.json({ events: events });
    } else {
      return res.status(400).json({ message: "Events are not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/getAssignedUsers
router.get("/getAssignedUsers", async (req, res) => {
  try {
    const users = await User.find({
      deleted: false,
      confirmed: true,
      isAdmin: false,
    })
      .populate([
        {
          path: "userData",
          model: "UserData",
        },
        {
          path: "currentEvent",
          model: "Event",
          options: {
            select: {
              _id: 1,
            },
          },
        },
      ])
      .lean()
      .select({
        email: 1,
        userData: 1,
        "currentEvent._id": 1,
      });

    //нельзя отказаться от поля "participants" внутри запроса, так как по нему идет "populate"
    users.map((item) => {
      if (item.currentEvent) item.currentEvent.participants = null;
    });

    const roles = await Role.find();
    const events = await Event.find({
      finish_date: { $gte: Date.now() },
      deleted: false,
    }).populate({
      path: "participants.role",
      select: "name",
      //если не нужен id
      //select: "name -_id"
    });

    return res.json({ events, users, roles });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/event/assignUser
router.post("/assignUser", async (req, res) => {
  try {
    const { eventId, userId, roleId } = req.body;

    const currentEvent = await Event.findOne({
      _id: eventId,
      deleted: false,
      finish_date: { $gte: Date.now() },
      "participants.user": userId,
    });

    if (currentEvent) {
      return res.status(400).json({
        message: "The user is already assigned to the event",
        status: false,
      });
    }

    const event = await Event.findOne({
      _id: eventId,
      deleted: false,
      finish_date: { $gte: Date.now() },
    });
    if (!event) {
      return res
        .status(400)
        .json({ message: "Event not found", status: false });
    }
    event.participants.push({ user: userId, role: roleId });
    event.save();

    const userEvent = new UserEvent({
      user: userId,
      event: eventId,
      role: roleId,
    });
    userEvent.save();

    return res.json({ status: true });
  } catch (e) {
    res.status(500).json({ message: e.message, status: false });
  }
});

// /api/event/removeUser
router.post("/removeUser", async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    console.log(eventId, userId);
    const currentEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        deleted: false,
        finish_date: { $gte: Date.now() },
        "participants.user": userId,
      },
      { $pull: { participants: { user: userId } } },
      { safe: true, upsert: true }
    );

    if (currentEvent) {
      UserEvent.updateOne(
        { user: userId, event: eventId, deleted: false },
        { deleted: true }
      );
      return res.json({ status: true });
    } else {
      return res
        .status(400)
        .json({ message: "Event not found", status: false });
    }
  } catch (e) {
    res.status(500).json({ message: e.message, status: false });
  }
});

// /api/event/updateEventDates
router.put(
  "/updateDates",
  [
    check("start_date", "Start Date is empty").notEmpty(),
    check("c_1_date", "C1 Date is empty!").notEmpty(),
    check("c_plus_1_date", 'C+1 Date is empty"!').notEmpty(),
    check("finish_date", "Finish Date is empty!").notEmpty(),
    check("eventId", "Event is empty!").notEmpty(),
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
        eventId,
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date,
      } = req.body;

      //проверить правильность введенных дат
      const date_errors = await isCorrectDates(
        start_date,
        c_1_date,
        c_plus_1_date,
        finish_date
      );

      if (date_errors.count > 0) {
        return res
          .status(400)
          .json({ message: "Incorrect dates", errors: date_errors });
      }

      const event = await Event.findOneAndUpdate(
        { _id: eventId, deleted: false },
        {
          start_date,
          c_1_date,
          c_plus_1_date,
          finish_date,
        }
      );
      if (!event) {
        return res.status(400).json({ message: "Event is not exists" });
      } else {
        return res.json({ message: "Event's dates is successfully updated" });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// /api/event/updateEventTitle
router.put(
  "/updateTitle",
  [
    check("title", "Title is empty").notEmpty(),
    check("eventId", "Event is empty").notEmpty(),
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

      const { eventId, title } = req.body;

      const event = await Event.findOneAndUpdate(
        { _id: eventId, deleted: false, finish_date: { $gte: Date.now() } },
        {
          title,
        }
      );
      if (!event) {
        return res.status(400).json({ message: "Event is not exists" });
      } else {
        return res.json({ message: "Event's title is successfully updated" });
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// /api/event/delete
router.delete("/delete", async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findOneAndUpdate(
      { _id: eventId, deleted: false },
      { deleted: true }
    );
    if (event) {
      res.status.json({ message: "Event is successfully deleted" });
    } else {
      res.status(400).json({ message: "Event is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/uploadImage", async (req, res) => {
  try {
    const { eventId, imageBase64 } = req.body;

    if (imageBase64) {
      base64img.img(
        imageBase64.image,
        "./uploads/event_images",
        Date.now(),
        async function (err, filepath) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          const pathArr = filepath.split("\\");
          const imageName = pathArr[pathArr.length - 1];
          const event = await Event.findOneAndUpdate(
            { _id: eventId, deleted: false },
            { image: imageName },
            { new: true }
          );

          if (event) {
            return res.json({
              message: "Image was successfully updated",
              image: imageName,
              status: true,
            });
          } else {
            return res
              .status(400)
              .json({ message: "Event not found", status: false });
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

router.post("/deleteImage", async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findByIdAndUpdate(eventId, { image: "" });
    if (event) {
      fs.unlink("./uploads/event_images/" + event.image, (err) => {
        if (err) console.log(err);
      });

      return res.json({ status: true });
    } else {
      return res
        .status(400)
        .json({ message: "Event not found", status: false });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message, status: false });
  }
});

module.exports = router;
