const couresbatch = require("../Model/CouresBatch")


exports.addmapping = async (req, res) => {
    try {
        const { batch, courses } = req.body
        // console.log(req.body);

        if (!(batch && courses)) {
            return res.status(400).json({ message: "all fild are required" })
        }
        const findCourse = await couresbatch.findOne({ courses: { $in: courses } })

        if (findCourse) {
            return res.status(400).json({ message: "coures are allready axist" })
        }
        const data = { batch, courses }
        // console.log(data);

        const server = new couresbatch(data)
        await server.save()
        res.status(200).json({
            message: "add couresbatch successfully",
            data: server
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


exports.allmapping = async (req, res) => {
    try {
        const alldata = await couresbatch.find().populate("batch").populate("courses");
        res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



exports.onemapping = async (req, res) => {
    try {
        const { id } = req.params
        const findone = await couresbatch.findById(id)
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}




exports.deletemapping = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);

        const findone = await couresbatch.findByIdAndDelete(id)
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.updatemapping = async (req, res) => {
    try {
        const data = req.body


        const { id } = req.params
        const updatedata = await couresbatch.findByIdAndUpdate(id, data)
        console.log(updatedata);

        res.status(200).json(updatedata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


// CourseBatch Controller mein yeh naya function add karo
exports.getBatchesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Find all mappings that include this course
        const mappings = await couresbatch.find({ 
            courses: { $in: [courseId] } 
        }).populate("batch");
        
        // Extract unique batches from all mappings
        const batches = [];
        const batchIds = new Set();
        
        mappings.forEach(mapping => {
            mapping.batch.forEach(batch => {
                if (!batchIds.has(batch._id.toString())) {
                    batchIds.add(batch._id.toString());
                    batches.push(batch);
                }
            });
        });
        
        res.status(200).json(batches);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Course-wise mappings (course ke saath uske saare batches)
exports.getCourseWiseMappings = async (req, res) => {
    try {
        const mappings = await couresbatch.find()
            .populate("courses")
            .populate("batch");
        
        // Transform data to course-wise format
        const courseWiseData = {};
        
        mappings.forEach(mapping => {
            mapping.courses.forEach(course => {
                if (!courseWiseData[course._id]) {
                    courseWiseData[course._id] = {
                        course: course,
                        batches: []
                    };
                }
                
                // Add unique batches for this course
                mapping.batch.forEach(batch => {
                    const batchExists = courseWiseData[course._id].batches.some(
                        b => b._id.toString() === batch._id.toString()
                    );
                    
                    if (!batchExists) {
                        courseWiseData[course._id].batches.push(batch);
                    }
                });
            });
        });
        
        res.status(200).json(Object.values(courseWiseData));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}