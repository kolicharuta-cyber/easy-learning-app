// Function to generate study notes from raw text
export function generateNotes(text) {
  if (!text) return [];

  const sentences = text
    .split(".")
    .map(s => s.trim())
    .filter(s => s.length > 5);

  let notes = [];

  sentences.forEach((s, index) => {
    notes.push(`${index + 1}. ${s}`);
    notes.push(`• ${s} is an important concept.`);
    notes.push(`• This topic is useful for exams.`);
    notes.push(`• Practical use of ${s.split(" ")[0]} is common.`);
  });

  return notes;
}

// Dummy OCR extractor: replace with your real OCR
export const extractTextFromFile = async (file) => {
  return `Extracted text from: ${file.name}`;
};
