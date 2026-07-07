import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Funds = () => {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState(null); // "ADD" | "WITHDRAW" | null
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = () => {
    api
      .get("/portfolio/wallet")
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(0));
  };

  useEffect(loadWallet, []);

  const handleSubmit = async () => {
    setError("");
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = mode === "ADD" ? "/portfolio/wallet/add" : "/portfolio/wallet/withdraw";
      const res = await api.post(endpoint, { amount: value });
      setBalance(res.data.balance);
      setMode(null);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <button className="btn btn-green" onClick={() => setMode("ADD")}>
          Add funds
        </button>
        <button className="btn btn-blue" onClick={() => setMode("WITHDRAW")}>
          Withdraw
        </button>
      </div>

      {mode && (
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
          onClick={() => setMode(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "6px",
              padding: "24px",
              width: "320px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ marginBottom: "12px" }}>
              {mode === "ADD" ? "Add funds" : "Withdraw funds"}
            </h5>
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
            <input
              type="number"
              min="1"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "14px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={mode === "ADD" ? "btn btn-green" : "btn btn-blue"}
                onClick={handleSubmit}
                disabled={submitting}
                style={{ flex: 1 }}
              >
                {submitting ? "Processing..." : "Confirm"}
              </button>
              <button className="btn" onClick={() => setMode(null)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{balance === null ? "..." : balance.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{balance === null ? "..." : balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <button className="btn btn-blue">Open Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
