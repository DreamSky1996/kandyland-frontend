import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { KandyTokenContract, sKANDYTokenContract, MimTokenContract, wsKANDYTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        sKANDY: string;
        kandy: string;
        wsKANDY: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const sKANDYContract = new ethers.Contract(addresses.sKANDY_ADDRESS, sKANDYTokenContract, provider);
    const sKANDYBalance = await sKANDYContract.balanceOf(address);
    const kandyContract = new ethers.Contract(addresses.KANDY_ADDRESS, KandyTokenContract, provider);
    const kandyBalance = await kandyContract.balanceOf(address);
    const wsKANDYContract = new ethers.Contract(addresses.wsKANDY_ADDRESS, wsKANDYTokenContract, provider);
    const wsKANDYBalance = await wsKANDYContract.balanceOf(address);

    return {
        balances: {
            sKANDY: ethers.utils.formatUnits(sKANDYBalance, "gwei"),
            kandy: ethers.utils.formatUnits(kandyBalance, "gwei"),
            wsKANDY: ethers.utils.formatEther(wsKANDYBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        kandy: string;
        sKANDY: string;
        wsKANDY: string;
    };
    staking: {
        kandy: number;
        sKANDY: number;
    };
    wraping: {
        sKANDY: number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let kandyBalance = 0;
    let sKANDYBalance = 0;

    let wsKANDYBalance = 0;
    let sKANDYwsKANDYAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    if (addresses.KANDY_ADDRESS) {
        const kandyContract = new ethers.Contract(addresses.KANDY_ADDRESS, KandyTokenContract, provider);
        kandyBalance = await kandyContract.balanceOf(address);
        stakeAllowance = await kandyContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.sKANDY_ADDRESS) {
        const sKANDYContract = new ethers.Contract(addresses.sKANDY_ADDRESS, sKANDYTokenContract, provider);
        sKANDYBalance = await sKANDYContract.balanceOf(address);
        unstakeAllowance = await sKANDYContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.wsKANDY_ADDRESS) {
            sKANDYwsKANDYAllowance = await sKANDYContract.allowance(address, addresses.wsKANDY_ADDRESS);
        }
    }

    if (addresses.wsKANDY_ADDRESS) {
        const wsKANDYContract = new ethers.Contract(addresses.wsKANDY_ADDRESS, wsKANDYTokenContract, provider);
        wsKANDYBalance = await wsKANDYContract.balanceOf(address);
    }

    return {
        balances: {
            sKANDY: ethers.utils.formatUnits(sKANDYBalance, "gwei"),
            kandy: ethers.utils.formatUnits(kandyBalance, "gwei"),
            wsKANDY: ethers.utils.formatEther(wsKANDYBalance),
        },
        staking: {
            kandy: Number(stakeAllowance),
            sKANDY: Number(unstakeAllowance),
        },
        wraping: {
            sKANDY: Number(sKANDYwsKANDYAllowance),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastKandy);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    const addresses = getAddresses(networkID);

    const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    let allowance,
        balance = "0";

    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        sKANDY: string;
        kandy: string;
        wsKANDY: string;
    };
    loading: boolean;
    staking: {
        kandy: number;
        sKANDY: number;
    };
    wraping: {
        sKANDY: number;
    };
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { sKANDY: "", kandy: "", wsKANDY: "" },
    staking: { kandy: 0, sKANDY: 0 },
    wraping: { sKANDY: 0 },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
