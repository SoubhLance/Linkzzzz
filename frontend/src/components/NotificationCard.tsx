import React from 'react';
import styled from 'styled-components';

interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
  imageUrl?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  time,
  imageUrl,
}) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="img" style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' } : undefined} />
        <div className="textBox">
          <div className="textContent">
            <p className="h1">{title}</p>
            <span className="span">{time}</span>
          </div>
          <p className="p">{message}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    max-width: 320px;
    height: 70px;
    background: #111114;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: all 0.25s ease;
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.02);
  }

  .card:hover {
    cursor: pointer;
    transform: scale(1.02) translateY(-1px);
    border-color: rgba(249, 115, 22, 0.15);
    box-shadow: 0 8px 24px rgba(249, 115, 22, 0.08),
                0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .img {
    width: 40px;
    height: 40px;
    margin-left: 14px;
    border-radius: 10px;
    background: linear-gradient(135deg, hsl(24, 100%, 50%), hsl(20, 100%, 42%));
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
  }

  .card:hover > .img {
    transition: 0.3s ease-in-out;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  }

  .textBox {
    width: calc(100% - 80px);
    margin-left: 12px;
    font-family: 'Inter', sans-serif;
  }

  .textContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .span {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.2);
  }

  .h1 {
    font-size: 13px;
    font-weight: 600;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: -0.01em;
  }

  .p {
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default NotificationCard;
