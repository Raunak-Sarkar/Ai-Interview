import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Button, message, Input, Space, Card, Typography, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { parseResume } from '../../services/resumeParser';
import { getAIQuestion, judgeAIAnswer, getAISummary } from '../../services/aiService';
import {
  startWithResume,
  updateCandidateInfo,
  addChatMessage,
  submitAnswer,
  completeInterview,
} from './interviewSlice';
import CountdownTimer from './CountdownTimer';

const { Text } = Typography;

const IntervieweeView = () => {
  const [uploading, setUploading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const dispatch = useDispatch();
  const { candidates, currentInterview } = useSelector((state) => state.interview);
  const currentCandidate = candidates.find(c => c.id === currentInterview.candidateId);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [currentCandidate?.chatHistory]);

  const handleResumeUpload = async (file) => {
    setUploading(true);
    try {
      // PDF/DOCX validation
      const isPdfOrDocx = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isPdfOrDocx) {
        message.error('You can only upload PDF or DOCX files!');
        setUploading(false);
        return false; // Prevent upload
      }

      const extractedData = await parseResume(file);
      dispatch(startWithResume(extractedData));
      dispatch(addChatMessage({ sender: 'system', text: 'Resume uploaded successfully. Welcome!' }));
      
    } catch (error) {
      message.error('Failed to parse resume.');
      console.error(error);
    } finally {
      setUploading(false);
    }
    return false; // Prevent antd default upload behavior
  };
  
  const processInterviewState = async () => {
    if (currentInterview.status === 'collecting-info' && currentInterview.missingInfo.length > 0) {
      const fieldToAsk = currentInterview.missingInfo[0];
      dispatch(addChatMessage({ sender: 'ai', text: `Your resume seems to be missing your ${fieldToAsk}. Could you please provide it?` }));
    } else if (currentInterview.status === 'in-progress' && !isAnswering) {
      setIsAnswering(true);
      const questionData = await getAIQuestion(currentInterview.currentQuestionIndex);
      if (questionData) {
        setCurrentQuestion(questionData);
        dispatch(addChatMessage({ sender: 'ai', text: questionData.text }));
      } else {
        // All questions answered, complete the interview
        dispatch(addChatMessage({ sender: 'system', text: 'Interview complete! Analyzing your answers...' }));
        const summaryResult = await getAISummary(currentInterview.answers);
        dispatch(completeInterview({ summary: summaryResult.summary }));
        dispatch(addChatMessage({ sender: 'system', text: 'Thank you for your time. You may now close this window.' }));
        setIsAnswering(false);
      }
    }
  };
  
  // ***** THIS IS THE CORRECTED PART *****
  useEffect(() => {
    if (currentInterview.candidateId) {
      processInterviewState();
    }
  }, [currentInterview.status, currentInterview.currentQuestionIndex, currentInterview.candidateId]);

  const handleUserSubmit = async () => {
    if (!inputValue.trim()) return;

    // Phase 1: Collecting missing info
    if (currentInterview.status === 'collecting-info') {
      const field = currentInterview.missingInfo[0];
      dispatch(addChatMessage({ sender: 'user', text: inputValue }));
      dispatch(updateCandidateInfo({ field, value: inputValue }));
    } 
    // Phase 2: Answering a question
    else if (currentInterview.status === 'in-progress' && currentQuestion) {
      await handleAnswerSubmission(inputValue);
    }
    setInputValue('');
  };

  const handleAnswerSubmission = async (answer) => {
    setIsAnswering(false);
    dispatch(addChatMessage({ sender: 'user', text: answer }));
    const { score } = await judgeAIAnswer(currentQuestion.text, answer);
    dispatch(submitAnswer({ question: currentQuestion.text, answer, score }));
    setCurrentQuestion(null);
  };

  // Render Logic
  if (!currentCandidate) {
    return (
      <Card title="Start Interview">
        <p>Please upload your resume to begin the interview.</p>
        <Upload beforeUpload={handleResumeUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} loading={uploading}>
            Upload Resume (PDF/DOCX)
          </Button>
        </Upload>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #d9d9d9', padding: '16px', marginBottom: '16px', borderRadius: '4px', background: '#f5f5f5' }}>
        {currentCandidate.chatHistory.map((msg, index) => (
          <div key={index} style={{ marginBottom: '12px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Text style={{
              background: msg.sender === 'user' ? '#1890ff' : '#fff',
              color: msg.sender === 'user' ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'inline-block',
              maxWidth: '70%',
            }}>
              {msg.text}
            </Text>
          </div>
        ))}
        {isAnswering && currentQuestion && <Spin tip="AI is typing..." />}
        <div ref={chatEndRef} />
      </div>

      {currentInterview.status !== 'completed' && (
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleUserSubmit}
            placeholder="Type your answer here..."
            disabled={!currentInterview.status === 'collecting-info' && !isAnswering}
          />
          <Button type="primary" onClick={handleUserSubmit} disabled={!currentInterview.status === 'collecting-info' && !isAnswering}>
            Send
          </Button>
        </Space.Compact>
      )}

      {currentQuestion && isAnswering && (
        <CountdownTimer
          key={currentQuestion.text} // Re-mount timer for each question
          duration={currentQuestion.time}
          onTimeUp={() => handleAnswerSubmission(inputValue || '(No answer provided)')}
        />
      )}
    </div>
  );
};

export default IntervieweeView;