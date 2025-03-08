export enum CardSuit {
    Hearts = "Hearts",
    Diamonds = "Diamonds",
    Clubs = "Clubs",
    Spades = "Spades"
}

export type CardSymbol = Record<CardSuit, string>;
