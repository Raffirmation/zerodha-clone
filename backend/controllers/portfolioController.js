const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const PortfolioItem = require("../models/PortfolioItem");
const Order = require("../models/Order");

// Gets the user's wallet, creating one with the starting demo balance
// the first time they ever ask for it.
const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId });
  }
  return wallet;
};

// GET /api/portfolio/wallet
exports.getWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Could not load wallet.", error: err.message });
  }
};

// POST /api/portfolio/wallet/add  { amount }
exports.addFunds = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter a valid amount greater than 0." });
    }
    const wallet = await getOrCreateWallet(req.user._id);
    wallet.balance += amount;
    await wallet.save();
    res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Could not add funds.", error: err.message });
  }
};

// POST /api/portfolio/wallet/withdraw  { amount }
exports.withdrawFunds = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter a valid amount greater than 0." });
    }
    const wallet = await getOrCreateWallet(req.user._id);
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient available cash to withdraw." });
    }
    wallet.balance -= amount;
    await wallet.save();
    res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Could not withdraw funds.", error: err.message });
  }
};

// GET /api/portfolio/holdings
exports.getHoldings = async (req, res) => {
  try {
    const holdings = await PortfolioItem.find({ user: req.user._id, productType: "CNC" }).sort({
      symbol: 1,
    });
    res.json({ success: true, holdings });
  } catch (err) {
    res.status(500).json({ message: "Could not load holdings.", error: err.message });
  }
};

// GET /api/portfolio/positions
exports.getPositions = async (req, res) => {
  try {
    const positions = await PortfolioItem.find({ user: req.user._id, productType: "MIS" }).sort({
      symbol: 1,
    });
    res.json({ success: true, positions });
  } catch (err) {
    res.status(500).json({ message: "Could not load positions.", error: err.message });
  }
};

// GET /api/portfolio/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Could not load orders.", error: err.message });
  }
};

// POST /api/portfolio/orders
// body: { symbol, name, qty, price, mode: BUY|SELL, productType: CNC|MIS }
exports.placeOrder = async (req, res) => {
  const { symbol, name, qty, price, mode, productType } = req.body;

  if (!symbol || !name || !qty || !price || !mode || !productType) {
    return res.status(400).json({ message: "Missing required order fields." });
  }
  if (qty <= 0 || price <= 0) {
    return res.status(400).json({ message: "Quantity and price must be greater than 0." });
  }
  if (!["BUY", "SELL"].includes(mode)) {
    return res.status(400).json({ message: "Mode must be BUY or SELL." });
  }
  if (!["CNC", "MIS"].includes(productType)) {
    return res.status(400).json({ message: "Product type must be CNC or MIS." });
  }

  const upperSymbol = symbol.toUpperCase();
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
      const currentWallet = wallet || (await Wallet.create([{ user: req.user._id }], { session }))[0];

      const existing = await PortfolioItem.findOne({
        user: req.user._id,
        symbol: upperSymbol,
        productType,
      }).session(session);

      const cost = qty * price;

      if (mode === "BUY") {
        if (currentWallet.balance < cost) {
          throw new Error("INSUFFICIENT_FUNDS");
        }
        currentWallet.balance -= cost;
        await currentWallet.save({ session });

        if (existing) {
          const totalQty = existing.qty + qty;
          const totalCost = existing.qty * existing.avgPrice + cost;
          existing.qty = totalQty;
          existing.avgPrice = totalCost / totalQty;
          await existing.save({ session });
        } else {
          await PortfolioItem.create(
            [{ user: req.user._id, symbol: upperSymbol, name, qty, avgPrice: price, productType }],
            { session }
          );
        }
      } else {
        // SELL
        if (!existing || existing.qty < qty) {
          throw new Error("INSUFFICIENT_HOLDINGS");
        }
        existing.qty -= qty;
        currentWallet.balance += cost;
        await currentWallet.save({ session });

        if (existing.qty === 0) {
          await PortfolioItem.deleteOne({ _id: existing._id }).session(session);
        } else {
          await existing.save({ session });
        }
      }

      await Order.create(
        [{ user: req.user._id, symbol: upperSymbol, name, qty, price, mode, productType }],
        { session }
      );
    });

    res.status(201).json({ success: true, message: `${mode} order executed.` });
  } catch (err) {
    if (err.message === "INSUFFICIENT_FUNDS") {
      return res.status(400).json({ message: "Insufficient funds for this order." });
    }
    if (err.message === "INSUFFICIENT_HOLDINGS") {
      return res.status(400).json({ message: "You don't hold enough quantity to sell." });
    }
    res.status(500).json({ message: "Order could not be placed.", error: err.message });
  } finally {
    session.endSession();
  }
};
