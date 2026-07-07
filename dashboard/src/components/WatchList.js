import React, { useState } from "react";
import watchlistData from "../data/watchlistData";
import OrderActionWindow from "./OrderActionWindow";

const WatchList = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // { stock, mode }
  const [toast, setToast] = useState("");

  const filtered = watchlistData.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrderSuccess = (mode, symbol) => {
    setSelected(null);
    setToast(`${mode === "BUY" ? "Bought" : "Sold"} ${symbol} successfully.`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="counts">
          {" "}
          {filtered.length} / {watchlistData.length}
        </span>
      </div>

      {toast && (
        <div
          style={{
            background: "#e6f4ea",
            color: "#1e7e34",
            padding: "6px 10px",
            fontSize: "0.8rem",
            margin: "8px",
            borderRadius: "4px",
          }}
        >
          {toast}
        </div>
      )}

      <ul className="list">
        {filtered.map((stock) => (
          <li
            key={stock.symbol}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{stock.symbol}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6c6c6c" }}>
                ₹{stock.price.toFixed(2)}
              </p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className="btn btn-green"
                style={{ padding: "2px 10px", fontSize: "0.75rem" }}
                onClick={() => setSelected({ stock, mode: "BUY" })}
              >
                Buy
              </button>
              <button
                className="btn btn-blue"
                style={{ padding: "2px 10px", fontSize: "0.75rem" }}
                onClick={() => setSelected({ stock, mode: "SELL" })}
              >
                Sell
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <OrderActionWindow
          stock={selected.stock}
          mode={selected.mode}
          defaultProductType="CNC"
          onClose={() => setSelected(null)}
          onSuccess={() => handleOrderSuccess(selected.mode, selected.stock.symbol)}
        />
      )}
    </div>
  );
};

export default WatchList;
