import React from "react";

import { LoginModal, CancelIcon, LinkContainer } from "./styles";
import { API_URL } from "../../../constants/api";
import LoginForm from "./LoginForm";
import { IconButton } from "@material-ui/core";
import { RiTwitterFill, RiFacebookCircleFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Avatar from "@mui/material/Avatar";
import Logo from "../../../assets/logo-icon.png";

const Login = (props) => {
  const { unsetUserLogin, show, setUserSignup } = props;

  const google = () => {
    window.open(`${API_URL}/auth/google`, "_self");
  };

  const facebook = () => {
    window.open(`${API_URL}/auth/facebook`, "_self");
  };

  const twitter = () => {
    window.open(`${API_URL}/auth/twitter`, "_self");
  };

  return (
    <LoginModal
      open={show}
      style={{ overflow: "scroll" }}
      onClose={() => {
        unsetUserLogin();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-container">
        <div className="close-icon2" onClick={unsetUserLogin}>
          <IconButton>
            <CancelIcon />
          </IconButton>
        </div>
        <div className="avatar">
          <Avatar
            src={Logo}
            sx={{ m: 1, bgcolor: "secondary.main", alignSelf: "center" }}
          ></Avatar>
        </div>
        <p className="login-header">Login </p>
        <div className="wrapper">
          <div className="left">
            <LoginForm
              unsetUserLogin={unsetUserLogin}
              setUserSignup={setUserSignup}
            />

            <div className="center">
              <div className="login-line" />
              <div className="or">or</div>
            </div>
          </div>

          <div className="right">
            <div className="loginButton2" onClick={facebook}>
              <RiFacebookCircleFill
                style={{
                  height: "2.2rem",
                  width: "2.2rem",
                  marginRight: "1rem",
                  color: "#3b5998",
                }}
              />
              Continue with Facebook
            </div>
            <div className="loginButton2" onClick={google}>
              <FcGoogle
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginRight: "1rem",
                }}
              />
              Continue with Google
            </div>
            <div className="loginButton2" onClick={twitter}>
              <RiTwitterFill
                style={{
                  height: "2rem",
                  width: "2rem",
                  marginRight: "1rem",
                  color: "#1DA1F2",
                }}
              />
              Continue with Twitter
            </div>
          </div>
        </div>
        <div className="login-footer">
          <span>Don't have an account?</span>&nbsp;
          <LinkContainer
            className="login-footer-link"
            onClick={() => {
              unsetUserLogin();
              setUserSignup();
            }}
          >
            Sign up
          </LinkContainer>
        </div>
      </div>
    </LoginModal>
  );
};

export default Login;
