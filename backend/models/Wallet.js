const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 100000, // virtual starting cash for the paper-trading demo
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
