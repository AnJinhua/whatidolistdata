import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { MdOutlineCancel } from "react-icons/md";

export const DonationOptionsModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #ffffff;
    min-height: 40vh;
    width: 65vw;
    border: none;
    outline: none;
    border-radius: 0.5rem;

    @media screen and (min-width: 767px) {
      min-height: 35vh;
      max-width: 30vw;
      border-radius: 0.5rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    @media screen and (min-width: 1280px) {
      max-width: 20vw;
    }
  }

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      min-height: -webkit-fill-available !important;
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
  }

  .header-text {
    font-size: 1.6rem;
    margin: 1rem 0;
    margin-bottom: 3rem;
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
