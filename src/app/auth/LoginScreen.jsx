// src/auth/LoginScreen.jsx
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
    onLogin();
    navigate("/home");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
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

/* ---------- SAME STYLES ---------- */

const pageStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundImage: "url('/bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const cardStyle = {
  backgroundColor: "white",
  width: "420px",
  padding: "40px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "center",
};

const titleStyle = {
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  width: "85%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "#f2f2f2",
  fontSize: "15px",
};

const buttonStyle = {
  width: "85%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
};

const bottomText = {
  marginTop: "22px",
  fontSize: "15px",
};

const linkStyle = {
  fontWeight: "600",
  cursor: "pointer",
  marginLeft: "5px",
};

export default LoginScreen;
