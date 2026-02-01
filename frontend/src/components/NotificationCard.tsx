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
    background: hsl(var(--card));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: 0.3s ease-in-out;
    border: 1px solid hsl(var(--border));
  }

  .card:hover {
    cursor: pointer;
    transform: scale(1.02);
    border-color: hsl(24, 100%, 50% / 0.3);
    box-shadow: 0 4px 20px hsl(24, 100%, 50% / 0.1);
  }

  .img {
    width: 44px;
    height: 44px;
    margin-left: 12px;
    border-radius: 10px;
    background: linear-gradient(135deg, hsl(24, 100%, 55%), hsl(20, 100%, 45%));
    flex-shrink: 0;
  }

  .card:hover > .img {
    transition: 0.3s ease-in-out;
    background: linear-gradient(135deg, hsl(24, 100%, 60%), hsl(15, 100%, 50%));
  }

  .textBox {
    width: calc(100% - 80px);
    margin-left: 12px;
    color: hsl(var(--foreground));
    font-family: 'Inter', sans-serif;
  }

  .textContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .span {
    font-size: 10px;
    color: hsl(var(--muted-foreground));
  }

  .h1 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: hsl(var(--foreground));
  }

  .p {
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
    color: hsl(var(--muted-foreground));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default NotificationCard;
