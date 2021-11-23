import KandyImg from "../assets/tokens/KANDY.png";
import MemoImg from "../assets/tokens/MEMO.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "kandy") {
        return toUrl(KandyImg);
    }

    if (name === "memo") {
        return toUrl(MemoImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
