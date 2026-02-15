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
                  <span style={dotStyle}>•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>No study content found. Upload notes first.</p>
          )}
        </div>

        <div style={row}>
          <button
            type="button"
            style={{ ...btnNav, opacity: page === 1 ? 0.6 : 1 }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ⬅ Prev
          </button>

          <button
            type="button"
            style={{ ...btnNav, opacity: page === totalPages ? 0.6 : 1 }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next ➡
          </button>
        </div>

        <button
          type="button"
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

/* ✅ Plain Background + Center */
const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#F8EFE6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

/* ✅ Mobile-friendly Card */
const cardStyle = {
  width: "100%",
  maxWidth: 420,
  backgroundColor: "white",
  padding: 20,
  borderRadius: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
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
  color: "#555",
  fontSize: 14,
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
  gap: 10,
  marginBottom: 10,
  lineHeight: 1.5,
  fontSize: 14,
};

const dotStyle = {
  fontSize: 18,
  lineHeight: "18px",
  marginTop: 1,
};

const row = { display: "flex", gap: 10 };

const btnNav = {
  flex: 1,
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700,
};

const startBtn = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700,
};

export default StudyModeScreen;
