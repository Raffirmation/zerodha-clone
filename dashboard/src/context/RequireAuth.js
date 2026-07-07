import React, { useEffect, useState } from "react";
import api from "../utils/api";

// Wraps the dashboard and verifies the JWT (sent automatically via the
// httpOnly cookie) with the backend before rendering anything. If the
// user isn't authenticated, they're bounced back to the main site's
// login page instead of seeing dashboard data.
function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | redirecting

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setStatus("ok"))
      .catch(() => {
        setStatus("redirecting");
        window.location.href =
          process.env.REACT_APP_LOGIN_URL || "http://localhost:3000/login";
      });
  }, []);

  if (status !== "ok") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        {status === "checking" ? "Checking session..." : "Redirecting to login..."}
      </div>
    );
  }

  return children;
}

export default RequireAuth;
