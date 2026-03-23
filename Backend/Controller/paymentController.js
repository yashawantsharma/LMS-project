const mapping = require("../Model/paymentModel")
const feesmodel = require("../Model/feesModel")

exports.addpayment = async (req, res) => {
  try {

    const { feesId, amount, nextDueDate } = req.body;

    // console.log("Incoming feesId:", feesId);

    const fees = await feesmodel.findById(feesId);

    if (!fees) {
      return res.status(404).json({ message: "Fees not found" });
    }

    const previousPaid = fees.amountpaid || 0;
    const newTotal = previousPaid + amount;
    const remaining = fees.courseprice - newTotal;

    const payment = await mapping.create({
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

    res.json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.allpayment = async (req, res) => {
    try {
        const alldata = await mapping.find().populate("feesId");
        res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.onepayment = async (req, res) => {
  try {

    const { id } = req.params;

    const payments = await mapping.find({
      feesId: id
    }).populate("feesId");

    res.status(200).json(payments || []);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};