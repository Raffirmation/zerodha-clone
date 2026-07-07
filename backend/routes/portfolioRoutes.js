const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getWallet,
  addFunds,
  withdrawFunds,
  getHoldings,
  getPositions,
  getOrders,
  placeOrder,
} = require("../controllers/portfolioController");

router.use(protect); // every route below requires a valid JWT

router.get("/wallet", getWallet);
router.post("/wallet/add", addFunds);
router.post("/wallet/withdraw", withdrawFunds);

router.get("/holdings", getHoldings);
router.get("/positions", getPositions);

router.get("/orders", getOrders);
router.post("/orders", placeOrder);

module.exports = router;
