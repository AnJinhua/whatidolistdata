import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { LoginModal, CancelIcon } from "./styles";
import DonationForm from "./DonationForm";
import { DONATION_CHANGE } from "../../constants/actions";
import { IconButton } from "@material-ui/core";

const Login = ({ stripeAccount, userSlug, isPaystackAvailable }) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.donation.show);

  const setShowFalse = () => {
    dispatch({
      type: DONATION_CHANGE,
      payload: false,
    });
  };

  return (
    <LoginModal
      open={show}
      style={{ overflow: "scroll" }}
      onClose={() => {
        setShowFalse();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-container">
        <div className="close-icon2" onClick={setShowFalse}>
          <div className="close-icon-main2">
            <IconButton>
              <CancelIcon />
            </IconButton>
          </div>
        </div>

        <div className="wrapper">
          <div className="right">
            <DonationForm
              setShowFalse={setShowFalse}
              stripeAccount={stripeAccount}
              userSlug={userSlug}
              isPaystackAvailable={isPaystackAvailable}
            />
          </div>
        </div>
      </div>
    </LoginModal>
  );
};

export default Login;
