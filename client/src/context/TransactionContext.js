import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI, ownerAddress } from "../lib/constants";
import axios from "axios";
import { toast } from "react-toastify";

export const TransactionContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

// interaction with smart contract
const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [walletBalance, setWalletBalance] = useState();
  const [ethAddress, setEthAddress] = useState("");
  const [ethEquivalent, setEthEquivalent] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const networkChanged = async (chainId) => {
    window.location.reload(false);
  };

  const accountChanged = async (accounts) => {
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      const wallet = await getWalletBalance();
      setWalletBalance(wallet);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    (async () => {
      const wallet = await getWalletBalance();
      setWalletBalance(wallet);
    })();
    window.ethereum?.on("chainChanged", networkChanged);
    window.ethereum?.on("accountsChanged", accountChanged);
  }, []);

  const metamaskConnect = async (metamask = eth) => {
    const metamaskProvider = window.ethereum?.providers?.find(
      (provider) => provider.isMetaMask
    );

    let provider;

    if (metamaskProvider) {
      provider = metamaskProvider;
    } else {
      provider = metamask;
    }

    try {
      // const accounts = await metamaskProvider.request({
      //   method: "wallet_requestPermissions",
      //   params: [{ eth_accounts: {} }],
      // });
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      let acctBalance = ethers.utils.formatEther(balance);

      setCurrentAccount(accounts[0]);
      setWalletBalance(acctBalance);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log("Permissions needed to continue.");
      } else {
        console.error(error);
      }
    }
  };

  const coinbaseConnect = async (coinbase = eth) => {
    const coinbaseProvider = window.ethereum?.providers?.find(
      (provider) => provider.isCoinbaseWallet
    );

    let provider;

    if (coinbaseProvider) {
      provider = coinbaseProvider;
    } else {
      provider = coinbase;
    }

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      let acctBalance = ethers.utils.formatEther(balance);

      setCurrentAccount(accounts[0]);
      setWalletBalance(acctBalance);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      return error;
    }
  };

  const connectWallet = async () => {
    const metamaskProvider = window.ethereum?.providers?.find(
      (provider) => provider.isMetaMask
    );

    const coinbaseProvider = window.ethereum?.providers?.find(
      (provider) => provider.isCoinbaseWallet
    );

    let provider;

    if (metamaskProvider) {
      provider = metamaskProvider;
    } else if (coinbaseProvider) {
      provider = coinbaseProvider;
    } else {
      provider = eth;
    }

    try {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const balance = await provider.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });

      let acctBalance = ethers.utils.formatEther(balance);

      setCurrentAccount(accounts[0]);
      setWalletBalance(acctBalance);
      return acctBalance;
    } catch (error) {
      return error;
    }
  };

  const disconnectWallet = async () => {
    try {
      // const disconnect = await window.ethereum.close();
      setCurrentAccount();
      setWalletBalance();
    } catch (error) {
      return error;
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!eth) return;

      const metamaskProvider = window.ethereum?.providers?.find(
        (provider) => provider.isMetaMask
      );

      const coinbaseProvider = window.ethereum?.providers?.find(
        (provider) => provider.isCoinbaseWallet
      );

      let provider;

      if (metamaskProvider) {
        provider = metamaskProvider;
      } else if (coinbaseProvider) {
        provider = coinbaseProvider;
      } else {
        provider = eth;
      }

      const accounts = await provider.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      return error;
    }
  };

  const getWalletBalance = async () => {
    const metamaskProvider = window.ethereum?.providers?.find(
      (provider) => provider.isMetaMask
    );

    const coinbaseProvider = window.ethereum?.providers?.find(
      (provider) => provider.isCoinbaseWallet
    );

    let provider;

    if (metamaskProvider) {
      provider = metamaskProvider;
    } else if (coinbaseProvider) {
      provider = coinbaseProvider;
    } else {
      provider = eth;
    }

    try {
      const accounts = await provider.request({ method: "eth_accounts" });

      if (accounts.length) {
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        return ethers.utils.formatEther(balance);
      }
    } catch (error) {
      return error;
      // throw new Error("No ethereum object.");
    }
  };

  // sends eth to address thru smart contract
  const sendTransaction = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install an ethereum wallet");

      const transactionContract = await getEthereumContract();

      const etherAmount = ethers.utils.parseEther(
        ethEquivalent.toString(),
        "ether"
      );

      const transactionHash = await transactionContract.transact(
        ethAddress,
        ownerAddress,
        {
          gasLimit: "0x7EF40",
          value: etherAmount,
        }
      );

      setIsLoading(true);

      await transactionHash.wait();
      setTxHash(transactionHash?.hash);
      // setWalletBalance(walletBalance - ethEquivalent);

      setEthAddress("");
      setEthEquivalent("");
      setUsdEquivalent("");

      setIsLoading(false);

      toast.success("Transaction sent successfully", {
        position: "top-center",
        theme: "light",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return transactionHash;
    } catch (error) {
      if (error.message.includes("invalid address")) {
        setError("not a valid ethereum address");
      } else if (error.message.includes("User denied")) {
        setError(error.message);
      } else setError("something went wrong");
    }
  };

  const handleUsdChange = async (e) => {
    // convert usd to ether
    setUsdEquivalent(e.target.value);
    const etherUsd = await axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      .then((res) => res.data.ethereum.usd);

    const etherPrice = e.target.value / etherUsd;

    setEthEquivalent(parseFloat(etherPrice.toFixed(5)));
  };

  const handleEthChange = async (e) => {
    // convert ether to usd
    setEthEquivalent(e.target.value);
    const etherUsd = await axios
      .get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      )
      .then((res) => res.data.ethereum.usd);

    const usdPrice = e.target.value * etherUsd;

    setUsdEquivalent(parseFloat(usdPrice));
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        walletBalance,
        connectWallet,
        coinbaseConnect,
        metamaskConnect,
        disconnectWallet,
        sendTransaction,
        handleUsdChange,
        handleEthChange,
        isLoading,
        error,
        setError,
        txHash,
        ethAddress,
        setEthAddress,
        ethEquivalent,
        setEthEquivalent,
        usdEquivalent,
        setUsdEquivalent,
        toggleSidebar,
        setToggleSidebar,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
