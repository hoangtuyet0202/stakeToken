import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleChange = (e) => {
    console.log('parseInt(e.target.value)', parseInt(e.target.value))
    setAmount(parseInt(e.target.value));
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  const getBalance = async () => {
    try {
      if (ethereum) {
        console.log("test");
        const transactionsContract = createEthereumContract();

        const result = await transactionsContract.balanceOf(currentAccount);
        console.log(result);
        setBalance(result.toNumber());
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const claimToken = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        await transactionsContract.mint(amount);
        const result = await transactionsContract.balanceOf(currentAccount);
        setBalance(result.toNumber());
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const logout = () => {
    setCurrentAccount("")
  }
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        balance,
        handleChange,
        claimToken, 
        amount,
        logout
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
