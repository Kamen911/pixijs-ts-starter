import { Graphics, Container, Text, Matrix } from "pixi.js";
import { CardSuit } from "../types";
import { CardModel } from "../models";

export class Card {
    public readonly container: Container;
    private readonly value: string;
    private readonly suitSymbol: string;
    private readonly color: number;
    private readonly background: Graphics;

    private static readonly CORNER_FONT_SIZE = 25;
    private static readonly CENTER_FONT_SIZE = 52;

    constructor(value: string, suit: CardSuit) {
        this.value = value;
        this.container = new Container();
        this.suitSymbol = CardModel.getSuitSymbol(suit);
        this.color = suit === CardSuit.Hearts || suit === CardSuit.Diamonds ? 0xff0000 : 0x000000;
        this.background = new Graphics();
    }

    public render(): void {
        this.renderCardBackground();
        this.container.addChild(this.background);

        // Card corners
        this.container.addChild(this.createCornerText(5, 5)); // Top-left
        this.container.addChild(this.createCornerText(95, 185, Math.PI)); // Bottom-right

        // Card center symbol
        const centerSymbol = this.renderCardText(this.suitSymbol, Card.CENTER_FONT_SIZE);
        centerSymbol.anchor.set(0.5);
        centerSymbol.position.set(50, 90);
        this.container.addChild(centerSymbol);

        this.container.pivot.set(40, 60);
        this.renderPerspectiveEffect();
    }

    private renderCardText(value: string, fontSize: number, suit?: string): Text {
        return new Text(suit ? `${value}\n${suit}` : value, {
            fontFamily: "Roboto, sans-serif",
            fill: this.color,
            align: "center",
            fontSize,
            letterSpacing: -3
        });
    }

    private renderCardBackground(): void {
        this.background.clear();
        this.background.beginFill(0xffffff);
        this.background.lineStyle(2, 0x000000);
        this.background.drawRoundedRect(0, 0, 100, 190, 10);
        this.background.endFill();
    }

    private createCornerText(x: number, y: number, rotation = 0): Text {
        const text = this.renderCardText(this.value, Card.CORNER_FONT_SIZE, this.suitSymbol);
        text.position.set(x, y);
        text.rotation = rotation;

        return text;
    }

    private renderPerspectiveEffect(): void {
        this.container.transform.setFromMatrix(new Matrix(1, 0, 0, 0.7, 0, 1));
    }
}
