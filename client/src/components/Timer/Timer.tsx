import React, { useEffect, useState } from 'react';

interface TimerProps {
  endDate: Date;
}

const Timer: React.FC<TimerProps> = ({ endDate }) => {
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const calculateRemainingTime = (endTime: Date) => {
      const currentTime = new Date();
      const timeDifference = endTime.getTime() - currentTime.getTime();

      // if timer is over return 'Timer finished'
      if (timeDifference <= 0) {
        return 'Timer finished';
      }

      // Calculting hours, minutes and seconds
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      // Generating needed format
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      return formattedTime;
    };

    const updateTimer = () => {
      const calculatedTime = calculateRemainingTime(endDate);
      setRemainingTime(calculatedTime);
    };

    //Timer reset(every second)
    const timer = setInterval(updateTimer, 1000);

    //When the endDate is changed or the component is completed, timer is clearing
    return () => {
      clearInterval(timer);
    };
  }, [endDate]);

  return (
    <div>
      <div>Remaining time: {remainingTime}</div>
    </div>
  );
};

export default Timer;
