import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";

export const TransactionModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  height: -webkit-fill-available;

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #fafafa;
    height: 50vh;
    width: 68vw;
    border: none;
    border-radius: 0.5rem;
    outline: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 500;
    color: #63625f;

    @media screen and (min-width: 639px) {
      height: 55vh;
      width: 50vw;
    }

    @media screen and (min-width: 767px) {
      height: 55vh;
      width: 40vw;
    }

    @media screen and (min-width: 1023px) {
      height: 52vh;
      width: 30vw;
    }

    @media screen and (min-width: 1279px) {
      height: 53vh;
      width: 22vw;
    }
  }
`;

export const EthDonationModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      min-height: -webkit-fill-available !important;
    }
  }

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem;
    background: #ffffff;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    width: 100vw;
    border: none;
    outline: none;

    @media screen and (min-width: 767px) {
      min-height: 57vh;
      max-width: 30vw;
      min-width: 410px;
      border-radius: 0.5rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    @media screen and (min-width: 1023px) {
      max-width: 25vw;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    margin-top: -3rem;
    flex: 1;
    width: 100%;
    @media screen and (min-width: 600px) {
      flex-direction: row;
    }
  }

  .content {
    width: 100%;
    padding: 1.5rem;
    border: none;
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-self: center;
  }

  .login-header2 {
    font-size: 2rem;
    margin: 1rem 0;
    margin-bottom: 3rem;
    font-weight: 600;
    text-align: center;
  }

  .lgn-btn {
    margin: 1rem 0;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .form-input-container {
    display: flex;
    margin: 0.75rem 0;
    padding: 0 0.5rem;
    border: 1px solid #fafafa;
    border-width: 1px;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ededed;

    &:hover {
      border: 2px solid #e5e7eb;
    }
  }

  .form-input {
    width: 100%;
    height: 5rem;
    font-size: 1.6rem;
    line-height: 2.25rem;
    outline: 2px solid transparent;
    outline-offset: 2px;
    border: none;
    background-color: #ededed;
    padding: 0 0.5rem;
    margin: 0 0.5rem;
  }

  .currency-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-width: 1px;
    border-radius: 1rem;
    background-color: rgba(0, 0, 255, 0.1);
    padding: 0.5rem;
    color: #63625f;
  }

  .currency-title {
    font-size: 1.5rem;
    font-weight: 600;
    padding-top: 0.3rem;
  }

  .padding-left {
    padding-left: 0.5rem;
  }

  .confirm-btn {
    font-weight: semibold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: var(--primary-color);
    border-radius: 0.7rem;
    font-size: 1.8rem;
    font-weight: 600;
    color: #ffffff;
    height: 5rem;
    padding: 1rem;
    margin: 1.5rem 0.2rem;

    &:hover {
      border: 0.5px solid #e5e7eb;
    }
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff8f2;
    padding: 1rem 0;
    margin: 0.5rem;
    border: none;
    border-radius: 0.5rem;
  }

  .close-icon2 {
    right: 10px;
    border: none;
    top: 10px;
    font-size: 12px;
    font-weight: 500;
    align-self: flex-end;
    cursor: pointer;
  }
  .close-icon-main2 {
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .transaction-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 500;
    color: #63625f;
  }
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
  justify-content: center;
  margin-top: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: var(--primary-color);
`;
