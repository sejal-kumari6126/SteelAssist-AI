const { GoogleGenAI } = require("@google/genai");
const { searchKnowledge } = require("./ragService");
const { getEmployeeContext } = require("./profileService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateRAGAnswer(question, userId) {
  // 1. Retrieve relevant training knowledge
  const results = await searchKnowledge(question, 5);

  // 2. Retrieve employee context
  const employeeContext = await getEmployeeContext(userId);

  // 3. Build training knowledge context
  const knowledgeContext = results
    .map(
      (result) =>
        `Source: ${result.document_name}\n${result.content}`
    )
    .join("\n\n---\n\n");

  // 4. Build employee profile context
  let profileContext = "No employee profile is available.";

  if (employeeContext.profile) {
    profileContext = `
Role: ${employeeContext.profile.role || "Not specified"}
Department: ${employeeContext.profile.department || "Not specified"}
Experience: ${employeeContext.profile.experience_years ?? 0} years

Completed Training:
${
  employeeContext.completedTraining.length > 0
    ? employeeContext.completedTraining.join(", ")
    : "None"
}

Pending Training:
${
  employeeContext.pendingTraining.length > 0
    ? employeeContext.pendingTraining.join(", ")
    : "None"
}
`;
  }

  // 5. Prompt Gemini with both knowledge + employee context
  const prompt = `
You are SteelAssist AI, an industrial Learning & Development assistant.

Your job is to provide accurate, practical and personalized
training assistance to employees.

Use the retrieved training knowledge as your primary source.

IMPORTANT RULES:
- Do not invent safety procedures.
- Do not provide information that contradicts the retrieved
  training knowledge.
- If the answer is not available in the retrieved knowledge,
  clearly state that it is not available in the current
  training knowledge base.
- Consider the employee's role, department and training history
  when personalization is useful.
- Do not reveal passwords, authentication information, or
  private database information.
- Use simple and practical language.
- For procedures, use numbered steps.
- Mention relevant training sources when appropriate.

EMPLOYEE CONTEXT:
${profileContext}

RETRIEVED TRAINING KNOWLEDGE:

${knowledgeContext}

USER QUESTION:

${question}

Provide the best answer for this employee.
`;

  // 6. Generate personalized answer
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return {
    answer: response.text,
    sources: results.map((result) => ({
      document: result.document_name,
      similarity: Number(result.similarity).toFixed(4),
    })),
  };
}

module.exports = {
  generateRAGAnswer,
};