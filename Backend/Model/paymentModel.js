const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  feesId: { type: mongoose.Schema.Types.ObjectId, ref: "fees" }, // model name same rakho
  paidAmount: Number,
  previousPaid: Number,
  remaining: Number,
  paymentDate: { type: Date, default: Date.now },
  nextDueDate: Date
});

const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;