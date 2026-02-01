import React from 'react';
import styled from 'styled-components';

const Loader: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;

  .loader {
    position: relative;
    width: 120px;
    height: 90px;
    margin: 0 auto;
  }

  .loader:before {
    content: "";
    position: absolute;
    bottom: 30px;
    left: 50px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: hsl(24, 100%, 50%);
    animation: loading-bounce 0.5s ease-in-out infinite alternate;
  }

  .loader:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    height: 7px;
    width: 45px;
    border-radius: 4px;
    box-shadow: 0 5px 0 hsl(0, 0%, 95%), -35px 50px 0 hsl(0, 0%, 95%), -70px 95px 0 hsl(0, 0%, 95%);
    animation: loading-step 1s ease-in-out infinite;
  }

  @keyframes loading-bounce {
    0% {
      transform: scale(1, 0.7);
    }
    40% {
      transform: scale(0.8, 1.2);
    }
    60% {
      transform: scale(1, 1);
    }
    100% {
      bottom: 140px;
    }
  }

  @keyframes loading-step {
    0% {
      box-shadow: 0 10px 0 rgba(0, 0, 0, 0),
        0 10px 0 hsl(0, 0%, 95%),
        -35px 50px 0 hsl(0, 0%, 95%),
        -70px 90px 0 hsl(0, 0%, 95%);
    }
    100% {
      box-shadow: 0 10px 0 hsl(0, 0%, 95%),
        -35px 50px 0 hsl(0, 0%, 95%),
        -70px 90px 0 hsl(0, 0%, 95%),
        -70px 90px 0 rgba(0, 0, 0, 0);
    }
  }
`;

export default Loader;
