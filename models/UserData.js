const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
    thirdName: {
      type: String,
      required: true,
    },
    country: {
      type: Types.ObjectId,
      ref: "Country",
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    pin: {
      type: String,
      required: false,
      minlength: 4,
      maxlength: 4,
    },
    about: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model("UserData", schema);
