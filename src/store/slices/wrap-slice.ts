import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { messages } from "../../constants/messages";
import { getAddresses, Networks } from "../../constants";
import { setAll, sleep } from "../../helpers";
import { info, success, warning } from "./messages-slice";
import { RootState } from "../store";
import { ethers } from "ethers";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { wsKANDYTokenContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getWrapingTypeText } from "./pending-txns-slice";
import { getGasPrice } from "../../helpers/get-gas-price";
import { fetchAccountSuccess, getBalances } from "./account-slice";

export interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeApproval = createAsyncThunk("wraping/changeApproval", async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const sKANDYContract = new ethers.Contract(addresses.sKANDY_ADDRESS, wsKANDYTokenContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        approveTx = await sKANDYContract.approve(addresses.wsKANDY_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

        const text = "Approve Wraping";
        const pendingTxnType = "approve_wraping";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const wsKANDYAllowance = await sKANDYContract.allowance(address, addresses.wsKANDY_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            wraping: {
                wsKANDY: Number(wsKANDYAllowance),
            },
        }),
    );
});

export interface IChangeWrap {
    isWrap: boolean;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
    address: string;
}

export const changeWrap = createAsyncThunk("wraping/changeWrap", async ({ isWrap, value, provider, networkID, address }: IChangeWrap, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);
    const wsKANDYContract = new ethers.Contract(addresses.wsKANDY_ADDRESS, wsKANDYTokenContract, signer);

    let wrapTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (isWrap) {
            wrapTx = await wsKANDYContract.wrap(amountInWei, { gasPrice });
        } else {
            wrapTx = await wsKANDYContract.unwrap(amountInWei, { gasPrice });
        }

        const pendingTxnType = isWrap ? "wraping" : "unwraping";
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrapingTypeText(isWrap), type: pendingTxnType }));
        await wrapTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (wrapTx) {
            dispatch(clearPendingTxn(wrapTx.hash));
        }
    }

    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});

export interface IWrapDetails {
    isWrap: boolean;
    value: string | null;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export const calcWrapDetails = createAsyncThunk("wraping/calcWrapDetails", async ({ isWrap, value, provider, networkID }: IWrapDetails, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    if (!value) {
        return new Promise<any>(resolve =>
            resolve({
                wrapValue: "",
            }),
        );
    }

    const addresses = getAddresses(networkID);

    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);

    let wrapValue = 0;

    const wsKANDYContract = new ethers.Contract(addresses.wsKANDY_ADDRESS, wsKANDYTokenContract, provider);

    if (isWrap) {
        const wsKANDYValue = await wsKANDYContract.sKANDYTowsKANDY(amountInWei);
        wrapValue = wsKANDYValue / Math.pow(10, 18);
    } else {
        const sKANDYValue = await wsKANDYContract.wsKANDYTosKANDY(amountInWei);
        wrapValue = sKANDYValue / Math.pow(10, 9);
    }

    return {
        wrapValue,
    };
});

export interface IWrapSlice {
    loading: boolean;
    wrapValue: "";
}

const initialState: IWrapSlice = {
    loading: true,
    wrapValue: "",
};

const wrapSlice = createSlice({
    name: "wraping",
    initialState,
    reducers: {
        fetchWrapSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(calcWrapDetails.pending, state => {
                state.loading = true;
            })
            .addCase(calcWrapDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(calcWrapDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default wrapSlice.reducer;

export const { fetchWrapSuccess } = wrapSlice.actions;

const baseInfo = (state: RootState) => state.wraping;

export const getWrapingState = createSelector(baseInfo, wraping => wraping);
