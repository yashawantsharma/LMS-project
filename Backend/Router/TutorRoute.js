const express = require("express");
const router = express.Router();
const tutorcontroller = require("../Controller/TutorController")
router.post("/", tutorcontroller.addtutor)
router.get("/findone/:id", tutorcontroller.onetutor)
router.get("/findall", tutorcontroller.alltutor)
router.delete("/delete/:id", tutorcontroller.deletetutor)
router.post("/active/:id", tutorcontroller.activetutor)
router.post("/update/:id", tutorcontroller.updatetutor)
module.exports = router;