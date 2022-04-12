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
  const [staked_balance, setStaked_balance] = useState(0);
  const [reward, setReward] = useState(0);
  const [amount, setAmount] = useState("");
  const [stake_amount, setStake_amount] = useState("");
  const [unstake_amount, setUnstake_amount] = useState("");

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };
  const handleChangeStakeAmount = (e) => {
    setStake_amount(e.target.value);
  };
  const handleChangeUnstakeAmount = (e) => {
    setUnstake_amount(e.target.value);
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
  const getData = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const resultStaked = await transactionsContract.stakeOf(currentAccount);
        setStaked_balance(resultStaked.toNumber());
        const resultBalance = await transactionsContract.balanceOf(currentAccount);
        setBalance(resultBalance.toNumber());
        const resultReward = await transactionsContract.rewardOf(currentAccount);
        setReward(resultReward.toNumber());
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

        const transactionHash = await transactionsContract.mint(parseInt(amount));
        await transactionHash.wait();
        setIsLoading(!isLoading);
        setAmount("")
       
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
  const stake_token = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const transactionHash = await transactionsContract.createStake(parseInt(stake_amount));
        await transactionHash.wait();
        setIsLoading(!isLoading);
        setStake_amount("");
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const unstake_token = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const transactionHash = await transactionsContract.removeStake(parseInt(unstake_amount));
        await transactionHash.wait();
        setIsLoading(!isLoading);
        setUnstake_amount("");
      } else {
        console.log("Ethereum is not present");

      }
    } catch (error) {
      console.log(error);
    }
  }
  const withdrawReward = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const transactionHash = await transactionsContract.withdrawReward();
        await transactionHash.wait();
        setIsLoading(!isLoading);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);
  useEffect( () => {
    getData();
  }, [isLoading]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        balance,
        handleChangeAmount,
        claimToken, 
        amount,
        logout,
        isLoading,
        staked_balance,
        reward,
        stake_token,
        stake_amount,
        unstake_amount,
        unstake_token,
        withdrawReward,
        handleChangeStakeAmount,
        handleChangeUnstakeAmount,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
