import React, { useEffect, useState } from "react";
import api from "../utils/api";
import OrderActionWindow from "./OrderActionWindow";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadPositions = () => {
    api
      .get("/portfolio/positions")
      .then((res) => setPositions(res.data.positions))
      .catch(() => setPositions([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadPositions, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading positions...</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <tbody>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th></th>
            </tr>
            {positions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "16px" }}>
                  No open intraday (MIS) positions. Buy a stock with product type MIS to see it here.
                </td>
              </tr>
            )}
            {positions.map((p) => (
              <tr key={p._id}>
                <td>MIS</td>
                <td>{p.symbol}</td>
                <td>{p.qty}</td>
                <td>{p.avgPrice.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-blue"
                    style={{ padding: "2px 10px", fontSize: "0.75rem" }}
                    onClick={() =>
                      setSelected({ stock: { symbol: p.symbol, name: p.name, price: p.avgPrice } })
                    }
                  >
                    Square off
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderActionWindow
          stock={selected.stock}
          mode="SELL"
          defaultProductType="MIS"
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            loadPositions();
          }}
        />
      )}
    </>
  );
};

export default Positions;
