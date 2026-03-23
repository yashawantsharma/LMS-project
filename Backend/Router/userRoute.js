const express=require('express');
const route=express.Router();

const usercontroller=require("../Controller/userController")
const auth=require("../Middleware/auth")

route.post("/",usercontroller.adduser)
route.post("/login",usercontroller.login)
route.get("/oneuser/:id",usercontroller.findone)
route.post("/forget",usercontroller.passforget)
route.post("/otp",usercontroller.sendotp)
route.post("/reset",usercontroller.passreset)
route.post("/updatetheme",auth,usercontroller.updatetheme)
route.get("/theme",auth,usercontroller.theme)

module.exports=route
