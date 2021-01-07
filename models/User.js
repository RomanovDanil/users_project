const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userData: {
      type: Types.ObjectId,
      ref: "UserData",
    },
    confirmed: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
  }
);

// schema.virtual("currentEvent", {
//   ref: "UserEvent",
//   localField: "_id",
//   foreignField: "user",
//   justOne: true,
// });

schema.virtual("currentEvent", {
  ref: "Event",
  localField: "_id",
  foreignField: "participants.user",
  justOne: true,
  match: {
    deleted: false,
    finish_date: { $gte: Date.now() },
  },
});

module.exports = model("User", schema);
