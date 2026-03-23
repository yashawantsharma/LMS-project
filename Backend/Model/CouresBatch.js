const mongoose = require("mongoose");

const mppinSchema = new mongoose.Schema({

  batch: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch"
    }
  ],

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course"
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model("couresbatch", mppinSchema);
