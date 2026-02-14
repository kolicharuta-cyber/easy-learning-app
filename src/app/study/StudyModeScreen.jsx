import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StudyModeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const notes = useMemo(() => location.state?.notes ?? [], [location.state]);

  const perPage = 5;
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [notes]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(notes.length / perPage)),
    [notes.length]
  );

  const currentNotes = useMemo(() => {
    const start = (page - 1) * perPage;
    return notes.slice(start, start + perPage);
  }, [notes, page]);

  const startTest = () => {
    const stored = sessionStorage.getItem("mcqs");
    if (!stored) {
      alert("MCQs not found. Upload notes again.");
      return;
    }
    navigate("/test");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Study Mode</h2>

        <p style={subTitleStyle}>
          Page <b>{page}</b> / <b>{totalPages}</b>
        </p>

        <div style={studyBox}>
          {notes.length > 0 ? (
            <ul style={listStyle}>
              {currentNotes.map((note, index) => (
                <li key={index} style={noteItem}>
                  <b style={dotStyle}>•</b>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No study content found. Upload notes first.</p>
          )}
        </div>

        <div style={row}>
          <button
            style={{ ...btnNav, opacity: page === 1 ? 0.6 : 1 }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ⬅ Prev
          </button>

          <button
            style={{ ...btnNav, opacity: page === totalPages ? 0.6 : 1 }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next ➡
          </button>
        </div>

        <button
          onClick={startTest}
          style={{ ...startBtn, opacity: notes.length === 0 ? 0.6 : 1 }}
          disabled={notes.length === 0}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

/* ✅ Background image (no beige) */
const pageStyle = {
  padding: "16px",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  backgroundImage: "url('/bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

/* ✅ White card */
const cardStyle = {
  width: "100%",
  maxWidth: "560px",
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const titleStyle = { margin: 0, textAlign: "center" };

const subTitleStyle = {
  margin: 0,
  textAlign: "center",
  color: "#555",
  fontSize: "14px",
};

const studyBox = {
  padding: 14,
  border: "1px solid #ddd",
  borderRadius: 12,
  backgroundColor: "#ffffff",
  maxHeight: "55vh",
  overflowY: "auto",
};

const listStyle = { listStyle: "none", padding: 0, margin: 0 };

const noteItem = {
  display: "flex",
  gap: "8px",
  marginBottom: "10px",
  lineHeight: 1.5,
  fontSize: "14px",
};

const dotStyle = { fontSize: "18px", lineHeight: "18px" };

const row = { display: "flex", gap: "10px" };

/* ✅ Black buttons */
const btnNav = {
  flex: 1,
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const startBtn = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default StudyModeScreen;
