const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    productType: { type: String, enum: ["CNC", "MIS"], required: true },
    status: { type: String, default: "EXECUTED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
