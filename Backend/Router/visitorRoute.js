const express = require("express");
const router = express.Router();
const visitorscontroller = require("../Controller/visitorController")
router.post("/",visitorscontroller.addvisitor)
router.get("/onevisitor/:id",visitorscontroller.onevisitor)
router.get("/allvisitor",visitorscontroller.allvisitor)
router.delete("/deletevisitor/:id",visitorscontroller.deletevisitor)
router.post("/activevisitor/:id",visitorscontroller.activevisitor)
router.post("/updatevisitor/:id",visitorscontroller.updatevisitor)
router.post("/convertstudent/:id",visitorscontroller.convertstudent)
module.exports = router;