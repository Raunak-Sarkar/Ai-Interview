import React, { useState, useEffect } from 'react';
import { Progress, Typography } from 'antd';

const { Text } = Typography;

// A simple countdown timer component for each question. [cite: 25]
const CountdownTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // [cite: 26]
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const percent = (timeLeft / duration) * 100;

  return (
    <div style={{ marginTop: '16px' }}>
      <Text>Time Remaining: {timeLeft}s</Text>
      <Progress percent={percent} showInfo={false} status={timeLeft < 10 ? 'exception' : 'active'} />
    </div>
  );
};

export default CountdownTimer;