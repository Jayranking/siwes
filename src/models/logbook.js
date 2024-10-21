const mongoose = require("mongoose");

const logBookSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },

  week: {
    type: Number,
    required: true,
  },

  monday: {
    type: String,
    required: true,
  },

  tuesday: {
    type: String,
    required: true,
  },

  wednesday: {
    type: String,
    required: true,
  },

  thursday: {
    type: String,
    required: true,
  },

  friday: {
    type: String,
    required: true,
  },

  img: {
    type: String,
    required: false,
  },
});

const Logbook = mongoose.model("logbook", logBookSchema);
module.exports = Logbook;
