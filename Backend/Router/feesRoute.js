const express = require("express");
const router = express.Router();
const feeshcontroller = require("../Controller/feesController")
router.post("/",feeshcontroller.addfeesh)
router.get("/findall",feeshcontroller.allfeesh)
router.get("/findone/:id",feeshcontroller.onefeesh)
router.delete("/delete/:id",feeshcontroller.deletefeesh)
router.put("/update/:id",feeshcontroller.updatefeesh)
router.post("/payment",feeshcontroller.addpayment)
module.exports=router;