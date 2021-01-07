const { Router } = require("express");
const Document = require("../models/Document");
//const templatePDF = require("../models/pdfTemplateDocument");
const Role = require("../models/Role");
const Event = require("../models/Event");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
//const pdf = require("html-pdf");

const router = Router();

// /api/document/create
router.post(
  "/create",
  [
    check("title", "Title is empty").notEmpty(),
    check("day", "Date is empty").notEmpty(),
    check("content", "Content is empty!").notEmpty(),
    check("for_role", "Role ID is empty!").notEmpty(),
    check("eventId", "Event ID is empty!").notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data was entered when creating the document.",
        });
      }

      const { title, day, date, content, for_role, stage, eventId } = req.body;

      if (!/C[-+]?[1-9]+/.test(day)) {
        return res.status(400).json({ message: "Document day in not valid" });
      }

      const currentDocument = await Document.findOne({
        day: day,
        event: eventId,
        for_role: for_role,
      });

      if (currentDocument) {
        return res.status(400).json({
          message: "Document for current date, role and event exists",
        });
      }

      let document = new Document({
        title,
        day,
        date,
        content,
        for_role,
        stage,
        event: eventId,
      });
      document = await (await document.save()).populate("for_role");

      const currentEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
          deleted: false,
          finish_date: { $gte: Date.now() },
        },
        {
          $addToSet: {
            documents: document,
          },
        },
        {
          new: true,
        }
      );

      //ответ
      if (currentEvent) {
        return res.json({
          message: "Document is successfully created",
          document: document,
        });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Event not found" });
      }
    } catch (e) {
      return res.status(500).json({ status: false, message: e.message });
    }
  }
);

// /api/document/getById
router.get("/getById", async (req, res) => {
  try {
    const { documentId } = req.query;
    // console.log(documentId);
    const currentDocument = await Document.findOne({
      _id: documentId,
      deleted: false,
    })
      .populate("for_role")
      .populate("event", [
        "title",
        "start_date",
        "c_1_date",
        "c_plus_1_date",
        "finish_date",
      ]);
    if (currentDocument) {
      return res.json({ document: currentDocument });
    } else {
      return res.status(400).json({ message: "Document not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// router.get("/createPDF", async (req, res) => {
//   try {
//     const { documentId } = req.query;
//     const currentDocument = await Document.findOne({
//       _id: documentId,
//       deleted: false,
//     })
//       .populate("for_role", ["name"])
//       .populate("event", ["title"]);
//     if (currentDocument) {
//       console.log(currentDocument);
//       pdf
//         .create(templatePDF(currentDocument), {})
//         .toFile("result.pdf", (err) => {
//           if (err) {
//             return res(Promise.reject());
//           }
//           return res(Promise.resolve());
//         });
//       res.sendFile(`${__dirname}/result.pdf`);
//     } else {
//       return res.status(400).json({ message: "Document not found" });
//     }
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// /api/documents/getByEventId
router.get("/getByEventId", async (req, res) => {
  try {
    const { eventId } = req.query;
    const documents = await Document.find({ event: eventId, deleted: false });
    if (documents) {
      return res.json({ documents: documents });
    } else {
      return res.status(400).json({ message: "Documents are not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/documents/getAll
router.get("/getAll", async (req, res) => {
  try {
    const documents = await Document.find({ deleted: false })
      .populate({ path: "event", model: Event, select: "title" })
      .populate("for_role");
    if (documents) {
      return res.json({ documents: documents });
    } else {
      return res.status(400).json({ message: "Documents are not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/sign", async (req, res) => {
  try {
    const { documentId, userId, pin } = req.body;
    const user = await User.findOne({
      _id: userId,
      deleted: false,
      confirmed: true,
      isAdmin: false,
    }).populate("userData", "pin");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.userData.pin !== pin) {
      return res.status(400).json({ message: "PIN not matched" });
    }
    const document = await Document.findOneAndUpdate(
      {
        _id: documentId,
        deleted: false,
      },
      {
        $addToSet: {
          readers: user._id,
        },
      }
    );
    if (document) {
      res.json({ message: "Document successfully signed" });
    } else {
      res.status(400).json({ message: "Document not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/document/update
router.put("/update", async (req, res) => {
  try {
    const {
      documentId,
      title,
      eventId,
      content,
      date,
      day,
      stage,
      for_role,
    } = req.body;

    const currentDocument = await Document.findOne({
      day: day,
      stage: stage,
      for_role: for_role,
      event: eventId,
      deleted: false,
    });
    if (currentDocument) {
      //   console.log(stage, day, documentId);

      //   console.log(
      //     currentDocument.stage,
      //     currentDocument.day,
      //     currentDocument._id
      //   );
      if (currentDocument._id != documentId) {
        return res.status(400).json({
          status: false,
          message: "Document for current date, role and event exists",
        });
      }
    }

    const document = await Document.findOneAndUpdate(
      { _id: documentId, deleted: false, event: eventId },
      {
        title: title,
        content: content,
        date: date,
        day: day,
        stage: stage,
        for_role: for_role,
      },
      {
        new: true,
      }
    ).populate("for_role");
    if (!document) {
      return res
        .status(400)
        .json({ status: false, message: "Document not found" });
    } else {
      return res.status(200).json({
        status: true,
        message: "Document is successfully updated",
        document: document,
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/document/delete
router.delete("/delete", async (req, res) => {
  try {
    const { documentId, eventId } = req.body;

    const document = await Document.findOneAndUpdate(
      { _id: documentId, event: eventId, deleted: false },
      { deleted: true }
    );
    await Event.updateOne(
      { _id: eventId, deleted: false },
      { $pull: { documents: documentId } }
    );

    if (document) {
      res.json({ message: "Document is successfully deleted" });
    } else {
      res.status(400).json({ message: "Document is not exists" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
