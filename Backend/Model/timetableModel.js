const mongoose = require("mongoose");
const timetableSchema = new mongoose.Schema({
   schedule: [
    {
      day: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      }
    }
  ],
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"batch"
    },
    tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tutor"
    },
    isdeleted:{
        type:Boolean,
        enum:[true,false],
        default:false
    },
    isactive:{
        type:Boolean,
        enum:[true,false],
        default:true
    }
})
const timetablemodel = mongoose.model("timetable",timetableSchema);
module.exports = timetablemodel;