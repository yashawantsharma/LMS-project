const express=require('express');
const route=express.Router();

const employecontroller=require("../Controller/employeController")

route.post("/",employecontroller.addemploye)
route.get("/findone/:id",employecontroller.oneemploye)
route.get("/findall",employecontroller.allemploye)
route.put("/delete/:id",employecontroller.deleteemploye)
route.patch("/update/:id",employecontroller.updateemploye)
route.patch("/toggle/:id",employecontroller.toggleStatus)
route.post("/reset",employecontroller.passreset)
route.get("/trash",employecontroller.trashdata)
route.get("/restore/:id",employecontroller.restore)



module.exports=route