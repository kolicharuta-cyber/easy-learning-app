// server.js (run with: node server.js)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In real app, store/DB would store questions and user progress
const notesData = new Map();

app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  // In prod, add password hashing; simplified here
  const user = { id: Date.now(), name, email };
  notesData.set(user.id, []);
  return res.json({ user, success: true });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Simplified: assume login always works; replace with real JWT/auth
  return res.json({
    user: { id: Date.now(), email },
    token: "fake-jwt-token",
  });
});

app.post("/api/generate/notes-and-mcqs", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  const sentences = text
    .split(/[.?!]/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const summaryLines = sentences.map(s => {
    if (s.length > 80) return s.substring(0, 80) + "...";
    return s;
  });

  const mcqs = sentences.slice(0, 5).map(s => {
    const words = s.split(" ").filter(w => w.length > 4);
    if (words.length < 4) return null;
    const answer = words[Math.floor(Math.random() * words.length)];
    const question = s.replace(answer, "_____");
    const distractors = [...words].filter(w => w !== answer).slice(0, 3);
    const options = [...distractors, answer].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(answer);

    return { question, options, correctIndex };
  }).filter(Boolean);

  return res.json({
    summaryLines,
    mcqs,
    sentiment: "ok",
  });
});

app.post("/api/test-evaluate", (req, res) => {
  const { answers, mcqs } = req.body;

  if (!Array.isArray(answers) || !Array.isArray(mcqs)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  let correct = 0;
  const wrongIndices = [];

  answers.forEach((selected, i) => {
    const q = mcqs[i];
    if (!q) return;
    if (selected === q.correctIndex) correct++;
    else wrongIndices.push(i);
  });

  return res.json({
    score: correct,
    total: mcqs.length,
    fullMarks: correct === mcqs.length,
    wrongIndices,
  });
});

app.listen(5000, () => {
  console.log("Node server running on port 5000");
});
