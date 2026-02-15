import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterScreen({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      alert("All fields are required");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    sessionStorage.setItem("easylearning_token", "dummy-jwt-token");
    if (onRegister) onRegister();
    navigate("/home");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Register</h2>
        <p style={subTitleStyle}>Create your account ✨</p>

        <form onSubmit={handleRegister} style={formStyle}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            REGISTER
          </button>
        </form>

        <div style={bottomText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={linkStyle}>
            Login
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

export default RegisterScreen;
