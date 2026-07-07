import React, { useEffect, useState } from "react";
import api from "../utils/api";
import OrderActionWindow from "./OrderActionWindow";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadHoldings = () => {
    api
      .get("/portfolio/holdings")
      .then((res) => setHoldings(res.data.holdings))
      .catch(() => setHoldings([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadHoldings, []);

  const totalInvestment = holdings.reduce((sum, h) => sum + h.qty * h.avgPrice, 0);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading holdings...</p>;
  }

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <tbody>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>Cur. val</th>
              <th></th>
            </tr>
            {holdings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "16px" }}>
                  You don't have any holdings yet. Buy a stock from the watchlist to get started.
                </td>
              </tr>
            )}
            {holdings.map((h) => (
              <tr key={h._id}>
                <td>{h.symbol}</td>
                <td>{h.qty}</td>
                <td>{h.avgPrice.toFixed(2)}</td>
                <td>{(h.qty * h.avgPrice).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-blue"
                    style={{ padding: "2px 10px", fontSize: "0.75rem" }}
                    onClick={() =>
                      setSelected({ stock: { symbol: h.symbol, name: h.name, price: h.avgPrice } })
                    }
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
      </div>

      {selected && (
        <OrderActionWindow
          stock={selected.stock}
          mode="SELL"
          defaultProductType="CNC"
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            loadHoldings();
          }}
        />
      )}
    </>
  );
};

export default Holdings;
