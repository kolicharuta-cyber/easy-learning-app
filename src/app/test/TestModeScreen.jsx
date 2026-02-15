import React, { useEffect, useState } from "react";
import { evaluateTest } from "../upload/ocrHelpers";

function TestModeScreen() {
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // UI clean (same as your code)
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

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {mcqs.length === 0 ? (
          <>
            <h2 style={titleStyle}>Test Mode</h2>
            <p style={{ margin: 0, textAlign: "center", color: "#555" }}>
              No MCQs found. Upload notes first.
            </p>
          </>
        ) : (
          <>
            <h2 style={titleStyle}>Test Mode</h2>

            <div style={scrollArea}>
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
            </div>

            {!result && (
              <button type="button" onClick={handleSubmit} style={btnBlack}>
                Submit Test
              </button>
            )}

            {result && (
              <div style={resultBox}>
                <h3 style={{ margin: 0, textAlign: "center" }}>
                  Score: {result.score} / {result.total}
                </h3>

                {result.fullMarks ? (
                  <p style={{ color: "green", marginTop: 10, textAlign: "center" }}>
                    🎉 Perfect! You’ve mastered this topic.
                  </p>
                ) : (
                  <>
                    <p style={{ marginTop: 10, textAlign: "center", color: "#555" }}>
                      Review incorrect questions and retry.
                    </p>
                    <button type="button" onClick={retryWrong} style={btnBlack}>
                      Retry Wrong Questions
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
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

/* ✅ Keep questions scrollable on mobile */
const scrollArea = {
  maxHeight: "62vh",
  overflowY: "auto",
  paddingRight: 4,
};

const questionBox = {
  border: "1px solid #ddd",
  padding: 14,
  borderRadius: 12,
  marginBottom: 14,
  backgroundColor: "#ffffff",
};

const questionText = {
  lineHeight: 1.7,
  fontSize: 15,
  wordBreak: "break-word",
};

const optionStyle = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  margin: "10px 0",
  cursor: "pointer",
};

const optionText = {
  flex: 1,
  lineHeight: 1.7,
  fontSize: 15,
  wordBreak: "break-word",
};

const explanationStyle = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  backgroundColor: "#f5f5f5",
  border: "1px solid #ddd",
  fontSize: 14,
  color: "#444",
  lineHeight: 1.6,
  wordBreak: "break-word",
};

const btnBlack = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700,
};

const resultBox = {
  padding: 14,
  borderRadius: 12,
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
};

export default TestModeScreen;
