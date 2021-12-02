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
            bondAddress: "0x538fB04dD6030c90f71F3e837789d6bc62EEaAbC",
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
            bondAddress: "",
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
            bondAddress: "0xdae05CA5d23e0FEa547020C2dC1D19Dc9FC35F54",
            reserveAddress: "0x62A6c10dD0fEae68CD245697a1Fa737b720F6446",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0x7CD0b5A1bFefe61188bCE9FF07e1F8d2C49a899a",
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
            bondAddress: "0x87bE1145c63Af5d2d7f90e0156D9B65f4b704a2B",
            reserveAddress: "0x1a74AF71aE5C4e34a3554261BBAbbc742a424cd2",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0x7CD0b5A1bFefe61188bCE9FF07e1F8d2C49a899a",
});

// export default [mim, wavax, mimKandy, avaxKandy];
export default [mim, mimKandy, avaxKandy];

