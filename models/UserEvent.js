const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
    path: "User",
  },
  event: {
    type: Types.ObjectId,
    required: true,
    path: "Event",
  },
});

module.exports = model("UserEvent", schema);
