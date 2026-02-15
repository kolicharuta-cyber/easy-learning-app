import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  extractTextFromFiles,
  generateSummaryLines,
  generateMcqs,
} from "./ocrHelpers";

function UploadNotesScreen() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);

  // ✅ APPEND new files (no Ctrl/Shift needed)
  const appendFiles = (incoming) => {
    setFiles((prev) => {
      const map = new Map();

      // keep old
      prev.forEach((f) => {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        map.set(key, f);
      });

      // add new
      incoming.forEach((f) => {
        const key = `${f.name}-${f.size}-${f.lastModified}`;
        map.set(key, f);
      });

      return Array.from(map.values());
    });
  };

  const handlePick = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) appendFiles(selected);

    // ✅ super important: allow selecting again immediately
    e.target.value = null;
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    setFiles([]);
    setExtractedText("");
    setProgressInfo(null);
  };

  const handleExtract = async () => {
    if (!files.length) {
      alert("At least 1 image/PDF select kar.");
      return;
    }

    setLoading(true);
    setExtractedText("");
    setProgressInfo({ status: "Starting...", progress: 0 });

    try {
      const text = await extractTextFromFiles(files, (p) => setProgressInfo(p));

      if (!text || text.trim().length < 30) {
        alert("Text खूप कमी आलंय. Clear image/PDF try kar.");
        return;
      }

      setExtractedText(text);
    } catch (err) {
      console.error(err);
      alert("Extraction failed. Console check kar.");
    } finally {
      setLoading(false);
    }
  };

  const goToStudy = () => {
    if (!extractedText || extractedText.trim().length < 30) {
      alert("First convert to text.");
      return;
    }

    const notes = generateSummaryLines(extractedText, 20, 25);
    const mcqs = generateMcqs(extractedText, 20);

    sessionStorage.setItem("mcqs", JSON.stringify(mcqs));
    navigate("/study", { state: { notes } });
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={heading}>Upload Notes</h2>
        <p style={subheading}>Images + PDF </p>

        {/* ✅ Hidden input: click via button */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handlePick}
          style={{ display: "none" }}
        />

        {/* ✅ One button: every time it ADDS files */}
        <button
          type="button"
          style={btnOutline}
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          {files.length ? "Add Another Image/PDF" : "Choose Image/PDF"}
        </button>

        <p style={metaText}>
          Selected: <b>{files.length}</b> file(s)
        </p>

        {files.length > 0 && (
          <div style={fileList}>
            {files.map((f, i) => (
              <div key={`${f.name}-${f.size}-${f.lastModified}`} style={fileRow}>
                <div style={{ flex: 1, fontSize: 13 }}>
                  {i + 1}. {f.name}
                </div>
                <button
                  type="button"
                  style={smallBtn}
                  onClick={() => removeFile(i)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            style={{ ...btnBlack, flex: 1, opacity: loading ? 0.7 : 1 }}
            onClick={handleExtract}
            disabled={loading || !files.length}
          >
            {loading ? "Processing..." : "Convert to Text"}
          </button>

          <button
            type="button"
            style={{ ...btnOutline, flex: 1 }}
            onClick={clearAll}
            disabled={loading || (!files.length && !extractedText)}
          >
            Clear
          </button>
        </div>

        {progressInfo && (
          <div style={progressBox}>
            <div>{progressInfo.status}</div>
            {typeof progressInfo.progress === "number" && (
              <div>{Math.round(progressInfo.progress * 100)}%</div>
            )}
          </div>
        )}

        {extractedText && (
          <>
            <div style={previewBox}>{extractedText}</div>
            <button type="button" style={btnBlack} onClick={goToStudy}>
              Go to Study Mode
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ✅ Styles */
const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#F8EFE6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
};

const cardStyle = {
  width: "100%",
  maxWidth: 420,
  backgroundColor: "white",
  padding: 22,
  borderRadius: 18,
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const heading = { margin: 0, textAlign: "center", fontSize: 22, fontWeight: 800 };
const subheading = { margin: 0, textAlign: "center", fontSize: 14, color: "#555" };
const metaText = { textAlign: "center", fontSize: 14, color: "#555" };

const btnOutline = {
  backgroundColor: "white",
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: 14,
  fontWeight: "700",
  cursor: "pointer",
};

const fileList = {
  maxHeight: 140,
  overflowY: "auto",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 10,
  backgroundColor: "#fafafa",
};

const fileRow = { display: "flex", alignItems: "center", gap: 10, padding: "6px 0" };

const smallBtn = {
  border: "1px solid #ddd",
  backgroundColor: "white",
  borderRadius: 10,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
};

const progressBox = {
  padding: 10,
  borderRadius: 12,
  backgroundColor: "#f5f5f5",
  textAlign: "center",
  fontSize: 14,
};

const previewBox = {
  padding: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  maxHeight: 200,
  overflowY: "auto",
  fontSize: 13,
  lineHeight: 1.4,
  backgroundColor: "#fafafa",
};

const btnBlack = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: 14,
  fontWeight: "700",
  cursor: "pointer",
};

export default UploadNotesScreen;
