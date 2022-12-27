import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ETH_DONATION } from "../../constants/actions";
import { IconButton } from "@material-ui/core";
import { EthDonationModal, CancelIcon } from "./styles";
import RewardForm from "./RewardForm";
import { TransactionContext } from "../../context/TransactionContext";

const EthModal = ({ isPaystackAvailable }) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.ethDonation.show);

  const { setEthEquivalent, setUsdEquivalent, setError } =
    useContext(TransactionContext);

  const setShowFalse = () => {
    setEthEquivalent("");
    setUsdEquivalent("");
    setError("");

    dispatch({
      type: ETH_DONATION,
      payload: false,
    });
  };

  return (
    <EthDonationModal
      open={show}
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
            <RewardForm isPaystackAvailable={isPaystackAvailable} />
          </div>
        </div>
      </div>
    </EthDonationModal>
  );
};

export default EthModal;
