const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  event: {
    type: Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: Types.ObjectId,
    ref: "Role",
    required: true,
  },
  deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = model("UserEvent", schema);
