import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  extractTextFromFiles,
  generateSummaryLines,
  generateMcqs,
} from "./ocrHelpers";

function UploadNotesScreen() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleExtract = async () => {
    if (!files.length) {
      alert("किमान 1 image किंवा PDF select कर.");
      return;
    }

    setLoading(true);
    setExtractedText("");
    setProgressInfo({ status: "Starting...", progress: 0 });

    try {
      const text = await extractTextFromFiles(files, (p) => setProgressInfo(p));

      if (!text || text.trim().length < 30) {
        alert("Text खूप कमी आला. Clear image / readable PDF try कर.");
        return;
      }

      setExtractedText(text);
    } catch (err) {
      console.error(err);
      alert("Extraction failed. Console check कर.");
    } finally {
      setLoading(false);
    }
  };

  const goToStudy = () => {
    if (!extractedText || extractedText.trim().length < 30) {
      alert("पहिले Convert to Text कर.");
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
        <h2 style={{ marginTop: 0 }}>Upload Notes (Images + PDF)</h2>

        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          style={{ width: "100%" }}
        />

        <p style={{ marginTop: 10, color: "#555" }}>
          Selected: <b>{files.length}</b> file(s)
        </p>

        <button style={btnPrimary} onClick={handleExtract} disabled={loading}>
          {loading ? "Processing..." : "Convert to Text"}
        </button>

        {progressInfo && (
          <div style={progressBox}>
            <div>
              <b>{progressInfo.status}</b>
            </div>
            {typeof progressInfo.progress === "number" && (
              <div>Progress: {Math.round(progressInfo.progress * 100)}%</div>
            )}
          </div>
        )}

        {extractedText && (
          <>
            <h3 style={{ marginTop: 14 }}>Extracted Text</h3>
            <div style={previewBox}>{extractedText}</div>

            <button style={btnSecondary} onClick={goToStudy}>
              Go to Study Mode
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ✅ Background image + center */
const pageStyle = {
  padding: "16px",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",

  backgroundImage: "url('/bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

/* ✅ White clean card */
const cardStyle = {
  width: "100%",
  maxWidth: "560px",
  backgroundColor: "white",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  marginTop: "30px",
};

const previewBox = {
  marginTop: 10,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 10,
  backgroundColor: "#fff",
  maxHeight: "220px",
  overflowY: "auto",
  whiteSpace: "pre-wrap",
  fontSize: "14px",
  lineHeight: 1.4,
};

const progressBox = {
  marginTop: 12,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  fontSize: "14px",
};

/* ✅ Black premium buttons (to match theme) */
const btnPrimary = {
  marginTop: 12,
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "600",
};

const btnSecondary = {
  marginTop: 12,
  width: "100%",
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "600",
};

export default UploadNotesScreen;
