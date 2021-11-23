import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { mimKandy } from "../helpers/bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const mimKandyAddress = mimKandy.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(mimKandyAddress, LpReserveContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
