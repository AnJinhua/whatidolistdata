import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext";
import { PaymentPage, TimesIcon } from "./styles";
import logo from "../../assets/logo-icon.png";
import BottomSheet from "./stripe/BottomSheet";
import CoinbaseBottomSheet from "./coinbase/CoinbaseBottomSheet";
import { RiArrowDownSLine } from "react-icons/ri";
import { IconButton } from "@material-ui/core";

const Payments = () => {
  const history = useHistory();
  const { coinbaseConnect, metamaskConnect, currentAccount, walletBalance } =
    useContext(TransactionContext);

  const checkMetamask = () => {
    if (window?.ethereum?.isMetaMask) {
      metamaskConnect();
    } else {
      return window.open("https://metamask.io/download/", "_blank");
    }
  };

  const checkCoinbase = () => {
    if (window?.ethereum?.coinbaseWalletInstalls !== undefined) {
      coinbaseConnect();
    } else {
      return window.open("https://www.coinbase.com/wallet", "_blank");
    }
  };

  const items = [
    {
      text: "COINBASE",
      currentAccount: currentAccount,
      walletBalance: walletBalance,
    },
  ];

  const itemes = [
    {
      text: "STRIPE",
      onClick: (toggleAnimation) => {
        alert("Editar");
        toggleAnimation();
      },
    },
  ];

  return (
    <PaymentPage>
      <div className="wrap-container">
        <IconButton className="arrow-back-btn" onClick={history.goBack}>
          <TimesIcon />
        </IconButton>
        <div className="avatar-container">
          <img
            loading="lazy"
            src={logo}
            alt="logo"
            onClick={() => history.push("/")}
            style={{ cursor: "pointer" }}
          />
          <p className="payment-header">withdraw to your wallet or bank</p>
        </div>
        <div className="payment-container">
          {!currentAccount && (
            <button onClick={checkMetamask} className="payment-btn">
              Metamask
            </button>
          )}

          {!currentAccount && (
            <button onClick={checkCoinbase} className="payment-btn">
              Coinbase
            </button>
          )}
          {currentAccount && (
            <CoinbaseBottomSheet
              items={items}
              startHidden={true}
              buttonElement={
                <div
                  className="payment-btn"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>Wallet</span>
                  <RiArrowDownSLine size={30} />
                </div>
              }
            />
          )}
          <BottomSheet
            items={itemes}
            startHidden={true}
            buttonElement={<button className="payment-btn">Stripe</button>}
          />
        </div>
      </div>
    </PaymentPage>
  );
};

export default Payments;
