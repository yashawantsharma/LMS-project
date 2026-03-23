const timetablemodel = require("../Model/timetableModel")

exports.addrouter = async (req, res) => {

  try {

    const { days, dayTimes, course, tutor, batch } = req.body;

    const schedule = days.map(day => ({
      day,
      time: dayTimes[day]
    }));

    const newtimetable = new timetablemodel({
      schedule,
      course,
      batch,
      tutor
    });

    const savedtimetable = await newtimetable.save();

    return res.status(200).json(savedtimetable);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};
exports.alltimetable = async (req, res) => {
    try {
        const alldata = await timetablemodel.find().populate("course").populate("tutor")
        return res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
exports.onetimetable = async (req, res) => {
    try {
        const { id } = req.params
        const onetimetable = await timetablemodel.findById(id).populate("course").populate("tutor")
        return res.status(200).json(onetimetable)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
exports.deletetimetable = async (req, res) => {
    try {
        const { id } = req.params
        const deletetimetable = await timetablemodel.findOneAndDelete(id)
        return res.status(200).json(deletetimetable)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
exports.updatetimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatetimetable = await timetable
        model.findByIdAndUpdate(id, data, {
            new: true
        });
        if (!updatetimetable) {
            return res.status(404).json({
                message: "timetable not found"
            });
        }
        res.status(200).json(updatetimetable);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
exports.activetimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const timetable = await timetablemodel.findById(id);
        if (!timetable) {
            return res.status(404).json({
                message: "timetable not found"
            });
        }
        const updated = await timetablemodel.findByIdAndUpdate(
            id, {
            isactive: !timetable.isactive
        }, {
            new: true
        });
        res.status(200).json(updated);
    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};