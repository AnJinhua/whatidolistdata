import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import useSwr from "swr";
import { BottomSheetPage } from "../styles";
import { RiCloseCircleLine } from "react-icons/ri";
import { TransactionContext } from "../../../context/TransactionContext";
import { API_URL } from "../../../constants/api";

const BottomSheetDesign = ({ item, currentAccount, walletBalance }) => {
  const [isConnected, setIsConnected] = useState(true);

  const user = useSelector((state) => state.user.profile);

  const { disconnectWallet } = useContext(TransactionContext);
  const transactionsUrl = `${API_URL}/transactions/${user?.slug}`;
  const { data: transactions } = useSwr(transactionsUrl);

  const username = `${currentAccount?.slice(0, 4)}...${currentAccount?.slice(
    -4
  )}`;

  let contractBalance = 0;

  transactions?.map((transaction) => {
    if (transaction?.paymentProvider === "smart contract") {
      contractBalance += transaction?.amount;
    }
    return contractBalance;
  });

  return (
    <BottomSheetPage>
      <div className="bottom-sheet-header">
        <div>{currentAccount && username}</div>
        <RiCloseCircleLine size={25} cursor="pointer" />
      </div>
      {isConnected && (
        <div className="margin">
          <div className="bottom-sheet-header margin-y">
            <div className="span-container">
              <span className="wallet-balance">{`${walletBalance?.slice(
                0,
                4
              )} ETH`}</span>
              <span className="wallet-balance-text">Wallet Bal</span>
            </div>

            <div className="span-container">
              <span className="wallet-balance">{`$${contractBalance}`}</span>
              <span className="wallet-balance-text">TX Bal</span>
            </div>
          </div>
          <div>
            <button
              className="connect-btn"
              style={{ backgroundColor: "#cc0000" }}
              onClick={() => disconnectWallet()}
            >
              disconnect
            </button>
          </div>
        </div>
      )}
    </BottomSheetPage>
  );
};

export default BottomSheetDesign;
