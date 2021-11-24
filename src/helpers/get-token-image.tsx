import KandyImg from "../assets/tokens/KANDY.png";
import sKANDYImg from "../assets/tokens/sKandy.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "kandy") {
        return toUrl(KandyImg);
    }

    if (name === "sKANDY") {
        return toUrl(sKANDYImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
