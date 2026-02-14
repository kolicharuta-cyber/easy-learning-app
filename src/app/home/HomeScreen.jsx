import React from "react";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <div style={homeContainer}>
        <h1>Easy Learning App</h1>
        <p>Welcome Students</p>

        <div style={buttonSection}>
          <button onClick={() => navigate("/upload")} style={cardStyle}>
            Upload Notes
          </button>
          <button onClick={() => navigate("/study")} style={cardStyle}>
            Study Mode
          </button>
          <button onClick={() => navigate("/test")} style={cardStyle}>
            Test Mode
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ Full page background image + center */
const pageStyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundImage: "url('/bg.jpg')", // ✅ image background
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

/* ✅ White card in center */
const homeContainer = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "18px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  minWidth: "420px",
};

/* ✅ Buttons row */
const buttonSection = {
  display: "flex",
  gap: "15px",
  marginTop: "30px",
  justifyContent: "center",
  flexWrap: "wrap",
};

/* ✅ Black buttons */
const cardStyle = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "14px 20px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "15px",
};

export default HomeScreen;
