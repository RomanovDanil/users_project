const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    for_role: {
      type: Types.ObjectId,
      required: true,
      ref: "Role",
    },
    content: {
      type: String,
      required: true,
    },
    event: {
      type: Types.ObjectId,
      required: true,
      ref: "Event",
    },
    stage: {
      type: String,
      required: "True",
      enum: ["initial", "main", "final"],
    },
    pdf: {
      type: String,
      required: false,
    },
    readers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model("Document", schema);
