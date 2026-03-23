const express=require('express');
const route=express.Router();

const couresbatch=require("../Controller/couresbatch")

route.post("/",couresbatch.addmapping)
route.get("/findall",couresbatch.allmapping)
route.get("/findone/:id",couresbatch.onemapping)
route.delete("/delete/:id",couresbatch.deletemapping)
route.patch("/update/:id",couresbatch.updatemapping)

route.get("/batches/:courseId", couresbatch.getBatchesByCourse);
route.get("/course-wise", couresbatch.getCourseWiseMappings);

module.exports=route