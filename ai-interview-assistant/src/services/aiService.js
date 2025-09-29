// MOCK: This service simulates interactions with an AI API like OpenAI.
// In a real application, you would replace these functions with actual fetch/axios calls.

const questions = [
  { difficulty: 'Easy', text: 'What is the difference between `let` and `const` in JavaScript?', time: 20 }, // [cite: 25]
  { difficulty: 'Easy', text: 'Explain the box model in CSS.', time: 20 },
  { difficulty: 'Medium', text: 'What are React Hooks? Can you name a few?', time: 60 }, // [cite: 25]
  { difficulty: 'Medium', text: 'Describe the event loop in Node.js.', time: 60 },
  { difficulty: 'Hard', text: 'Explain the concept of middleware in Express.js.', time: 120 }, // [cite: 25]
  { difficulty: 'Hard', text: 'How would you optimize the performance of a React application?', time: 120 },
];

// Generates a question based on the current index. [cite: 19]
export const getAIQuestion = async (questionIndex) => {
  console.log(`Fetching question ${questionIndex + 1}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
  if (questionIndex < questions.length) {
    return questions[questionIndex];
  }
  return null;
};

// Judges an answer and provides a score.
export const judgeAIAnswer = async (question, answer) => {
  console.log(`Judging answer for: "${question}"`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock scoring logic: score based on answer length
  const score = Math.min(10, Math.floor(answer.length / 5));
  return { score };
};

// Creates a final summary for the candidate. [cite: 28]
export const getAISummary = async (answers) => {
  console.log('Generating AI summary...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore = totalScore / answers.length;

  if (avgScore > 7) {
    return { summary: 'Strong candidate with excellent knowledge in both React and Node.js. Performed well on difficult questions.' };
  } else if (avgScore > 4) {
    return { summary: 'Good foundational knowledge but struggled with more advanced concepts. Shows potential.' };
  } else {
    return { summary: 'Candidate has a basic understanding but requires significant improvement in key areas.' };
  }
};