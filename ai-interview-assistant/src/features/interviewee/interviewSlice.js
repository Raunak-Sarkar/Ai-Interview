import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// This slice manages the state for all interviews and candidates.
const initialState = {
  candidates: [], // Stores all candidate data [cite: 9]
  currentInterview: {
    candidateId: null,
    status: 'idle', // 'idle', 'collecting-info', 'in-progress', 'completed'
    missingInfo: [], // e.g., ['email', 'phone']
    currentQuestionIndex: 0,
    answers: [], // { question: '...', answer: '...', score: X }
    timer: null,
  },
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    // Starts the process by creating a new candidate from resume data.
    startWithResume: (state, action) => {
      const { name, email, phone } = action.payload;
      const newCandidateId = uuidv4();
      
      const newCandidate = {
        id: newCandidateId,
        name: name || 'N/A',
        email: email || '',
        phone: phone || '',
        score: null,
        summary: '',
        chatHistory: [],
      };
      
      state.candidates.push(newCandidate);
      state.currentInterview.candidateId = newCandidateId;
      
      const missing = [];
      if (!name) missing.push('name');
      if (!email) missing.push('email');
      if (!phone) missing.push('phone');

      if (missing.length > 0) {
        state.currentInterview.status = 'collecting-info';
        state.currentInterview.missingInfo = missing;
      } else {
        state.currentInterview.status = 'in-progress';
      }
    },
    // Updates candidate info collected from the chatbot.
    updateCandidateInfo: (state, action) => {
      const { field, value } = action.payload;
      const candidate = state.candidates.find(c => c.id === state.currentInterview.candidateId);
      if (candidate) {
        candidate[field] = value;
      }
      state.currentInterview.missingInfo.shift(); // Assumes fields are collected one by one
      if (state.currentInterview.missingInfo.length === 0) {
        state.currentInterview.status = 'in-progress';
      }
    },
    // Adds a message (question or answer) to the current candidate's chat history.
    addChatMessage: (state, action) => {
      const { sender, text } = action.payload;
      const candidate = state.candidates.find(c => c.id === state.currentInterview.candidateId);
      if (candidate) {
        candidate.chatHistory.push({ sender, text });
      }
    },
    // Stores an answer and moves to the next question.
    submitAnswer: (state, action) => {
      const { question, answer, score } = action.payload;
      state.currentInterview.answers.push({ question, answer, score });
      state.currentInterview.currentQuestionIndex += 1;
    },
    // Finalizes the interview, calculates score and summary.
    completeInterview: (state, action) => {
      const { summary } = action.payload;
      const candidate = state.candidates.find(c => c.id === state.currentInterview.candidateId);
      if (candidate) {
        const totalScore = state.currentInterview.answers.reduce((acc, curr) => acc + curr.score, 0);
        candidate.score = parseFloat((totalScore / (state.currentInterview.answers.length * 10)).toFixed(1)) * 10;
        candidate.summary = summary;
        // Add full Q&A to chat history for viewing in the dashboard
        candidate.chatHistory.push(...state.currentInterview.answers.map(a => ({ sender: 'system', text: `Q: ${a.question}\nA: ${a.answer}\nScore: ${a.score}/10` })));
      }
      // Reset current interview state
      state.currentInterview = initialState.currentInterview;
    },
    // Resets the current interview session.
    resetCurrentInterview: (state) => {
      state.currentInterview = initialState.currentInterview;
    },
  },
});

export const {
  startWithResume,
  updateCandidateInfo,
  addChatMessage,
  submitAnswer,
  completeInterview,
  resetCurrentInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;