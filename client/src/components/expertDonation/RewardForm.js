import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { TransactionContext } from "../../context/TransactionContext";
import { TransactionModal, LinkContainer } from "./styles";
import Avatar from "@mui/material/Avatar";
import Logo from "../../assets/eth.png";
import dollar from "../../assets/dollar.png";
import ethLogo from "../../assets/ethCurrency.png";
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/react";
import { createTransaction } from "../../actions/transaction";
import { sendNotification } from "../../subscription";
import { sendMaillNotification } from "../../actions/messenger";
import { API_URL, CLIENT_ROOT_URL } from "../../constants/api";
import { ETH_DONATION, DONATION_CHANGE } from "../../constants/actions";
import useSWR, { mutate } from "swr";

const cssOverride = css`
  display: relative;
  margin: 0 auto;
  border-color: black;
`;

const RewardForm = ({ isPaystackAvailable }) => {
  const {
    handleUsdChange,
    handleEthChange,
    sendTransaction,
    error,
    setError,
    isLoading,
    ethEquivalent,
    usdEquivalent,
    ethAddress,
    setEthAddress,
    currentAccount,
  } = useContext(TransactionContext);
  const [{ token }] = useCookies(["token"]);
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const receiverSlug = decodeURI(window.location.pathname.split("/")[3]);

  const { data: expert } = useSWR(`${API_URL}/getExpertDetail/${receiverSlug}`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ethEquivalent || !usdEquivalent || !ethAddress)
      return setError("please fill out all fields");
    if (usdEquivalent < 5) return setError("you can only donate at least $5");
    if (!currentAccount) return setError("please connect to your wallet");
    // if (window?.ethereum?.networkVersion !== "4")
    //   return setError("please change your wallet to rinkeby network");

    setError("");

    try {
      const transact = await sendTransaction();

      if (transact?.hash) {
        window.open(`https://rinkeby.etherscan.io/tx/${transact?.hash}`);
      }

      // post transaction to server
      const data = {
        sender: user?._id,
        senderName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
        senderAvatar: user?.imageUrl?.cdnUrl,
        receiverSlug: receiverSlug,
        currency: "ETH",
        txHash: transact?.hash,
        type: "wallet",
        paymentProvider: "smart contract",
        paymentMethod: "ethereum wallet",
        status: "paid",
        amount: usdEquivalent,
      };

      const res = await createTransaction(data, token);

      // mutate(`${API_URL}/transactions/${receiverSlug}`, (transactions) => {
      //   return [...transactions, res?.data];
      // });

      // send notification to receiver
      if (receiverSlug !== user?.slug) {
        let pushNotificationData = {
          title: `${user?.profile?.firstName} ${user?.profile?.lastName} sent you a donation of $${usdEquivalent}`,
          description: `worth of ETH through a smart contract`,
          userSlug: receiverSlug,
          senderSlug: user?.slug,
          action: "view transaction",
          endUrl: `/transaction-history/${receiverSlug}`,
        };

        sendNotification(pushNotificationData);

        // send email to receiver
        const emailNotificationData = {
          recieverName: `${expert?.data?.profile?.firstName} ${expert?.data?.profile?.lastName}`,
          message: `${user?.profile?.firstName} ${user?.profile?.lastName} sent you a donation of $${usdEquivalent} via wallet. It will appear in your transaction history once completed.`,
          senderName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
          recieverEmail: expert?.data?.email,
          url: CLIENT_ROOT_URL + `/transaction-history/${receiverSlug}`,
          defaultUrl: CLIENT_ROOT_URL,
        };

        sendMaillNotification(emailNotificationData, "notifyUser");
      }

      dispatch({
        type: ETH_DONATION,
        payload: false,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const setStripeModal = () => {
    dispatch({
      type: DONATION_CHANGE,
      payload: true,
    });

    dispatch({
      type: ETH_DONATION,
      payload: false,
    });
  };

  return (
    <>
      {!isLoading && (
        <>
          <div className="content">
            <div className="avatar">
              <Avatar
                alt="Remy Sharp"
                src={Logo}
                sx={{ width: 56, height: 56, borderRadius: "50%" }}
              />
            </div>
            <div className="login-header2"> Donate with ethereum</div>

            <div className="input-container">
              <div className="form-input-container">
                <input
                  type="number"
                  min="5"
                  className="form-input"
                  placeholder="enter at least $5"
                  pattern="[0-9]*[.,]?[0-9]*$"
                  value={usdEquivalent}
                  onChange={(e) => handleUsdChange(e)}
                />
                <div className="currency-container">
                  <img
                    loading="lazy"
                    src={dollar}
                    alt="usd"
                    height={25}
                    width={25}
                  />
                  <span className="currency-title">USD</span>
                </div>
              </div>

              <div className="form-input-container">
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="enter amount in eth"
                  autoComplete="off"
                  value={ethEquivalent}
                  onChange={(e) => handleEthChange(e)}
                />
                <div className="currency-container">
                  <img
                    loading="lazy"
                    src={ethLogo}
                    alt="eth"
                    height={18}
                    width={18}
                  />
                  <span className="currency-title padding-left">ETH</span>
                </div>
              </div>
            </div>

            <div className="form-input-container">
              <input
                type="text"
                className="form-input"
                placeholder="enter a valid ethereum address(0x7e...)"
                onChange={(e) => setEthAddress(e.target.value)}
              />
            </div>
            <div onClick={(e) => handleSubmit(e)} className="confirm-btn">
              confirm payment
            </div>

            {error && <div className="error">{error}</div>}
            {!error && (
              <div style={{ textAlign: "center" }}>
                whatido utilizes 10% of this transaction to maintain this
                platform and to serve you better
              </div>
            )}
          </div>
          <TransactionModal>
            <div className="modal-container">
              <p>transaction in progress...</p>
              <MoonLoader
                // css={cssOverride}
                size={50}
                color={"#000"}
                loading={true}
              />
            </div>
          </TransactionModal>

          <LinkContainer onClick={setStripeModal}>
            <p>
              {isPaystackAvailable ? "pay with paystack" : "pay with stripe"}
            </p>
          </LinkContainer>
        </>
      )}

      {isLoading && (
        <div className="transaction-loader">
          <p>transaction in progress...</p>
          <MoonLoader
            css={cssOverride}
            size={50}
            color={"#fff"}
            loading={true}
          />
        </div>
      )}
    </>
  );
};

export default RewardForm;
