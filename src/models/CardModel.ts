import { CardSuit } from "../types";

export class CardModel {
    public static getSuitSymbol(suit: CardSuit): string {
        const cardSymbol: Record<CardSuit, string> = {
            [CardSuit.Hearts]: "♥",
            [CardSuit.Diamonds]: "♦",
            [CardSuit.Clubs]: "♣",
            [CardSuit.Spades]: "♠"
        };

        return cardSymbol[suit];
    }

    public static suitColors: Record<CardSuit, number> = {
        [CardSuit.Hearts]: 0xff0000,
        [CardSuit.Diamonds]: 0xff0000,
        [CardSuit.Spades]: 0x000000,
        [CardSuit.Clubs]: 0x000000
    };
}
