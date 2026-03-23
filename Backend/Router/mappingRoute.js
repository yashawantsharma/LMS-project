const express=require('express');
const route=express.Router();

const mappingcontroller=require("../Controller/mappingController")

route.post("/",mappingcontroller.addmapping)
route.get("/findall",mappingcontroller.allmapping)
route.get("/findone/:id",mappingcontroller.onemapping)
route.delete("/delete/:id",mappingcontroller.deletemapping)
route.patch("/update/:id",mappingcontroller.updatemapping)

module.exports=route