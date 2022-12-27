import { useSelector } from "react-redux";
import useSwr from "swr";
import { API_URL } from "../../constants/api";
import axios from "axios";
import {
  UserTransactionsContainer,
  UserTransaction,
  UserTransactionsLayout,
  UserTransactionsDetails,
  ReUsedImageContainer,
  ReusedBigText,
  ReUsableSmallText,
} from "./styles";
import no_transactions from "../../assets/no_transactions.svg";

const UserTransactions = () => {
  const user = useSelector((state) => state.user.profile);

  // getting balances and payouts
  const { data: transactions } = useSwr(
    `${API_URL}/transactions/${user?.slug}`
  );
  const { data: balance } = useSwr(
    `${API_URL}/stripe-connect/account/balance/${user?.slug}`
  );
  const { data: payout } = useSwr(
    `${API_URL}/stripe-connect/account/payouts/${user?.slug}`
  );

  const { data: balanceToUsd } = useSwr(
    `https://api.exchangerate.host/convert?from=${
      balance?.pending[0]?.currency
    }&to=USD&amount=${balance?.pending[0]?.amount / 100}`
  );

  const { data: payoutToUsd } = useSwr(
    `https://api.exchangerate.host/convert?from=${
      balance?.pending[0]?.currency
    }&to=USD&amount=${payout?.payoutsAmount / 100}`
  );

  let contractBalance = 0;

  transactions?.map((transaction) => {
    if (transaction?.paymentProvider === "smart contract") {
      contractBalance += transaction?.amount;
    }
    return contractBalance;
  });

  const userBalance = Math.ceil(balanceToUsd?.result) || 0;
  const userPayout = Math.ceil(payoutToUsd?.result) || 0;
  let payoutDate;
  if (payout?.date) {
    payoutDate = new Date(payout?.date * 1000).toDateString();
  } else {
    payoutDate = "no payout yet";
  }

  const receivedFunds = userBalance + userPayout + contractBalance || 0;

  return (
    <UserTransactionsContainer>
      <UserTransaction>
        <UserTransactionsLayout>
          <div className="user-transactions-payouts">
            <div className="total vertical-border">
              <div className="total-flex">
                <p className="total-header-text">total earning</p>
              </div>
              <div className="total-flex total-pad">
                <p className="total-amount">
                  {`${receivedFunds} usd`.toLocaleUpperCase()}
                </p>
                <p className="total-status success">earning</p>
              </div>
              <p className="view-transaction">view transaction</p>
            </div>

            <div className="total">
              <div className="total-flex">
                <p className="total-header-text">total withdrawn</p>
                <p className="total-date">
                  {new Date(payoutDate * 1000).toDateString()}
                </p>
              </div>
              <div className="total-flex total-pad">
                <p className="total-amount">
                  {`${userPayout} usd`.toLocaleUpperCase()}
                </p>
                <p className="total-status pending">payouts</p>
              </div>
              <p className="view-transaction">view transaction</p>
            </div>
          </div>

          <div className="user-transactions-balance hidden-block">
            <div className="total">
              <div className="total-flex-balance">
                <p className="total-header-text">total earning</p>
              </div>
              <div className="total-flex-balance ">
                <p className="total-amount">
                  {`${receivedFunds} usd`.toLocaleUpperCase()}
                </p>
                <p className="total-status success">earning</p>
              </div>
              <p className="view-transaction">view transaction</p>
            </div>
          </div>

          <div className="user-transactions-balance hidden-block">
            <div className="total">
              <div className="total-flex-balance">
                <p className="total-header-text">total withdrawn</p>
                <p className="total-date">{payoutDate}</p>
              </div>
              <div className="total-flex-balance">
                <p className="total-amount">
                  {`${userPayout} usd`.toLocaleUpperCase()}
                </p>
                <p className="total-status pending">payouts</p>
              </div>
              <p className="view-transaction">view transaction</p>
            </div>
          </div>

          <div className="user-transactions-balance">
            <div className="total">
              <div className="total-flex-balance">
                <p className="total-header-text">stripe balance</p>
                <p className="total-date">{new Date().toDateString()}</p>
              </div>
              <p className="total-amount">
                {`${userBalance} usd`.toLocaleUpperCase()}
              </p>
            </div>
          </div>
        </UserTransactionsLayout>

        <UserTransactionsDetails>
          <div className="transaction-header">
            {transactions?.length > 0 && (
              <p className="transaction-header-text">Transactions</p>
            )}
            {/* <BiSearch
              onClick={() => setOpenSearch((prev) => !prev)}
              className="transaction-search-icon"
            /> */}
          </div>
          {/* <div className="transaction-filter">
            <p className="transaction-filter-text">filter transactions</p>
            <input
              className="transaction-filter-input"
              placeholder="search..."
            />
          </div> */}
          {/* {openSearch && (
            <input
              className="transaction-filter-input-1"
              placeholder="search..."
            />
          )} */}

          {transactions?.map((transaction) => {
            return (
              <>
                {transaction?.status === "paid" && (
                  <div className="transactions-list">
                    <div className="flex">
                      <ReUsedImageContainer className="margined">
                        <img
                          loading="lazy"
                          src={
                            transaction?.senderAvatar
                              ? transaction?.senderAvatar
                              : "/img/profile.png"
                          }
                          alt="sender"
                          className="image"
                        />
                      </ReUsedImageContainer>
                      <div>
                        <ReusedBigText>
                          {transaction.senderName === "undefined undefined"
                            ? "Anonymous"
                            : transaction?.senderName}
                        </ReusedBigText>
                        <ReUsableSmallText>
                          {`${transaction?.createdAt?.slice(0, 10)}`} at{" "}
                          {`${transaction?.createdAt?.slice(11, 16)}`}
                        </ReUsableSmallText>
                      </div>
                    </div>
                    <ReUsableSmallText>
                      via {transaction?.paymentProvider}
                    </ReUsableSmallText>
                    <div>
                      <ReusedBigText className="received-text">
                        {`+$${transaction?.amount}`}
                      </ReusedBigText>
                      {transaction?.txHash ? (
                        <ReUsableSmallText className="status-text">
                          <a
                            href={`https://rinkeby.etherscan.io/tx/${transaction?.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            view txn
                          </a>
                        </ReUsableSmallText>
                      ) : (
                        <ReUsableSmallText className="status-text">
                          success
                        </ReUsableSmallText>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })}

          {transactions?.length === 0 && (
            <div className="no-transaction-container">
              <img
                loading="lazy"
                src={no_transactions}
                alt="no transaction"
                className="no-transaction-img"
              />
              <p className="transaction-header-text align-text">
                you have not received any reward yet
              </p>
            </div>
          )}
        </UserTransactionsDetails>
      </UserTransaction>
    </UserTransactionsContainer>
  );
};

export default UserTransactions;
