import { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import useSwr, { mutate } from "swr";
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/react";
import { BottomSheetPage, WithdrawModal, TransactionModal } from "../styles";
import { RiCloseCircleLine } from "react-icons/ri";
import { API_URL } from "../../../constants/api";
import {
  createConnectAcct,
  deleteConnectAcct,
} from "../../../actions/stripeConnect";
import WithdrawFund from "./WithdrawFund";
import DeleteStripeAccount from "./DeleteStripeAccount";
import { toast } from "react-toastify";

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

const BottomSheetDesign = ({ item }) => {
  // const [{ user }] = useCookies(["user"]);
  const [openModal, setOpenModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransact, setIsTransact] = useState(true);

  const user = useSelector((state) => state.user.profile);
  const [{ token }] = useCookies(["token"]);
  const connectUrl = `${API_URL}/stripe-connect/account/${user?.slug}`;
  const { data: account } = useSwr(connectUrl);

  const stripeBalance = account?.balance?.available[0]?.amount / 100 || "0.00";

  let userData = {
    first_name: user?.profile?.firstName,
    last_name: user?.profile?.lastName,
    email: user?.email,
    slug: user?.slug,
    location: window.location.pathname,
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
    setIsLoading(true);
    createStripeConnect(userData);
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

  return (
    <BottomSheetPage>
      <div className="bottom-sheet-header">
        {!account && <div>{item}</div>}
        {account && <div style={{ color: "green" }}>STRIPE ACCOUNT</div>}
        <RiCloseCircleLine
          style={{ height: "25px", width: "25px", cursor: "pointer" }}
        />
      </div>
      {!account?.data?.stripe_acct_id && (
        <div className="bottom-sheet-body">
          <p className="connect-text">
            {account?.type} to receive payments, register for a stripe account;
            make sure your network connection is stable and finish the setup
            process, also considering that this is a one-time procedure, be sure
            all the information is accurate.
          </p>
          <div className="connect-btn" onClick={handleCreateStripeConnect}>
            create account
          </div>
        </div>
      )}
      {account?.data?.stripe_acct_id && (
        <div>
          <div className="balance-container span-container">
            {account?.enabled && account?.balance?.available[0]?.amount > 0 && (
              <span className="balance-text">
                {`${stripeBalance} ${account?.currency}`.toLocaleUpperCase()}
              </span>
            )}

            {account?.enabled &&
              account?.balance?.available[0]?.amount <= 0 && (
                <span className="balance-text">
                  {`0.00 ${account?.currency}`.toLocaleUpperCase()}
                </span>
              )}

            {account?.enabled && account?.balance?.available[0]?.amount > 0 && (
              <span className="balance-info">{`will be deposited into your bank, and each withdrawal is limited to the minimum amount of 10 ${account?.currency.toLocaleUpperCase()}`}</span>
            )}

            {account?.enabled &&
              account?.balance?.available[0]?.amount === 0 && (
                <span className="balance-info">
                  there is no accessible fund for withdrawal; nevertheless, the
                  funds for each transaction will be available for withdrawal
                  within 7 days.
                </span>
              )}

            {!account?.enabled && (
              <span className="balance-info text-color">
                your stripe account is not activated for payment. you'll need to
                create a new account and finish the onboarding process to fully
                be eligible for donations.
              </span>
            )}
          </div>

          <div className="bottom-sheet-body margin-top">
            {/* {account?.enabled && (
              <p className="connect-text">account activated</p>
            )} */}

            {account?.enabled && account?.balance?.available[0]?.amount > 0 && (
              <button
                className="connect-btn"
                onClick={() => setOpenModal(true)}
              >
                withdraw funds
              </button>
            )}
            <button
              className="connect-btn"
              style={{ backgroundColor: "#cc0000" }}
              onClick={() => setOpenDelModal(true)}
            >
              disconnect account
            </button>
          </div>
          <WithdrawModal open={openModal} onClose={() => setOpenModal(false)}>
            <WithdrawFund
              account={account}
              userSlug={user?.slug}
              setOpenModal={setOpenModal}
              setIsLoading={setIsLoading}
            />
          </WithdrawModal>
          <WithdrawModal
            open={openDelModal}
            onClose={() => setOpenDelModal(false)}
          >
            <DeleteStripeAccount
              setOpenDelModal={setOpenDelModal}
              handleDeleteStripeConnect={handleDeleteStripeConnect}
            />
          </WithdrawModal>
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
        </div>
      )}
    </BottomSheetPage>
  );
};

export default BottomSheetDesign;
