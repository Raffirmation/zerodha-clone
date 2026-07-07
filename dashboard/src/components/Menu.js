import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Holdings", path: "/holdings" },
  { label: "Positions", path: "/positions" },
  { label: "Funds", path: "/funds" },
  { label: "Apps", path: "/apps" },
];

const Menu = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleProfileClick = async () => {
    await api.post("/auth/logout");
    window.location.href =
      process.env.REACT_APP_LOGIN_URL || "http://localhost:3000/login";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ZU";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => (isActive ? "menu-active" : "")}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#2f2f2f" : "#6c6c6c",
                  fontWeight: isActive ? "600" : "400",
                })}
              >
                <p>{item.label}</p>
              </NavLink>
            </li>
          ))}
        </ul>
        <hr />
        <div
          className="profile"
          onClick={handleProfileClick}
          title="Click to log out"
          style={{ cursor: "pointer" }}
        >
          <div className="avatar">{initials}</div>
          <p className="username">{user?.name || "USERID"}</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
