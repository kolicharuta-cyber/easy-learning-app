import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";

// ---------------- PDF WORKER ----------------
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ---------------- CLEAN TEXT (SPACING FIX) ----------------
function cleanText(raw) {
  if (!raw) return "";

  let t = String(raw);

  // Remove line breaks
  t = t.replace(/[\r\n\t]+/g, " ");

  // Fix hyphen line breaks
  t = t.replace(/-\s+/g, "");

  // Add space after punctuation
  t = t.replace(/([.?!:;])([A-Za-z])/g, "$1 $2");

  // Fix camelCase joins
  t = t.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Fix glued stopwords like "ofdatabase", "isthe"
  const STOP = [
    "is","are","was","were","to","of","in","on","for",
    "with","from","and","or","as","at","by","the","a","an"
  ];
  const stopRe = STOP.join("|");

  for (let i = 0; i < 3; i++) {
    t = t.replace(new RegExp(`\\b(${stopRe})([a-z]{3,})\\b`, "gi"), "$1 $2");
    t = t.replace(/\s{2,}/g, " ").trim();
  }

  return t.trim();
}

// ---------------- IMAGE OCR ----------------
async function ocrImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const result = await Tesseract.recognize(url, "eng");
    return cleanText(result?.data?.text || "");
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---------------- PDF OCR ----------------
async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let combined = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str).join(" ");
    combined += strings + " ";
  }

  return cleanText(combined);
}

// ---------------- PUBLIC: MULTIPLE FILES ----------------
export async function extractTextFromFiles(files, onProgress) {
  if (!files || files.length === 0) return "";

  let combined = "";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.type.includes("pdf")) {
      combined += await extractTextFromPdf(file);
    } else if (file.type.startsWith("image/")) {
      combined += await ocrImageFile(file);
    }

    if (onProgress) {
      onProgress({
        status: `Processed ${i + 1}/${files.length}`,
        progress: (i + 1) / files.length,
      });
    }
  }

  return cleanText(combined);
}

// ---------------- SUMMARY NOTES (20–25 POINTS) ----------------
export function generateSummaryLines(text, minPoints = 20) {
  const cleaned = cleanText(text);

  const sentences = cleaned
    .split(/[.?!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);

  return sentences.slice(0, minPoints);
}

// ---------------- MCQ GENERATOR ----------------
export function generateMcqs(text, count = 20) {
  const cleaned = cleanText(text);

  const sentences = cleaned
    .split(/[.?!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 50);

  const mcqs = [];

  for (let i = 0; i < sentences.length && mcqs.length < count; i++) {
    const s = sentences[i];

    const words = s
      .replace(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .filter((w) => w.length > 5);

    if (words.length < 4) continue;

    const answer = words[Math.floor(words.length / 2)];
    const question = s.replace(answer, "_____");

    const distractors = words.filter((w) => w !== answer).slice(0, 3);
    const options = [...distractors, answer].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(answer);

    mcqs.push({
      question,
      options,
      correctIndex,
      explanation: s,
    });
  }

  return mcqs;
}

// ---------------- TEST EVALUATION ----------------
export function evaluateTest(answers, mcqs) {
  let correct = 0;
  const wrongIndices = [];

  answers.forEach((ans, i) => {
    if (ans === mcqs[i]?.correctIndex) {
      correct++;
    } else {
      wrongIndices.push(i);
    }
  });

  return {
    score: correct,
    total: mcqs.length,
    fullMarks: correct === mcqs.length,
    wrongIndices,
  };
}
