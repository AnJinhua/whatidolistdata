import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { TiArrowBackOutline } from "react-icons/ti";

export const PaymentPageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 999;
  min-height: -webkit-fill-available;
  overflow: hidden;
`;

export const PaymentPage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .close-icon-btn {
    height: 2.5rem;
    width: 2.5rem;
    color: #fff;
    cursor: pointer;
  }

  .iconBtn {
    padding: 1rem;
    cursor: pointer;
  }
  .right {
    margin-right: 0.5rem;
  }

  .wrap-container {
    max-width: 475px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border: 2px solid #e6e6e6;
    border-radius: 1.5rem;
  }

  .avatar-container {
    margin: 5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .avatar-container img {
    border-radius: 50%;
    width: 6rem;
  }

  .payment-header {
    font-size: 2rem;
    font-weight: 600;
    color: gray;
    margin: 2rem 0.5rem;
  }

  .payment-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding: 0 5rem;
  }

  .payment-btn {
    padding: 1.5rem 2rem;
    background-color: #fafafa;
    border-radius: 1rem;
    font-size: 2rem;
    width: 100%;
    margin: 1rem auto !important;
    font-weight: 600;
    color: gray;
    border: 2px solid var(--primary-color);
    outline: none;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: var(--primary-color);
      color: #fff;
    }
  }

  .arrow-back-btn {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
`;

export const TimesIcon = styled(TiArrowBackOutline)`
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 500;
  flex-shrink: 0;
`;

export const BottomSheetPage = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  z-index: 999;

  .bottom-sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    margin: 2rem;
  }

  .bottom-sheet-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 2rem;
  }

  .connect-text {
    font-size: 1.7rem;
    font-weight: 600;
    color: #5c5b5b;
    margin: 1rem 0;
  }

  .connect-btn {
    padding: 1.5rem 2rem;
    background-color: var(--primary-color);

    font-size: 2rem;
    width: 100%;
    margin: 1rem auto !important;
    font-weight: 600;
    color: #fff;
    border: none;
    border-radius: 2rem;
    outline: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: lightblue;
    }
  }

  .balance-container {
    width: 100%;
    margin: 0 2rem;
  }

  .balance-text {
    font-size: 4rem;
    font-weight: 600;
    padding: 0 !important;
  }

  .balance-info {
    font-size: 2rem;
    font-weight: 500;
    color: gray;
    margin-right: 3rem;
  }

  .text-color {
    color: #5c5b5b;
    font-size: 1.8rem;
  }

  .margin-top {
    padding: 3rem 2rem;
    padding-bottom: 0 !important;
  }

  .wallet-balance {
    font-size: 3rem;
    font-weight: 600;
  }

  .wallet-balance-text {
    font-size: 2rem;
    font-weight: 500;
    color: gray;
  }

  .span-container {
    display: flex;
    flex-direction: column;
  }

  .margin {
    margin: 0 2rem;
  }

  .margin-y {
    margin: 0;
    margin-bottom: 5rem;
  }
`;

export const WithdrawModal = styled(Modal)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.7);

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #ffffff;
    height: 50vh;
    width: 68vw;
    border: none;
    outline: none;
    border-radius: 0.5rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

    @media screen and (min-width: 639px) {
      height: 55vh;
      width: 50vw;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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

  .modal-header {
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    margin: 0 1rem;
    color: #5c5b5b;
    border: none;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .modal-input {
    width: 70%;
    height: 5rem;
    border-radius: 0.8rem;
    border: 2px solid #e6e6e6;
    outline: none;
    padding: 0.5rem;
    margin: 1rem 5rem;
    font-size: 1.5rem;
  }

  .modal-btn {
    width: 70%;
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: none;
    outline: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: 2rem;
  }

  .del-modal-header {
    font-size: 16px;
    font-weight: 500;
    margin: 1rem;
    color: #5c5b5b;
    border: none;
    text-align: center;
  }

  .del-btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    margin: 1rem 0;
  }

  .del-btn {
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: 2px solid red;
    outline: none;
    color: #fff;
    background-color: red;
    font-size: 2rem;
    padding: 1rem;

    @media screen and (min-width: 1279px) {
      width: 9vw;
    }
  }

  .cancel-btn {
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: 2px solid #e6e6e6;
    outline: none;
    color: gray;
    background-color: #fafafa;
    font-size: 2rem;
    padding: 1rem;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: white;
      color: #5c5b5b;
    }

    @media screen and (min-width: 1279px) {
      width: 8vw;
    }
  }
`;

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
