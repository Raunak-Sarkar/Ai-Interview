import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Typography } from 'antd';
import { resetCurrentInterview } from '../features/interviewee/interviewSlice';

const { Text } = Typography;

// This modal appears if the user reloads the page during an interview. 
const WelcomeBackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentInterview } = useSelector((state) => state.interview);
  const dispatch = useDispatch();

  useEffect(() => {
    // Show modal if an interview is in progress but was interrupted.
    if (currentInterview.status !== 'idle' && currentInterview.candidateId) {
      setIsOpen(true);
    }
  }, [currentInterview.status, currentInterview.candidateId]);

  const handleContinue = () => {
    setIsOpen(false);
    // The interview state is already loaded, so we just close the modal.
  };

  const handleStartNew = () => {
    dispatch(resetCurrentInterview());
    setIsOpen(false);
  };

  return (
    <Modal
      title="Welcome Back!"
      open={isOpen}
      footer={[
        <Button key="new" type="default" onClick={handleStartNew}>
          Start New Interview
        </Button>,
        <Button key="continue" type="primary" onClick={handleContinue}>
          Continue Interview
        </Button>,
      ]}
      closable={false}
    >
      <Text>It looks like you were in the middle of an interview. Would you like to continue where you left off?</Text>
    </Modal>
  );
};

export default WelcomeBackModal;