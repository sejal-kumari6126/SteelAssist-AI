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
            content
        };
    });

    return documents;
};

// Normalize text
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

// Find the most relevant document
const findRelevantDocument = (question, documents) => {
    const normalizedQuestion = normalizeText(question);

    const keywords = normalizedQuestion
        .split(/\s+/)
        .filter(word => word.length > 2);

    let bestDoc = null;
    let highestScore = 0;

    for (const doc of documents) {
        const text = normalizeText(doc.content);
        const fileName = normalizeText(doc.name);

        let score = 0;

        // 1. Very strong match for LOTO
        if (
            normalizedQuestion.includes("lockout tagout") ||
            normalizedQuestion.includes("lockout/tagout") ||
            normalizedQuestion.includes("loto")
        ) {
            if (
                fileName.includes("loto") ||
                text.includes("lockout tagout") ||
                text.includes("lockout tagout")
            ) {
                score += 100;
            }
        }

        // 2. Exact phrase match
        if (normalizedQuestion.includes("lockout tagout")) {
            if (text.includes("lockout tagout")) {
                score += 50;
            }

            if (fileName.includes("loto")) {
                score += 50;
            }
        }

        // 3. Normal keyword matching
        for (const word of keywords) {
            if (text.includes(word)) {
                score += 1;
            }

            if (fileName.includes(word)) {
                score += 3;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestDoc = doc;
        }
    }
    return highestScore > 0 ? bestDoc : null;
};

module.exports = {
    loadDocuments,
    findRelevantDocument
};