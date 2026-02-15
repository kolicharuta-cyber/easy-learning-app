import React from "react";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  const actions = [
    { title: "Upload Notes", desc: "Images / PDF OCR", onClick: () => navigate("/upload") },
    { title: "Study Mode", desc: "One-line notes", onClick: () => navigate("/study") },
    { title: "Test Mode", desc: "MCQs + Score", onClick: () => navigate("/test") },
  ];

  return (
    <div style={page}>
      <div style={card}>
        {/* ✅ Title center */}
        <h1 style={title}>Easy Learning App</h1>
        <p style={subtitle}>Learn from notes → Study → Test</p>

        {/* ✅ Vertical buttons (mobile style) */}
        <div style={list}>
          {actions.map((a, i) => (
            <button key={i} style={itemBtn} onClick={a.onClick}>
              <div>
                <div style={itemTitle}>{a.title}</div>
                <div style={itemDesc}>{a.desc}</div>
              </div>
              <div style={arrow}>›</div>
            </button>
          ))}
        </div>

        {/* ✅ Logout bottom full width */}
        <button
          style={logoutBtn}
          onClick={() => {
            sessionStorage.removeItem("easylearning_token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

/* ✅ pastel beige background + full center */
const page = {
  minHeight: "100vh",
  backgroundColor: "#F8EFE6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

const card = {
  width: "100%",
  maxWidth: 420,
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
};

const title = {
  margin: 0,
  textAlign: "center",
  fontSize: 26,
  fontWeight: 800,
};

const subtitle = {
  margin: "8px 0 16px",
  textAlign: "center",
  color: "#444",
  fontSize: 14,
};

const list = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const itemBtn = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  border: "1px solid #e7e7e7",
  borderRadius: 14,
  padding: 14,
  backgroundColor: "#fff",
  cursor: "pointer",
  textAlign: "left",
};

const itemTitle = { fontSize: 16, fontWeight: 800 };
const itemDesc = { marginTop: 4, fontSize: 13, color: "#666" };
const arrow = { fontSize: 26, fontWeight: 900, lineHeight: 1 };

const logoutBtn = {
  marginTop: 14,
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
};

export default HomeScreen;
