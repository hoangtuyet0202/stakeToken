import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";

import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);
const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";
const Welcome = () => {
    const {
        connectWallet,
        currentAccount,
        balance,
        handleChangeAmount,
        claimToken,
        amount,
        staked_balance,
        reward,
        stake_token,
        stake_amount,
        unstake_amount,
        unstake_token,
        withdrawReward,
        handleChangeStakeAmount,
        handleChangeUnstakeAmount
    } = useContext(TransactionContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) {
            return;
        }
        claimToken();
    };
    const handleSubmitWithdraw = (e) => {
        e.preventDefault();
        withdrawReward();
    };
    const handleSubmitStake = (e) => {
        e.preventDefault();
        if (!stake_amount) {
            return;
        }
        stake_token();
    };
    const handleSubmitUnstake = (e) => {
        e.preventDefault();
        if (!unstake_amount) {
            return;
        }
        unstake_token();
    };
    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <p className="text-white font-semibold text-lg mt-1">
                        Pending Reward: {reward}
                    </p>
                    <button
                        type="button"
                        onClick={handleSubmitWithdraw}
                        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                    >
                        <p className="text-white text-base font-semibold">Claim Reward</p>
                    </button>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Stake Token
                    </p>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <p className="text-white font-semibold text-lg mt-1">
                            Balance: {balance}
                        </p>
                        <Input
                            value={stake_amount}
                            placeholder="Amount (MTK)"
                            name="amount"
                            type="number"
                            handleChange={handleChangeStakeAmount}
                        />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        <button
                            type="button"
                            onClick={handleSubmitStake}
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        >
                            Stake
                        </button>
                    </div>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Unstake Token
                    </p>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <p className="text-white font-semibold text-lg mt-1">
                            Staked Balance: {staked_balance}
                        </p>
                        <Input
                            value={unstake_amount}
                            placeholder="Amount (MTK)"
                            name="amount"
                            type="number"
                            handleChange={handleChangeUnstakeAmount}
                        />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        <button
                            type="button"
                            onClick={handleSubmitUnstake}
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        >
                            Unstake
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Faucet
                    </p>
                    {!currentAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                        >
                            <AiFillPlayCircle className="text-white mr-2" />
                            <p className="text-white text-base font-semibold">
                                Connect Wallet
                            </p>
                        </button>
                    )}
                    <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                    <SiEthereum fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" />
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {shortenAddress(currentAccount)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <Input
                            value={amount}
                            placeholder="Amount (MTK)"
                            name="amount"
                            type="number"
                            handleChange={handleChangeAmount}
                        />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        >
                            Claim Token
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
