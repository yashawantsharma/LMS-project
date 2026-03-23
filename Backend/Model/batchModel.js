const mongoose = require("mongoose");
const batchSchema =new mongoose.Schema({
    batchName:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
        required:true,
    },
    tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tutor",
        required:true,
    },
     student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student",
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:["upcoming","ongoing","completed"],
        default:"upcoming",
    },
        isActive:{
        type:Boolean,
        enum:[true,false],
        default:true,
    },

})
const batchmodel = mongoose.model("batch",batchSchema);
module.exports = batchmodel;