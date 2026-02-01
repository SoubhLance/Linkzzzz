import React from 'react';
import styled from 'styled-components';

interface ContentCardProps {
  title: string;
  description: string;
  category?: string;
  type?: 'link' | 'note' | 'image';
  imageUrl?: string;
  starred?: boolean;
  onStarToggle?: () => void;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  category,
  type = 'link',
  imageUrl,
  starred = false,
  onStarToggle,
  onClick,
}) => {
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStarToggle?.();
  };

  return (
    <StyledWrapper onClick={onClick}>
      <div className="notification">
        <div className="notiglow" />
        <div className="notiborderglow" />
        {imageUrl && type === 'image' && (
          <div className="notiimage">
            <img src={imageUrl} alt={title} />
          </div>
        )}
        <div className="noticontent">
          {category && <div className="noticategory">{category}</div>}
          <div className="notititle">{title}</div>
          <div className="notibody">{description}</div>
        </div>
        <button className="notistar" onClick={handleStarClick} aria-label={starred ? "Unstar" : "Star"}>
          {starred ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
        </button>
        <div className="notitype">
          {type === 'link' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
          {type === 'note' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          )}
          {type === 'image' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .notification {
    display: flex;
    flex-direction: column;
    isolation: isolate;
    position: relative;
    width: 100%;
    min-height: 8rem;
    background: hsl(var(--card));
    border-radius: 1rem;
    overflow: hidden;
    font-size: 16px;
    --gradient: linear-gradient(to bottom, hsl(24, 100%, 55%), hsl(20, 100%, 45%));
    --color: hsl(24, 100%, 50%);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .notification:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px hsl(24, 100%, 50% / 0.15);
  }

  .notification:before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 0.9375rem;
    background: hsl(var(--card));
    z-index: 2;
  }

  .notification:after {
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    position: absolute;
    background: var(--gradient);
    border-radius: 2px;
    z-index: 4;
  }

  .notiglow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, hsl(24, 100%, 50% / 0.1), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .notification:hover .notiglow {
    opacity: 1;
  }

  .notiborderglow {
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    background: linear-gradient(90deg, transparent, hsl(24, 100%, 50% / 0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .notification:hover .notiborderglow {
    opacity: 1;
  }

  .noticontent {
    position: relative;
    z-index: 5;
    padding: 0.65rem 1.25rem;
    padding-left: 1.5rem;
  }

  .noticategory {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color);
    margin-bottom: 0.25rem;
    font-weight: 600;
  }

  .notititle {
    color: var(--color);
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .notibody {
    color: hsl(var(--muted-foreground));
    font-size: 0.8rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notiimage {
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100px;
    overflow: hidden;
  }

  .notiimage img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .notitype {
    position: absolute;
    top: 0.65rem;
    right: 0.65rem;
    z-index: 5;
    color: hsl(var(--muted-foreground));
  }

  .notistar {
    position: absolute;
    top: 0.65rem;
    right: 2.2rem;
    z-index: 5;
    color: hsl(var(--muted-foreground));
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s ease, transform 0.15s ease;
  }

  .notistar:hover {
    color: hsl(24, 100%, 50%);
    transform: scale(1.1);
  }

  .notistar svg[fill="currentColor"] {
    color: hsl(24, 100%, 50%);
  }
`;

export default ContentCard;
