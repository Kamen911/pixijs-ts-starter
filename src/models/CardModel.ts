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
}
