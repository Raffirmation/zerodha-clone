import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Summary = () => {
  const [balance, setBalance] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data.user)).catch(() => {});
    api
      .get("/portfolio/wallet")
      .then((res) => setBalance(res.data.balance))
      .catch(() => setBalance(0));
    api
      .get("/portfolio/holdings")
      .then((res) => setHoldings(res.data.holdings))
      .catch(() => setHoldings([]));
  }, []);

  const investment = holdings.reduce((sum, h) => sum + h.qty * h.avgPrice, 0);

  return (
    <>
      <div className="username">
        <h6>Hi, {user?.name || "there"}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{balance === null ? "..." : balance.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Holdings value <span>{investment.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="second">
            <p>
              Investment <span>{investment.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
