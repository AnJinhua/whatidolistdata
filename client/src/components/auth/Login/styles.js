import styled from "styled-components";
import { Modal } from "@material-ui/core";
import { MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";

export const LoginModal = styled(Modal)`
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
    padding: 1rem;
    background: #ffffff;
    height: 100%;
    width: 100%;
    width: 100vw;
    border: none;
    outline: none;

    @media screen and (min-width: 767px) {
      min-height: 90%;
      max-height: 90%;
      max-width: 55%;
      border-radius: 1.5rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    @media screen and (min-width: 1023px) {
      max-width: 40%;
    }
  }
  .wrapper {
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
  }

  .wrapper::-webkit-scrollbar {
    display: none;
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 1rem 4rem;
  }

  .center {
    display: none;
  }

  .or {
    padding: 10px;
    color: gray;
    background-color: white;
    font-weight: bold;
    z-index: 1;
  }

  .login-line {
    display: flex;
    height: 1.5px;
    width: 30vw;
    background-color: lightgray;
    position: absolute;
    top: 0;
    bottom: 0;

    margin: auto;
  }

  .login-header {
    font-size: 2.5rem;
    margin: 1rem 0;
    font-weight: 600;
  }
  .avartar {
    display: flex;
    justify-content: center;
    align-self: center;
  }
  .login-header2 {
    font-size: 2rem;
    margin: 1rem 0 !important;
    font-weight: 600;
    text-align: center;
  }

  .seperate {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .lgn-btn {
    margin: 1rem 0 !important;
    width: 100%;
  }

  .login-wapper {
    display: flex;
    flex-direction: column;
    margin: 1rem;
    width: 100%;
  }
  .signup-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin: 1rem;
  }

  .avatar {
    margin-top: -2rem;
  }

  @media screen and (min-width: 575px) {
    .center {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .avatar {
      margin-top: 0;
    }
  }

  @media screen and (max-width: 600px) {
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem 4rem 1rem 4rem;
    }

    .center {
      order: 2;
      margin-bottom: 2rem;
      width: 100%;
    }
    .login-line {
      width: 80%;
      height: 1.5px;
    }
  }

  .close-icon2 {
    right: 10px;
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
    width: 80%;
    background-color: #fff;
    padding: 15px 30px;
    border: 1.5px solid lightgray;
    border-radius: 5rem;
    color: black;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #f5f5f5;
    }
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

  .login-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border-top: 2px solid #e0e0e0;
    padding: 2rem 0 !important;
    margin: 0 !important;
  }

  .login-footer-link {
    color: var(--primary-color);
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
  color: #000;
`;
