const feeshmodel = require("../Model/feesModel")
const Payment = require("../Model/paymentModel");
exports.addfeesh = async (req, res) => {
    try {
        const data = req.body;
        const feesh = new feeshmodel(data);
        
        const savefeesh = await feesh.save();
        res.status(200).json({ message: "feesh added successfully", feesh: savefeesh });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.allfeesh = async (req, res) => {
    try {
        const allfeesh = await feeshmodel.find().populate("course") .populate({
    path: "student",
    populate: {
      path: "visitor",
      model: "visitor"
    }
  })
        return res.status(200).json(allfeesh);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.onefeesh = async (req, res) => {
    try {
        const { id } = req.params;
        const feeshData = await feeshmodel.findById(id).populate("batch").populate("tutor");
        return res.status(200).json(feeshData);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deletefeesh = async (req, res) => {
    try {
        const { id } = req.params;
        const feeshDelete = await feeshmodel.findOneAndDelete(id);
        return res.status(200).json(feeshDelete);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updatefeesh = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log(">>>update data", data);
        const feeshUpdate = await feeshmodel.findByIdAndUpdate(id, data, { new: true });
        if (!feeshUpdate) {
            return res.status(404).json({ message: "feesh not found" });
        }
        res.status(200).json(feeshUpdate);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addpayment = async (req, res) => {
  try {

    const { feesId, amount, nextDueDate } = req.body;

    const fees = await feeshmodel.findById(feesId);

    if (!fees) {
      return res.status(404).json({ message: "Fees not found" });
    }

    const previousPaid = fees.amountpaid || 0;
    const newTotal = previousPaid + amount;
    const remaining = fees.courseprice - newTotal;

    const payment = await Payment.create({
      feesId,
      paidAmount: amount,
      previousPaid,
      remaining,
      nextDueDate
    });

    fees.amountpaid = newTotal;
    fees.remainingamount = remaining;
    fees.status = remaining <= 0 ? "paid" : "partial";

    await fees.save();

    res.status(200).json(payment);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
