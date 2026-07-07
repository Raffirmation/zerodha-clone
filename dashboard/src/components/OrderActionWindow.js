import React, { useState } from "react";
import api from "../utils/api";

// stock: { symbol, name, price }  mode: "BUY" | "SELL"
// defaultProductType lets Holdings/Positions force CNC/MIS since that's
// what determines whether the sell is coming out of holdings or positions.
const OrderActionWindow = ({ stock, mode, defaultProductType = "CNC", onClose, onSuccess }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [productType, setProductType] = useState(defaultProductType);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = (Number(qty) || 0) * (Number(price) || 0);

  const handleSubmit = async () => {
    setError("");
    if (!qty || qty <= 0 || !price || price <= 0) {
      setError("Enter a valid quantity and price.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/portfolio/orders", {
        symbol: stock.symbol,
        name: stock.name,
        qty: Number(qty),
        price: Number(price),
        mode,
        productType,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "6px",
          padding: "24px",
          width: "360px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 style={{ marginBottom: 4 }}>
          {mode === "BUY" ? "Buy" : "Sell"} {stock.symbol}
        </h4>
        <p style={{ color: "#6c6c6c", marginBottom: 16, fontSize: "0.85rem" }}>{stock.name}</p>

        {error && (
          <div
            style={{
              background: "#fdecea",
              color: "#b3261e",
              padding: "8px 10px",
              borderRadius: "4px",
              marginBottom: "12px",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem", color: "#6c6c6c" }}>Qty.</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.8rem", color: "#6c6c6c" }}>Price</label>
            <input
              type="number"
              min="0.05"
              step="0.05"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "0.8rem", color: "#6c6c6c", marginRight: "10px" }}>
            <input
              type="radio"
              checked={productType === "CNC"}
              onChange={() => setProductType("CNC")}
              disabled={defaultProductType !== "CNC" && mode === "SELL"}
            />{" "}
            CNC (Delivery)
          </label>
          <label style={{ fontSize: "0.8rem", color: "#6c6c6c" }}>
            <input
              type="radio"
              checked={productType === "MIS"}
              onChange={() => setProductType("MIS")}
              disabled={defaultProductType !== "MIS" && mode === "SELL"}
            />{" "}
            MIS (Intraday)
          </label>
        </div>

        <p style={{ fontSize: "0.85rem", marginBottom: "14px" }}>
          Total: <strong>₹{total.toFixed(2)}</strong>
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={mode === "BUY" ? "btn btn-green" : "btn btn-blue"}
            onClick={handleSubmit}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            {submitting ? "Placing..." : mode === "BUY" ? "Buy" : "Sell"}
          </button>
          <button className="btn" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderActionWindow;
