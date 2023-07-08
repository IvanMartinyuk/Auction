import React, { useEffect, useState } from 'react';
import './Notification.css';

interface NotificationProps {
  backgroundColor?: string;
  fontColor?: string;
  fadeTime?: number;
  text: string;
}

const Notification: React.FC<NotificationProps> = ({
  backgroundColor = '#ffffff',
  fontColor = '#000000',
  fadeTime = 5000,
  text,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {    
    const timer = setTimeout(() => {
        setVisible(false);
      }, fadeTime);
  
      return () => {
        clearTimeout(timer);
      };
  }, [fadeTime]);

  //some custom styles
  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: fontColor,
    opacity: visible ? 1 : 0,
    transition: `opacity ${fadeTime}ms`
  };

  const lineStyle: React.CSSProperties = {
    width: visible ? '100%' : '1px',
    transition: `width ${fadeTime}ms`,
  };

  return (
    <div className='notification' style={containerStyle}>
      <div className='notificationLine' style={lineStyle}></div>
      <p>{text}</p>
    </div>
  );
};

export default Notification;