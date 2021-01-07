const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    c_1_date: {
      type: Date,
      required: true,
    },
    c_plus_1_date: {
      type: Date,
      required: true,
    },
    finish_date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    documents: [
      {
        type: Types.ObjectId,
        ref: "Document",
      },
    ],
    participants: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
        },
        role: {
          type: Types.ObjectId,
          ref: "Role",
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model("Event", schema);
