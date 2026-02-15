import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    sessionStorage.setItem("easylearning_token", "dummy-jwt-token");
    if (onLogin) onLogin();
    navigate("/home");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        <p style={subTitleStyle}>Login your Account</p>

        <form onSubmit={handleLogin} style={formStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            LOGIN
          </button>
        </form>

        <div style={bottomText}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} style={linkStyle}>
            Register
          </span>
        </div>
      </div>
    </div>
  );
}

/* ✅ Same theme as other screens */
const pageStyle = {
  minHeight: "100vh",
  padding: 16,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F8EFE6",
};

const cardStyle = {
  backgroundColor: "white",
  width: "100%",
  maxWidth: 420,
  padding: 22,
  borderRadius: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const titleStyle = {
  margin: 0,
  textAlign: "center",
  fontSize: 22,
  fontWeight: 800,
};

const subTitleStyle = {
  margin: 0,
  textAlign: "center",
  fontSize: 14,
  color: "#555",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 6,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid #ddd",
  backgroundColor: "#f7f7f7",
  fontSize: 14,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 14,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 6,
};

const bottomText = {
  marginTop: 6,
  fontSize: 14,
  textAlign: "center",
  color: "#555",
};

const linkStyle = {
  fontWeight: 800,
  cursor: "pointer",
  marginLeft: 5,
  color: "black",
};

export default LoginScreen;
