import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";

export const LoginModal = styled(Modal)`
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
    flex: 1;
    width: 100%;
    @media screen and (min-width: 600px) {
      flex-direction: row;
    }
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .or {
    border: 2px solid lightgray;
    border-radius: 50%;
    padding: 10px;
    color: gray;
    background-color: white;
    font-weight: bold;
    z-index: 1;
  }

  .login-line {
    width: 1.5px;
    height: 55vh;
    background-color: lightgray;
    position: absolute;
    top: 0;
    bottom: 0;

    margin: auto;
  }

  .login-header {
    font-size: 2.5rem;
    margin: 0.5rem 0 !important;
    font-weight: 600;
  }
  .avartar {
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

  .seperate {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .lgn-btn {
    margin: 1rem;
  }

  .login-wapper {
    display: flex;
    flex-direction: column;
    margin: 2rem;
  }
  .signup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin: 1rem;
  }
  @media screen and (max-width: 600px) {
    .left {
      order: 3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .right {
      order: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .center {
      order: 2;
      margin-bottom: 2rem;
    }
    .login-line {
      width: 100vw;
      height: 1.5px;
    }
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

  .loginButton2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    padding: 20px 30px;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .google2 {
    background-color: #df4930;
  }
  .facebook2 {
    background-color: #507cc0;
  }
  .twitter2 {
    background-color: #263853;
  }
  .github2 {
    background-color: black;
  }

  .icon-login {
    width: 20px;
    height: 20px;
    margin-right: 10px;
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: var(--primary-color);
`;
