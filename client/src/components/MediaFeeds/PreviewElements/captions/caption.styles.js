import styled from "styled-components";

export const CaptionHeaderContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .flex {
    display: flex;
    align-items: center;
  }

  .margined {
    margin-right: 1rem;
  }

  .icon-btn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
  }

  .media-option-icon {
    height: 2rem;
    width: 2rem;
    cursor: pointer;
    flex-shrink: 0;
  }

  .options {
    position: relative;
  }

  .option-container {
    position: absolute;
    right: 0.6rem;
    top: 3.8rem;
    background-color: #ffffff;
    width: max-content;
    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
    box-shadow: 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    display: grid;
    grid-gap: 0.5rem;
  }

  .option-text {
    color: #525252;
    font-size: 1.4rem;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin: 0 !important;
    text-align: center;

    &:hover {
      background-color: whitesmoke;
    }
  }
`;

export const CaptionBodyContainer = styled.div`
  padding: 2rem;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;

  .comment-container {
    display: grid;
    grid-gap: 1rem;
    height: max-content;
  }

  .margined {
    margin-right: 1rem;
  }

  .comment {
    font-weight: 400;
    font-size: 1.4rem;
    margin: 0 !important;
  }

  .flex {
    display: flex;

    &:hover {
      .options {
        display: flex;
        position: relative;
      }
    }
  }

  .options {
    display: none;
  }

  .option-container {
    position: absolute;
    right: 0.6rem;
    top: 3.8rem;
    background-color: #ffffff;
    width: max-content;
    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
    box-shadow: 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    display: grid;
    grid-gap: 0.5rem;
  }

  .option-text {
    color: #525252;
    font-size: 1.4rem;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin: 0 !important;
    text-align: center;

    &:hover {
      background-color: whitesmoke;
    }
  }
`;

export const CaptionFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;

  .icons-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: -1rem;
    margin-bottom: 1rem;
    margin-left: -2rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    margin: 0 1rem;
  }

  .sidebar-icons {
    font-size: 2.5rem;
    border: none;
    border-radius: 50%;
  }

  .inspired {
    color: var(--primary-yellow);
  }

  .sidebar-count {
    font-weight: 600;
    border: none;
  }

  .comment-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icon {
    height: 2.6rem;
    width: 2.6rem;
    color: #78716c;
    cursor: pointer;
    flex-shrink: 0;
  }

  .icon-btn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
    margin-left: 1rem;
  }
`;

export const CaptionTextArea = styled.textarea`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  color: #4a4a4a;
`;
