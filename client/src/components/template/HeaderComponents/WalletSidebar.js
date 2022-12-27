import { useState, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { TransactionContext } from "../../../context/TransactionContext";
import {
  WalletSidebarContainer,
  WalletSidebarOption,
  WalletSidebarList,
  TransactionModal,
  WithdrawModal,
  CloseIcon,
} from "./styles.component";
import metamask from "../../../assets/MetaMask_Fox.svg";
import coinbase from "../../../assets/coinbase.png";
import stripeImg from "../../../assets/stripe_logo.png";
import paystackLogo from "../../../assets/paystack.png";
import { API_URL } from "../../../constants/api";
import {
  createConnectAcct,
  deleteConnectAcct,
} from "../../../actions/stripeConnect";
import useSwr, { mutate } from "swr";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/react";
import WithdrawFund from "./WithdrawFund";
import DeleteStripeAccount from "./DeleteStripeAccount";
import { PAYSTACK } from "../../../constants/actions";
import Paystack from "../../paystack";
import { BsFillPatchCheckFill } from "react-icons/bs";
import * as coordinateToCountry from "coordinate_to_country";
import { GiBuyCard } from "react-icons/gi";

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

const WalletSidebar = () => {
  const [username, setUsername] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isTransact, setIsTransact] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isPaystackAvailable, setIsPaystackAvailable] = useState(false);
  const history = useHistory();

  const [{ token }] = useCookies(["token"]);
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  const connectUrl = `${API_URL}/stripe-connect/account/${user?.slug}`;
  const { data: stripeAccount } = useSwr(connectUrl);

  const paystackUrl = `${API_URL}/paystack/${user?.slug}`;
  const { data: paystackAccount } = useSwr(paystackUrl);

  // const { data: locationDetails } = useSwr("http://ip-api.com/json");

  // get experts country code from latlng
  const expertCountry = coordinateToCountry(
    user?.locationLat,
    user?.locationLng,
    true
  );

  const {
    coinbaseConnect,
    metamaskConnect,
    currentAccount,
    walletBalance,
    disconnectWallet,
    setToggleSidebar,
  } = useContext(TransactionContext);

  // getting coinbase provider from browser
  const coinbaseProvider = window.ethereum?.providers?.find(
    (provider) => provider.isCoinbaseWallet
  );

  // checks if metamask exists in browser
  const checkMetamask = () => {
    if (window?.ethereum?.isMetaMask) {
      metamaskConnect();
    } else {
      return window.open("https://metamask.io/download/", "_blank");
    }
  };

  // checks if coinbase exists in browser
  const checkCoinbase = () => {
    if (
      coinbaseProvider !== undefined ||
      window?.ethereum?.coinbaseWalletInstalls !== undefined
    ) {
      coinbaseConnect();
    } else {
      return window.open("https://www.coinbase.com/wallet", "_blank");
    }
  };

  let userData = {
    first_name: user?.profile?.firstName,
    last_name: user?.profile?.lastName,
    email: user?.email,
    slug: user?.slug,
    location: window.location.pathname,
    country: expertCountry[0],
  };

  const createStripeConnect = async (data) => {
    try {
      const res = await createConnectAcct(data, token);

      mutate(connectUrl, (account) => {
        return [...account, res.data?.account];
      });
      window.open(res?.data?.url, "_self");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleCreateStripeConnect = async () => {
    setIsTransact(false);
    setIsLoading(true);
    createStripeConnect(userData);
    setIsLoading(false);
  };

  const handleDeleteStripeConnect = async () => {
    setIsTransact(false);
    setIsLoading(true);
    try {
      await deleteConnectAcct(user?.slug, token);
      mutate(
        connectUrl,
        (account) => {
          return [];
        },
        false
      );
      setIsLoading(false);
      setIsTransact(true);
      setOpenDelModal(false);

      toast.success("your stripe account has been deleted successfully.", {
        position: "top-center",
        theme: "light",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setIsLoading(false);
      setIsTransact(true);
      toast.error("error deleting account, try again!", {
        position: "top-center",
        theme: "light",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const paystackModal = () => {
    setToggleSidebar(false);

    dispatch({
      type: PAYSTACK,
      payload: true,
    });
  };

  const goToProfile = () => {
    setToggleSidebar(false);
    history.push(`/transaction-history/${user?.slug}`);
  };

  useEffect(() => {
    setUsername(
      `${currentAccount?.slice(0, 5)}...${currentAccount?.slice(-4)}`
    );
  }, [currentAccount]);

  useEffect(() => {
    const paystackAvailability = ["NG", "GH", "ZA"];

    if (paystackAvailability.includes(expertCountry[0])) {
      setIsPaystackAvailable(true);
    } else {
      setIsPaystackAvailable(false);
    }
  }, [expertCountry]);

  return (
    <WalletSidebarContainer>
      <WalletSidebarOption>
        <div className="close-icon-container">
          <CloseIcon onClick={() => setToggleSidebar(false)} />
          <span className="wallet-header">My wallet</span>
        </div>
        {currentAccount && <span className="wallet-address">{username}</span>}
      </WalletSidebarOption>
      <div className="line" />

      {currentAccount && (
        <WalletSidebarList>
          <div className="wallet-price-container">
            <p className="wallet-price-text">Wallet balance</p>
            <p className="wallet-price-value">
              {currentAccount && walletBalance && walletBalance.slice(0, 6)} ETH
            </p>
          </div>
          <button
            className="wallet-disconnect-btn"
            onClick={() => disconnectWallet()}
          >
            disconnect
          </button>
        </WalletSidebarList>
      )}

      {stripeAccount?.data?.stripe_acct_id && (
        <WalletSidebarList>
          <div className="wallet-price-container info-box-container">
            <p className="wallet-price-text">Stripe withdrawal balance</p>
            <p className="wallet-price-value">
              {`${
                stripeAccount && stripeAccount?.balance?.available[0]?.amount
              } ${
                stripeAccount &&
                stripeAccount?.balance?.available[0]?.currency.toLocaleUpperCase()
              }`}
            </p>
          </div>

          <div className="stripe-btn-container info-box-container">
            <button
              className="stripe-disconnect-btn"
              onClick={() => {
                setToggleSidebar(false);
                setOpenDelModal(true);
              }}
            >
              disconnect
            </button>
            <button
              className="stripe-withdraw-btn"
              onClick={() => {
                setToggleSidebar(false);
                setOpenModal(true);
              }}
            >
              withdraw funds
            </button>

            {!stripeAccount?.enabled && (
              <p className="info-box" style={{ marginTop: "7rem" }}>
                your stripe account is not activated for payment. you'll need to
                create a new account and finish the onboarding process to fully
                be eligible for donations.
              </p>
            )}

            {stripeAccount?.enabled &&
              stripeAccount?.balance?.available[0]?.amount === 0 && (
                <p className="info-box" style={{ marginTop: "7rem" }}>
                  there is no accessible fund for withdrawal; nevertheless, the
                  funds for each transaction will be available for withdrawal
                  within 7 days.
                </p>
              )}
          </div>
        </WalletSidebarList>
      )}

      {!currentAccount && !stripeAccount?.data?.stripe_acct_id && (
        <div className="header-text">
          <p>
            select a provider and connect to your account now to process
            payments
          </p>
        </div>
      )}

      {/* connection buttons */}
      <div>
        <ul className="wallet-sidebar-list">
          <li>
            {!currentAccount && (
              <button
                onClick={checkMetamask}
                className="wallet-sidebar-list-btn top-radius"
                style={{ justifyContent: "space-between" }}
              >
                <div className="sidebar-div">
                  <img loading="lazy" src={metamask} alt="metamask" />
                  <span style={{ fontWeight: "bold" }}>Metamask</span>
                </div>
                <div className="sidebar-info-div">
                  <span>Popular</span>
                </div>
              </button>
            )}
          </li>
          {!currentAccount && <div className="line" />}
          <li>
            {!currentAccount && (
              <button
                onClick={checkCoinbase}
                className="wallet-sidebar-list-btn"
              >
                <img loading="lazy" src={coinbase} alt="metamask" />
                <span style={{ fontWeight: "bold" }}>Coinbase Wallet</span>
              </button>
            )}
          </li>
          {!currentAccount &&
            !stripeAccount?.data?.stripe_acct_id &&
            !isPaystackAvailable && <div className="line" />}
          <li className="info-box-container">
            {!stripeAccount?.data?.stripe_acct_id && !isPaystackAvailable && (
              <button
                onClick={handleCreateStripeConnect}
                className="wallet-sidebar-list-btn bottom-radius"
              >
                <img
                  loading="lazy"
                  className="border-radius"
                  src={stripeImg}
                  alt="metamask"
                />
                <span style={{ fontWeight: "bold" }}>Stripe</span>
              </button>
            )}
            <p className="info-box">
              In order to receive bank payments, register for a stripe account;
              make sure your network connection is stable and finish the setup
              process, also considering that this is a one-time procedure, be
              sure all the information is accurate.
            </p>
          </li>

          {!currentAccount && isPaystackAvailable && <div className="line" />}
          <li className="info-box-container">
            {isPaystackAvailable && (
              <button
                onClick={paystackModal}
                className="wallet-sidebar-list-btn bottom-radius"
                style={{ justifyContent: "space-between" }}
              >
                <div className="sidebar-div">
                  <img
                    loading="lazy"
                    className="border-radius"
                    src={paystackLogo}
                    alt="metamask"
                  />
                  <span style={{ fontWeight: "bold" }}>Paystack</span>
                </div>

                {paystackAccount?.status && (
                  <div className="sidebar-check">
                    <BsFillPatchCheckFill />
                  </div>
                )}
              </button>
            )}
            {paystackAccount?.status && (
              <p className="info-box">
                Your paystack has been created and verified to be eligible to
                receive funds.
              </p>
            )}
          </li>
        </ul>
      </div>

      <div className="options-btn" onClick={goToProfile}>
        <div style={{ flexGrow: "0.5" }}>
          <GiBuyCard
            style={{
              height: "2.2rem",
              width: "2.2rem",
              marginRight: "1rem",
              color: "#1DA1F2",
            }}
          />
        </div>
        <span className="options-text">View Transactions</span>
      </div>

      <TransactionModal open={isLoading}>
        <div className="modal-container">
          {isTransact && <p>transaction in progress...</p>}
          {!isTransact && <p>processing request...</p>}
          <MoonLoader
            css={cssOverride}
            size={50}
            color={"#000"}
            loading={true}
          />
        </div>
      </TransactionModal>

      <WithdrawModal open={openModal} onClose={() => setOpenModal(false)}>
        <WithdrawFund
          account={stripeAccount}
          userSlug={user?.slug}
          setOpenModal={setOpenModal}
          setIsLoading={setIsLoading}
        />
      </WithdrawModal>

      <WithdrawModal open={openDelModal} onClose={() => setOpenDelModal(false)}>
        <DeleteStripeAccount
          setOpenDelModal={setOpenDelModal}
          handleDeleteStripeConnect={handleDeleteStripeConnect}
        />
      </WithdrawModal>
      <Paystack
        firstName={user?.profile?.firstName}
        lastName={user?.profile?.lastName}
        userSlug={user?.slug}
      />
    </WalletSidebarContainer>
  );
};

export default WalletSidebar;
