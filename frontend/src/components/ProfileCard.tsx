import React from 'react';
import styled from 'styled-components';

interface ProfileCardProps {
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'github' | 'email';
  createdAt: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  username,
  email,
  avatarUrl,
  provider,
  createdAt,
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        );
      case 'github':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        );
    }
  };

  return (
    <StyledWrapper>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="heading_8264">LINKZZZZ</p>
            <div className="avatar-container">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="name">{name}</p>
            <p className="username">@{username}</p>
          </div>
          <div className="flip-card-back">
            <div className="back-content">
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Auth Provider</span>
                <span className="info-value provider">
                  {getProviderIcon()}
                  <span>{provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">{createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: 280px;
    height: 180px;
    perspective: 1000px;
    color: hsl(var(--foreground));
  }

  .heading_8264 {
    position: absolute;
    letter-spacing: 0.3em;
    font-size: 0.55em;
    font-weight: 700;
    top: 1em;
    left: 1.2em;
    color: hsl(24, 100%, 50%);
  }

  .avatar-container {
    position: absolute;
    top: 2.5em;
    left: 50%;
    transform: translateX(-50%);
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid hsl(24, 100%, 50%);
  }

  .avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, hsl(24, 100%, 50%), hsl(20, 100%, 45%));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 600;
    color: white;
  }

  .name {
    position: absolute;
    font-weight: 600;
    font-size: 0.9em;
    top: 7.5em;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .username {
    position: absolute;
    font-size: 0.7em;
    top: 11.5em;
    left: 50%;
    transform: translateX(-50%);
    color: hsl(var(--muted-foreground));
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  @media (hover: none) {
    .flip-card:active .flip-card-inner {
      transform: rotateY(180deg);
    }
  }

  .flip-card-front,
  .flip-card-back {
    box-shadow: 0 8px 24px hsl(0, 0%, 0% / 0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1rem;
  }

  .flip-card-front {
    background: linear-gradient(145deg, hsl(var(--card)), hsl(var(--secondary)));
    border: 1px solid hsl(var(--border));
  }

  .flip-card-back {
    background: linear-gradient(145deg, hsl(var(--card)), hsl(var(--secondary)));
    border: 1px solid hsl(var(--border));
    transform: rotateY(180deg);
  }

  .back-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 1.5em;
    height: 100%;
    gap: 0.8em;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2em;
    width: 100%;
  }

  .info-label {
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: hsl(24, 100%, 50%);
    font-weight: 600;
  }

  .info-value {
    font-size: 0.75em;
    color: hsl(var(--foreground));
    word-break: break-all;
  }

  .info-value.provider {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
`;

export default ProfileCard;
