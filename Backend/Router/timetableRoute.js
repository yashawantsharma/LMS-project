const express = require("express")
const router = express.Router();

const timetable = require("../Controller/timetableController")

router.post("/",timetable.addrouter);
router.get("/findone/:id",timetable.onetimetable)
router.get("/findall",timetable.alltimetable)
router.delete("/delete/:id",timetable.deletetimetable)
router.post("/update/:id",timetable.updatetimetable)
router.post("/active/:id",timetable.activetimetable)
module.exports=router