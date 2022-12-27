import styled from "styled-components";

export const LgContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 0 auto;
  width: 100%;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #162040;
`;

export const SaveBtn = styled.button`
  border: 2px solid var(--primary-color);
  outline: none;
  background-color: ${({ grayed }) =>
    grayed ? "var(--blue-shade)" : "var(--primary-color)"};
`;
export const DeleteBtn = styled.div`
  border: 2px solid var(--red-rose);
  background-color: ${({ grayed }) =>
    grayed ? "var(--rose-shade)" : "var(--red-rose)"};
`;

export const AutoCompleteContainer = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 20;
  display: grid;
  grid-gap: 0.75rem;
  background: #fff;
  border: 2px solid #e5e7eb;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 0.5rem 1rem;
  border-radius: 0.7rem;
  max-height: 15rem;
  overflow-y: scroll;

  .university {
    margin: 0;
    cursor: pointer;

    padding: 0.5rem 1rem;
    border-radius: 0.7rem;

    &:hover {
      background: whitesmoke;
    }
  }
`;

export const EditableContainer = styled.div`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2px 0;
    width: 100%;
  }

  .header-flex {
    display: flex;
  }
  .text-container {
    display: flex;
    margin: 0 1rem;
    align-items: center;
  }
  .social-flex {
    display: flex;
    align-items: center;
    width: 100%;

    .social-icon {
      height: 1rem;
      width: 1rem;
      margin-right: 0.5rem;
    }
  }

  .header-avatar {
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    object-fit: cover;
    background-color: grey;
  }
  .text-lg {
    font-size: 2.5rem;
    line-height: 2.5rem;
    font-weight: 600;
  }

  .text-base {
    font-size: 1.6rem;
    line-height: 1rem;
    font-weight: 400;
    margin-top: 1.5rem;
  }

  .to-profile {
    border-radius: 8px;
  }

  .auto-complete-container {
    position: relative;
    width: 100%;
  }

  .underline-text {
    margin: 2rem 0;
    font-size: 2rem;
    line-height: 1.6rem;
    font-weight: 400;
    width: 100%;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 2rem;
  }

  .edit-avatar-container {
    position: relative;
    cursor: pointer;
  }

  .avatar-container {
    margin: 0 auto;
  }

  .editable-avatar {
    height: 15rem;
    width: 15rem;
    border-radius: 50%;
    object-fit: cover;
    background-color: grey;
  }

  .editable-btn {
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 0.25rem 1rem;
    font-weight: 600;
    font-size: 1.2rem;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0 auto;

    p {
      margin: 0 0 0 0.25rem;
    }
  }

  .editable-form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .form {
    max-width: 767px;
    width: 100%;
    display: grid;
    grid-gap: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    flex: 0.7;
    align-items: flex-start;
    justify-content: start;
    margin: 0.3rem 0;
    padding: 1rem;
    border: 1px solid whitesmoke;
    border-width: 1px;
    border-radius: 0.7rem;
    background-color: whitesmoke;

    &:focus-within {
      border: 2px solid #e5e7eb;
    }
  }

  .form-input {
    border: none;
    outline: none;
    width: 100%;
    max-width: 639px;
    background-color: transparent;
  }

  .form-text {
    font-size: 1.8rem;
    line-height: 1rem;
    font-weight: 400;
    margin-bottom: 2rem;
  }

  .drop-zone-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    border: 1px dashed #78716c;
    flex-direction: column;
    border-radius: 1rem;
    position: relative;
    cursor: pointer;
  }
  .drop-zone-icon {
    height: 4rem;
    width: 4rem;
    flex-shrink: 0;
    color: #78716c;
  }

  .drop-input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 999px;
    opacity: 0;
    cursor: pointer;
  }
  .none {
    color: transparent;
  }

  .actions-btn-container {
    margin: 2rem 0;
    width: 100%;
    display: grid;
    grid-gap: 1rem;
  }

  .action-btn {
    padding: 1rem 2rem;
    margin: 0 !important;
    border-radius: 1.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    font-size: 1.6rem;
    margin: 0 !important;
    font-weight: 600;
    color: #ffffff;
  }

  @media screen and (min-width: 639px) {
    .editable-form {
      flex-direction: row-reverse;
      justify-content: start;
      align-items: flex-start;
    }
    .avatar-container {
      padding: 4rem;
    }
  }
  @media screen and (min-width: 767px) {
    .editable-avatar {
      height: 18rem;
      width: 18rem;
      background-color: grey;
    }
  }
`;
