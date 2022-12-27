import styled from "styled-components";

export const ProfileIconsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .right {
    margin: auto 2px;
  }

  .icon {
    height: 3rem;
    width: 3rem;
    cursor: pointer;
    color: var(--primary-color);
    font-weight: 900;
    flex-shrink: 0;
    border-radius: 50%;
  }
`;

export const ShareIconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .share-text {
    margin: auto !important;
    padding: 0.5rem 2rem;
    font-size: 1.7rem;
    font-weight: bold;
  }

  .earn-text {
    margin: auto !important;
    padding: 0.2rem 0.5rem;
    font-size: 1.5rem;
    text-align: center;
  }
`;
