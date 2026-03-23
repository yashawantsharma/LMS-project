const express=require('express');
const route=express.Router();

const skillcontroller=require("../Controller/skillController")

route.post("/",skillcontroller.addskill)
route.get("/findone/:id",skillcontroller.oneskill)
route.get("/findall",skillcontroller.allskill)
route.put("/delete/:id",skillcontroller.deleteskill)
route.patch("/update/:id",skillcontroller.updateskill)


module.exports=route