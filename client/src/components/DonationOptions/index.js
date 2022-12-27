import { useDispatch, useSelector } from "react-redux";
import {
  PAYMENT_OPTIONS,
  DONATION_CHANGE,
  ETH_DONATION,
} from "../../constants/actions";
import { IconButton } from "@material-ui/core";
import { DonationOptionsModal, CancelIcon } from "./styles";
import stripeLogo from "../../assets/stripe_logo.png";
import paystackLogo from "../../assets/paystack.png";
import ethLogo from "../../assets/eth.png";

const DonationOptions = ({ isPaystackAvailable }) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.paymentOptions.show);

  const setShowFalse = () => {
    dispatch({
      type: PAYMENT_OPTIONS,
      payload: false,
    });
  };

  const stripeOption = () => {
    dispatch({
      type: PAYMENT_OPTIONS,
      payload: false,
    });

    dispatch({
      type: DONATION_CHANGE,
      payload: true,
    });
  };

  const ethOption = () => {
    dispatch({
      type: PAYMENT_OPTIONS,
      payload: false,
    });

    dispatch({
      type: ETH_DONATION,
      payload: true,
    });
  };

  return (
    <DonationOptionsModal
      open={show}
      onClose={() => {
        setShowFalse();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-container">
        <div className="close-icon2" onClick={setShowFalse}>
          <IconButton>
            <CancelIcon />
          </IconButton>
        </div>
        <div className="header-text"> Choose a payment option</div>

        <div className="wrapper">
          {!isPaystackAvailable && (
            <div className="options-btn stripe-color" onClick={stripeOption}>
              <img
                loading="lazy"
                src={stripeLogo}
                alt="stripe"
                className="avatar"
              />
              Stripe
            </div>
          )}

          {isPaystackAvailable && (
            <div className="options-btn paystack-color" onClick={stripeOption}>
              <img
                loading="lazy"
                src={paystackLogo}
                alt="paystack"
                className="avatar"
              />
              Paystack
            </div>
          )}

          <div className="options-btn eth-color" onClick={ethOption}>
            <img loading="lazy" src={ethLogo} alt="stripe" className="avatar" />
            Ethereum
          </div>
        </div>
      </div>
    </DonationOptionsModal>
  );
};

export default DonationOptions;
