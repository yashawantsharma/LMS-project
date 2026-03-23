const mongoose = require('mongoose')


const employe = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String
    },
    dob:{
        type:String
    },
    gender:{
        type:String,
        require:true
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
    },
     salary: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
     joinDate: {
      type: Date,
      default: Date.now
    },
    profileImage:{
        type:String
    },
    employmentType:{
        type:String
    },
     addharImage:{
        type:String
    },
    panNumber:{
        type:String
    }

},  { timestamps: true });

module.exports = mongoose.model('employe', employe)