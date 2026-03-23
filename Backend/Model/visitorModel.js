const mongoose = require("mongoose");
const visitorsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    isActive:{
        type:Boolean,
        enum:[true,false],
        default:true,
    },
    coures:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
    },
    status:{
        type:String,
        enum:["new","contacted","interested","not interested"],
        default:"new",
    },
    source:{
        type:String,
        enum:["website","social media","referral","other"],
        default:"website",
    },

})
const visitorsmodel = mongoose.model("visitor",visitorsSchema);
module.exports = visitorsmodel;