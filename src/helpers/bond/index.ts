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
            bondAddress: "0xC46BA2CB3523A441d085E9F6bE3D753E90045D80",
            reserveAddress: "0x7929959Aaa69F313856b2327a2cFAAB5728D8AF3",
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
            bondAddress: "0xdB4d4828BE38822F2a7cF8e0f18c585Eca09bAE8",
            reserveAddress: "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
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
            bondAddress: "0x6Fb8B86817f943DB5e11Cd5F74f4c4DD3C30cF2f",
            reserveAddress: "0xD58AFc1c62C99BE0D79ec9D587b62cA49d5Dd68e",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x7929959Aaa69F313856b2327a2cFAAB5728D8AF3/0x4010DdbfA72724f5c697908296a75301a0e8710e",
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
            bondAddress: "0xC1C2c3B8163F087287D9d0095c5a82473D9b4083",
            reserveAddress: "0xf0b7eAb44fab7e4afB7110d8475B7725EfF57F48",
        },
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0x4010DdbfA72724f5c697908296a75301a0e8710e",
});

export default [mim, wavax, mimKandy, avaxKandy];

