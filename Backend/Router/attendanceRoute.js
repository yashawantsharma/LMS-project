const express=require('express');
const route=express.Router();

const attendenceController=require("../Controller/attendenceController")

route.post("/mark", attendenceController.markAttendance);
route.get("/month", attendenceController.getMonthlyAttendance);
route.get("/findall", attendenceController.getAllAttendance);


module.exports = route;