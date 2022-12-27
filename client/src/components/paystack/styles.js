import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { MdOutlineCancel } from "react-icons/md";

export const PaystackModal = styled(Modal)`
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
    min-height: 60vh;
    // min-height: -webkit-fill-available;
    width: 80vw;
    border: none;
    outline: none;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    @media screen and (min-width: 767px) {
      min-height: 55vh;
      max-width: 30vw;
      min-width: 410px;
      border-radius: 0.5rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    @media screen and (min-width: 1280px) {
      max-width: 25vw;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 3rem;
    flex: 1;
    width: 100%;
  }

  .header-text {
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-self: center;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    margin-right: 1rem;
  }

  .close-icon2 {
    right: 3px;
    top: 3px;
    border: none;
    font-size: 12px;
    font-weight: 500;
    align-self: flex-end;
    cursor: pointer;
  }
  .close-icon-main2 {
    margin: 1px 2px;
  }

  .options-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    background-color: #fff;
    padding: 15px 30px;
    margin: 1rem auto !important;
    border: 1.5px solid lightgray;
    border-radius: 0.5rem;
    color: black;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
  }

  .eth-color {
    &:hover {
      color: #fff;
      background-color: #716b94;
    }
  }

  .stripe-color {
    &:hover {
      color: #fff;
      background-color: #3490e9;
    }
  }

  .paystack-color {
    &:hover {
      color: #fff;
      background-color: #191970;
    }
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

export const PaystackForm = styled.form`
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 2rem;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
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
      border: 2px solid lightgray;
    }
  }

  .border-error {
    width: 100%;
    padding: 1.3rem;
    background: #ededed;
    outline: none;
    border: 2px solid #ff0000;
    border-radius: 0.5rem;
  }

  .input-title {
    font-weight: bold;
  }

  .instruction-error {
    color: #ff0000;
  }

  .confirm-btn {
    padding: 1.3rem 3rem;
    margin-top: 0.5rem;
    background-color: var(--primary-color);
    font-size: 1.7rem;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    outline: none;
    cursor: pointer;
    width: 100%;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #277acc;
    }
  }

  .delete-btn {
    background-color: red;
    margin: 2rem 0;
  }
`;
