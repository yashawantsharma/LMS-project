const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const fileUpload = require('express-fileupload')

const app = express()
app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("connection is successfully"))
    .catch((err) => console.log("database is not connected", err))


const userRouter = require("./Router/userRoute")
app.use("/users", userRouter)
const employeRouter = require("./Router/employeRoute")
app.use("/employe", employeRouter)
const skillRoutre = require("./Router/skillRoute")
app.use("/skill", skillRoutre)
const courseRoutre = require("./Router/courseRoute")
app.use("/course", courseRoutre)
const mappingRoutre = require("./Router/mappingRoute")
app.use("/mapping", mappingRoutre)
const batchRouter = require("./Router/batchRoute");
app.use("/batch", batchRouter)
const studentRoute = require("./Router/studentRoute");
app.use("/student", studentRoute);
const tutorRouter = require("./Router/TutorRoute");
app.use("/tutor", tutorRouter)
const visitorsRouter = require("./Router/visitorRoute");
app.use("/visitor", visitorsRouter)
const feeshRouter = require("./Router/feesRoute");
app.use("/fees", feeshRouter)
const timetableRouter = require("./Router/timetableRoute")
app.use("/timetable", timetableRouter)
const paymentRouter = require("./Router/paymentRoute")
app.use("/payment", paymentRouter)
const attendence = require("./Router/attendanceRoute")
app.use("/attendances", attendence)
const couresbatch = require("./Router/couresbatch")
app.use("/couresbatch", couresbatch)

app.listen(port, () => {
    console.log(`server is running yas on ${port}`)
})