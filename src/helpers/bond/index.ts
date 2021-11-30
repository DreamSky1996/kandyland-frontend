import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import MimTimeIcon from "../../assets/tokens/KANDY-MIM.png";
import AvaxTimeIcon from "../../assets/tokens/KANDY-AVAX.png";

import { StableBondContract, LpBondContract, WavaxBondContract, StableReserveContract, LpReserveContract } from "../../abi";

export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0x07df32EF3159c784a12E58dAf9d32eB236a30D6f",
            reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
        },
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "wAVAX",
    bondToken: "AVAX",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract,
    reserveContractAbi: StableReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0xfcbd66A7D4674Bba16764Ea413e7f070A8Aa1e2f",
            reserveAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        },
    },
    tokensInStrategy: "756916000000000000000000",
});

export const mimKandy = new LPBond({
    name: "mim_time_lp",
    displayName: "KANDY-MIM LP",
    bondToken: "MIM",
    bondIconSvg: MimTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0xd0023548349FeD39e1CAB232D02766E40067ADE0",
            reserveAddress: "0xf12B055625200a6e30c35424b9F02A76BCF9d106",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0x3e02f97774da99fB897FB08bF16E63A1706C41Bd",
});

export const avaxKandy = new CustomLPBond({
    name: "avax_time_lp",
    displayName: "KANDY-AVAX LP",
    bondToken: "AVAX",
    bondIconSvg: AvaxTimeIcon,
    bondContractABI: LpBondContract,
    reserveContractAbi: LpReserveContract,
    networkAddrs: {
        [Networks.AVAX]: {
            bondAddress: "0x46207878E76D903f830980A42Ec16716ae655369",
            reserveAddress: "0xD20d23772324737A6FD376002DC8E0842bA4551a",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0x3e02f97774da99fB897FB08bF16E63A1706C41Bd",
});

export default [mim, wavax, mimKandy, avaxKandy];

