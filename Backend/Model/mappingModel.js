const mongoose = require("mongoose");

const mppinSchema = new mongoose.Schema({

  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "skill"
    }
  ],

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course"
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model("mapping", mppinSchema);
