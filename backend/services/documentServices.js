const fs = require("fs");
const path = require("path");

const docsFolder = path.join(__dirname, "../docs");

// Load all documents
const loadDocuments = () => {
  const files = fs.readdirSync(docsFolder);

  const documents = files.map((file) => {
    const content = fs.readFileSync(
      path.join(docsFolder, file),
      "utf-8"
    );

    return {
      name: file,
      content,
    };
  });

  return documents;
};

// Find the most relevant document
const findRelevantDocument = (question, documents) => {
  const keywords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2);

  console.log("Keywords:", keywords);

  let bestDoc = null;
  let highestScore = 0;

  for (const doc of documents) {
    const text = doc.content.toLowerCase();
    const fileName = doc.name.toLowerCase();

    let score = 0;

    // Check keywords in document content
    for (const word of keywords) {
      if (text.includes(word)) {
        score++;
      }
    }

    // Bonus if keyword matches filename
    for (const word of keywords) {
      if (fileName.includes(word)) {
        score += 2;
      }
    }

    console.log(`${doc.name} -> Score: ${score}`);

    if (score > highestScore) {
      highestScore = score;
      bestDoc = doc;
    }
  }

  console.log("Best Score:", highestScore);
  console.log("Best Document:", bestDoc?.name || "None");

  return highestScore > 0 ? bestDoc : null;
};

module.exports = {
  loadDocuments,
  findRelevantDocument,
};