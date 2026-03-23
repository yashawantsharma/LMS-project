const express=require('express');
const route=express.Router();

const courescontroller=require("../Controller/couresController")
const authorizeRoles = require("../Middleware/authorizeRoles");



route.post("/",courescontroller.addcoures)
route.get("/findall",courescontroller.allcoures)
route.get("/findone/:id",courescontroller.onecoures)
route.put("/delete/:id",courescontroller.deletecoures)
route.patch("/update/:id",courescontroller.updatecoures)
route.patch("/restore/:id",courescontroller.restore)



module.exports=route