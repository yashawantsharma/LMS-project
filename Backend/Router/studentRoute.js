const express = require("express")
const route = express.Router();
const studentcontroller = require("../Controller/studentController")
route.post("/", studentcontroller.addstudent)
route.get("/findone/:id", studentcontroller.onesudent)
route.get("/findall", studentcontroller.allstudent)
route.put("/delete/:id", studentcontroller.deletestudent)
route.post("/active/:id", studentcontroller.activestudent)
route.put("/update/:id", studentcontroller.updatestudent)

route.get("/batch/:batchId", studentcontroller.getStudentsByBatchParam)

module.exports = route;