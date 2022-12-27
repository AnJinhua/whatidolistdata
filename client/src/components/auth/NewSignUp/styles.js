import styled from "styled-components";
import { TiArrowBackOutline } from "react-icons/ti";
import { MdOutlineCancel } from "react-icons/md";
import { Modal } from "@material-ui/core";
import { Link } from "react-router-dom";

export const SignupModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  height: 100%;

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      min-height: -webkit-fill-available !important;
    }
  }

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: #ffffff;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
  }

  .wrap-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow-y: scroll;
  }

  .wrap-container::-webkit-scrollbar {
    display: none;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0.5rem 0 !important;
  }

  .header-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .step-header {
    font-size: 18px;
    font-weight: bold;
  }

  .header-text {
    font-size: 2.5rem;
    font-weight: bold;
    font-family: ProximaNova, Arial, Tahoma, PingFangSC, sans-serif;
    color: #161823;
    margin: 0 auto;
    margin-top: 1rem;
  }

  .signup-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border-top: 1.5px solid #e0e0e0;
    padding: 2rem 0 !important;
    margin: 0 !important;
  }

  .login-footer-link {
    color: #00a8ff;
  }

  @media screen and (min-width: 767px) {
    .modal-container {
      height: 90%;
      width: 55%;
      border-radius: 1.5rem;
    }
  }

  @media screen and (min-width: 1023px) {
    .modal-container {
      height: 90%;
      width: 40%;
    }
  }
`;

export const NewSignUpContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background-color: #ededed;

  .avatar {
    border-radius: 50%;
    width: 6rem;
    margin-bottom: -15rem;
  }

  .avatar-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const ComponentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;

  .name-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin: 0 4rem;
  }

  .flex {
    flex-grow: 1;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  .code-container {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    background: #ededed;
  }

  .margin {
    margin: 0 4rem;
  }

  .signup-option-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input-header {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .input-links {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .input {
    width: 100%;
    padding: 1.3rem;
    background: #ededed;
    outline: none;
    border: 1.5px solid lightgray;
    border-radius: 0.5rem;

    &:focus {
      outline: none;
      border: 2px solid var(--primary-color);
    }
  }

  .next-btn {
    margin: 3rem 4rem;
    padding: 1.3rem 3rem;
    background-color: var(--primary-color);
    font-size: 1.7rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    outline: none;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #277acc;
    }
  }

  .disabled {
    margin: 3rem 4rem;
    padding: 1.3rem 3rem;
    background-color: #99baf0;
    font-size: 1.7rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    outline: none;
    cursor: pointer;
  }

  .btn-color {
    background-color: green;

    &:hover {
      background-color: darkgreen;
    }
  }

  .disabled-color {
    background-color: #a2d99a;
  }

  .options-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    margin: 1rem 0;
    border: 2px solid #ededed;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .options-text {
    font-weight: 500;
    font-size: 16px;
  }

  .no-border {
    border: none;
    border-radius: 0;

    &:focus {
      outline: none;
      border: none;
    }
  }

  .code-btn {
    outline: none;
    border: none;
    background: #fff;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    flex-shrink: 0;
    padding: 1.3rem 1.5rem;
    font-weight: bold;
  }

  .disabled-code-btn {
    outline: none;
    border: none;
    background: #fff;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    flex-shrink: 0;
    padding: 1.3rem 1.5rem;
    font-weight: bold;
    color: #b0afae;
  }

  .password-instruction {
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
    color: #8c8c8c;
    font-size: 1.2rem;
  }

  .instruction-error {
    color: #ff0000;
  }

  .instruction-success {
    color: #009150;
  }

  .instruction-header {
    font-weight: bold;
    font-size: 1.2rem;
    font-weight: 600;
    color: #525252;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;

  .name-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin: 0 4rem;
  }

  .flex {
    flex-grow: 1;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  .code-container {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    background: #ededed;
  }

  .margin {
    margin: 0 4rem;
  }

  .input-header {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .input {
    width: 100%;
    padding: 1.3rem;
    background: #ededed;
    outline: none;
    border: 1.5px solid lightgray;
    border-radius: 0.5rem;

    &:focus {
      outline: none;
      border: 2px solid var(--primary-color);
    }
  }

  .next-btn {
    margin: 3rem 4rem;
    padding: 1.3rem 3rem;
    background-color: var(--primary-color);
    font-size: 1.7rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    outline: none;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #277acc;
    }
  }

  .disabled {
    margin: 3rem 4rem;
    padding: 1.3rem 3rem;
    background-color: #99baf0;
    font-size: 1.7rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    outline: none;
    cursor: pointer;
  }

  .btn-color {
    background-color: green;

    &:hover {
      background-color: darkgreen;
    }
  }

  .disabled-color {
    background-color: #a2d99a;
  }

  .options-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    margin: 1rem 0;
    border: 2px solid #ededed;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .options-text {
    font-weight: 500;
    font-size: 16px;
  }

  .no-border {
    border: none;
    border-radius: 0;

    &:focus {
      outline: none;
      border: none;
    }
  }

  .code-btn {
    outline: none;
    border: none;
    background: #fff;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    flex-shrink: 0;
    padding: 1.3rem 1.5rem;
    font-weight: bold;
  }

  .disabled-code-btn {
    outline: none;
    border: none;
    background: #fff;
    border-radius: 0 0.5rem 0.5rem 0;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    flex-shrink: 0;
    padding: 1.3rem 1.5rem;
    font-weight: bold;
    color: #b0afae;
  }

  .password-instruction {
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
    color: #8c8c8c;
    font-size: 1.2rem;
  }

  .instruction-error {
    color: #ff0000;
  }

  .instruction-success {
    color: #009150;
  }

  .instruction-header {
    font-weight: bold;
    font-size: 1.2rem;
    font-weight: 600;
    color: #525252;
  }
`;

export const BackIcon = styled(TiArrowBackOutline)`
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 500;
  flex-shrink: 0;
  margin: 0 !important;
`;

export const CancelIcon = styled(MdOutlineCancel)`
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
  color: red;
  font-weight: 500;
  flex-shrink: 0;
  margin: 0 !important;
`;

export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: #000;
`;
