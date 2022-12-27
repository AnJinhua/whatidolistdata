import { ComponentsContainer } from "./styles";
import { CgProfile } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { RiTwitterFill, RiFacebookCircleFill } from "react-icons/ri";
// import { SocialIcon } from "react-social-icons";

import { API_URL } from "../../../constants/api";

const SignupOptions = ({ handlePage }) => {
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
    <ComponentsContainer>
      <div className="input-container margin">
        <div onClick={() => handlePage(1)} className="options-btn">
          <div style={{ flexGrow: "0.5" }}>
            <CgProfile
              style={{
                height: "2rem",
                width: "2rem",
                marginRight: "1rem",
              }}
            />
          </div>
          <span className="options-text">Use email or phone</span>
        </div>

        <div onClick={facebook} className="options-btn">
          <div style={{ flexGrow: "0.5" }}>
            <RiFacebookCircleFill
              // url="https://facebook.com"
              style={{
                height: "2.2rem",
                width: "2.2rem",
                marginRight: "1rem",
                color: "#3b5998",
              }}
            />
          </div>
          <span className="options-text">Continue with Facebook</span>
        </div>

        <div onClick={google} className="options-btn">
          <div style={{ flexGrow: "0.5" }}>
            <FcGoogle
              style={{
                height: "2rem",
                width: "2rem",
                marginRight: "1rem",
              }}
            />
          </div>
          <span className="options-text">Continue with Google</span>
        </div>

        <div onClick={twitter} className="options-btn">
          <div style={{ flexGrow: "0.5" }}>
            <RiTwitterFill
              style={{
                height: "2rem",
                width: "2rem",
                marginRight: "1rem",
                color: "#1DA1F2",
              }}
            />
          </div>
          <span className="options-text">Continue with Twitter</span>
        </div>
      </div>
    </ComponentsContainer>
  );
};

export default SignupOptions;
