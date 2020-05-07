import { eatKeywords } from "../const";

export const eat = () => {
    return eatKeywords[
        Math.floor(
            Math.random() * eatKeywords.length
        )
    ];
}