const mongoose = require("mongoose");

const feeshmodel = new mongoose.Schema(
    {
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
            required: true
        },
        course:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true
        },
        batch:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "batch",
            default: null
        },
        courseprice:{
            type: Number,
            required: true
        },
        paymenttype:{
            type: String,
            enum: ["full", "installment"],
            default: "full"
        },
        paymentmode:{
            type: String,
            enum: ["offline", "online", "cash", "card"],
            default: "offline"
        },
    amountpaid:{
        type: Number,
        default: 0
    },
    remainingamount:{
        type: Number,
        default: 0  
    },
    status:{
        type: String,
        enum: ["paid", "unpaid", "partial"],
        default: "unpaid"
    },
    duedate:{
        type: Date,
        default:null
    },
    isactive:{
        type: Boolean,
        enum: [true, false],
        default: true
    },
    isdeleted:{
        type: Boolean,
        enum: [true, false],
        default: false
    }
},
{ timestamps: true }
);
const feeshmodel1 = mongoose.model("fees", feeshmodel);
module.exports = feeshmodel1;