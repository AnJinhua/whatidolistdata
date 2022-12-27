import { useDispatch, useSelector } from "react-redux";
import { PAYSTACK } from "../../constants/actions";
import { IconButton } from "@material-ui/core";
import { PaystackModal, CancelIcon } from "./styles";
import PaystackAccount from "./PaystackAccount";
import { API_URL } from "../../constants/api";
import useSwr, { mutate } from "swr";

const Paystack = ({ firstName, lastName, userSlug }) => {
  const show = useSelector((state) => state.paystack.show);
  const dispatch = useDispatch();

  const paystackUrl = `${API_URL}/paystack/${userSlug}`;
  const { data: paystackAccount } = useSwr(paystackUrl);

  const setShowFalse = () => {
    dispatch({
      type: PAYSTACK,
      payload: false,
    });
  };

  return (
    <PaystackModal
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
          {paystackAccount?.status && (
            <p className="header-text">Update paystack account</p>
          )}
          {!paystackAccount?.status && (
            <p className="header-text">Create paystack account</p>
          )}
          <PaystackAccount
            firstName={firstName}
            lastName={lastName}
            userSlug={userSlug}
            status={paystackAccount?.status}
          />
        </div>
      </div>
    </PaystackModal>
  );
};

export default Paystack;
