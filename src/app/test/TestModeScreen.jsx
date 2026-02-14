import React, { useEffect, useState } from "react";
import { evaluateTest } from "../upload/ocrHelpers";

function TestModeScreen() {
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // UI clean (your original - NO extra replacements)
  const uiClean = (s) =>
    String(s || "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b([A-Z]{2,})([A-Z][a-z])\b/g, "$1 $2")
      .replace(
        /\b(of|to|in|on|for|with|from|and|or|is|are|was|were|a|an|the)([a-z]{3,})\b/gi,
        "$1 $2"
      )
      .replace(/[()]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

  useEffect(() => {
    const stored = sessionStorage.getItem("mcqs");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMcqs(Array.isArray(parsed) ? parsed : []);
      } catch {
        setMcqs([]);
      }
    }
  }, []);

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    const answerArray = mcqs.map((_, i) =>
      answers[i] === undefined ? null : answers[i]
    );
    const res = evaluateTest(answerArray, mcqs);
    setResult(res);
  };

  const retryWrong = () => {
    if (!result) return;
    const wrongOnly = result.wrongIndices.map((i) => mcqs[i]);
    setMcqs(wrongOnly);
    setAnswers({});
    setResult(null);
    sessionStorage.setItem("mcqs", JSON.stringify(wrongOnly));
  };

  // ✅ Outer shell with fixed background layer
  return (
    <div style={shell}>
      <div style={bgLayer} />

      {mcqs.length === 0 ? (
        <div style={centerCard}>
          <h2 style={{ marginTop: 0 }}>Test Mode</h2>
          <p>No MCQs found. Upload notes first.</p>
        </div>
      ) : (
        <div style={mainCard}>
          <h2 style={{ marginTop: 0, textAlign: "center" }}>Test Mode</h2>

          {mcqs.map((q, qi) => (
            <div key={qi} style={questionBox}>
              <div style={questionText}>
                <b>Q{qi + 1}:</b> {uiClean(q.question)}
              </div>

              {q.options.map((opt, oi) => (
                <label key={oi} style={optionStyle}>
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => handleSelect(qi, oi)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={optionText}>{uiClean(opt)}</span>
                </label>
              ))}

              {result && (
                <div style={explanationStyle}>
                  <b>Explanation:</b> {uiClean(q.explanation)}
                </div>
              )}
            </div>
          ))}

          {!result && (
            <button onClick={handleSubmit} style={submitBtn}>
              Submit Test
            </button>
          )}

          {result && (
            <div style={resultBox}>
              <h3 style={{ margin: 0 }}>
                Score: {result.score} / {result.total}
              </h3>

              {result.fullMarks ? (
                <p style={{ color: "green", marginTop: 8 }}>
                  🎉 Perfect! You’ve mastered this topic.
                </p>
              ) : (
                <>
                  <p style={{ marginTop: 8 }}>
                    Review incorrect questions and retry.
                  </p>
                  <button onClick={retryWrong} style={retryBtn}>
                    Retry Wrong Questions
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ✅ This wrapper sits inside your layout but covers full screen */
const shell = {
  position: "relative",
  minHeight: "100vh",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

/* ✅ Guaranteed background image (ignores parent beige) */
const bgLayer = {
  position: "fixed",
  inset: 0,
  background: `url("/bg.jpg") center / cover no-repeat`,
  zIndex: -1,
};

const mainCard = {
  width: "100%",
  maxWidth: "560px",
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  marginTop: "20px",
};

const centerCard = {
  width: "100%",
  maxWidth: "560px",
  marginTop: "18px",
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  textAlign: "center",
};

const questionBox = {
  border: "1px solid #ddd",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "14px",
  backgroundColor: "#ffffff",
};

const questionText = {
  lineHeight: 1.7,
  fontSize: "15px",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

const optionStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  margin: "10px 0",
  cursor: "pointer",
};

const optionText = {
  flex: 1,
  lineHeight: 1.7,
  fontSize: "15px",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

const explanationStyle = {
  marginTop: "10px",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
  border: "1px solid #ddd",
  fontSize: "14px",
  color: "#444",
  lineHeight: 1.6,
  wordBreak: "break-word",
};

const submitBtn = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const resultBox = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
};

const retryBtn = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default TestModeScreen;
