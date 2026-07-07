const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    avgPrice: { type: Number, required: true, min: 0 },
    // CNC = delivery, shows up under Holdings. MIS = intraday, shows up under Positions.
    productType: { type: String, enum: ["CNC", "MIS"], required: true },
  },
  { timestamps: true }
);

// One row per user + symbol + product type - buying more of the same
// stock/product updates qty & avgPrice instead of creating a new row.
portfolioItemSchema.index({ user: 1, symbol: 1, productType: 1 }, { unique: true });

module.exports = mongoose.model("PortfolioItem", portfolioItemSchema);
