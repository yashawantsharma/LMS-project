const express = require("express");
const router = express.Router();
const paymentcontroller = require("../Controller/paymentController")


router.post("/",paymentcontroller.addpayment)
router.get("/findall",paymentcontroller.allpayment)
router.get("/findone/:id",paymentcontroller.onepayment)
// router.delete("/delete/:id",paymentcontroller.deletepayment)
// router.put("/update/:id",paymentcontroller.updatepayment)
module.exports=router;