const mongoose = require('mongoose')

const skill = new mongoose.Schema({
    name: {
    type: String,
    required: true
  },
    duration: {
    type: String, 
    required: true
  },
    price: {
    type: Number, 
    required: true
  },
    mode: {
    type: String,
    enum: ["online", "offline"],
    default: "online"
  },
    status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
},{ timestamps: true })



const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  mode: {
    type: String,
    enum: ["online", "offline", "hybrid"],
    default: "online"
  },

  description: {
    type: String
  },

  instructor: {
    type: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  // skills: [skill] ,
  // skills: [
  // {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "skill"
  // }
// ]

}, { timestamps: true });


const Skill = mongoose.model('skill', skill)
const Course = mongoose.model('course', courseSchema);
module.exports = { Skill, Course }

