const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "visitor"
  },

  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "batch"
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course"
  },

  photo: String,
  addressProof: String,

  batchStartDate: Date,

  addressLine: String,
  city: String,
  state: String,
  pincode: String,

  notes: String,

  fees: Number,

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  isactive: {
    type: Boolean,
    default: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("student", studentSchema);