const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dayString: {
    type: String,
    required: true,
  },
  dayDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Document", schema);
