const mapping = require("../Model/mappingModel")


exports.addmapping = async (req, res) => {
    try {
        const { skills, courses } = req.body
        // console.log(req.body);

        if (!(skills && courses)) {
            return res.status(400).json({ message: "all fild are required" })
        }
        const findCourse = await mapping.findOne({ courses: { $in: courses } })

        if (findCourse) {
            return res.status(400).json({ message: "coures are allready axist" })
        }
        const data = { skills, courses }
        // console.log(data);

        const server = new mapping(data)
        await server.save()
        res.status(200).json({
            message: "add mapping successfully",
            data: server
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


exports.allmapping = async (req, res) => {
    try {
        const alldata = await mapping.find().populate("skills")
    .populate("courses");
        res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



exports.onemapping = async (req, res) => {
    try {
        const { id } = req.params
        const findone = await mapping.findById(id)
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}




exports.deletemapping = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);

        const findone = await mapping.findByIdAndDelete(id)
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.updatemapping = async (req, res) => {
    try {
        const data = req.body


        const { id } = req.params
        const updatedata = await mapping.findByIdAndUpdate(id, data)
        console.log(updatedata);

        res.status(200).json(updatedata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}