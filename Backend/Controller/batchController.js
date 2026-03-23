const usermodel = require("../Model/userModel");
const batchmodel = require("../Model/batchModel");
exports.addBatch = async (req, res) => {
  try {
    const data = req.body;
   
    
    const batch = new batchmodel(data);
     console.log(batch);
    const saveBatch = await batch.save();
    res.status(200).json({ message: "Batch added successfully", batch: saveBatch });
  }
    catch (error) {
    res.status(400).json({ error: error.message });
    }
};
exports.getAllBatch = async (req, res) => {
    try {
        const allBatch = await batchmodel.find().populate("course").populate("tutor").populate("student")
        return res.status(200).json(allBatch);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getBatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const batchData = await batchmodel.findById(id).populate("course").populate("tutor");
        return res.status(200).json(batchData);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const batchDelete = await batchmodel.findOneAndDelete(id);
        return res.status(200).json(batchDelete);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log(">>>update data", data);
        const batchUpdate = await batchmodel.findByIdAndUpdate(id, data, { new: true });
        if (!batchUpdate) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json(batchUpdate);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.activeBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await batchmodel.findById(id);
        if (!batch) {
            return res.status(404).json({
                message: "Batch not found"
            });
        }
        const updated = await batchmodel.findByIdAndUpdate(
            id,
            { isActive: !batch.isActive },  
            { new: true }
        );
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};