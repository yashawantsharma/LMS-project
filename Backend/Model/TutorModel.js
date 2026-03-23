const mongoose =require("mongoose");
const tutorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    isactive:{
        type:Boolean,
        enum:[true,false],
        default:true
    },
    salary:{
        type:Number,
    },
    experience:{
        type:String,
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },

})
module.exports=mongoose.model("tutor",tutorSchema)