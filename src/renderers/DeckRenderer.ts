import { Container, Sprite, Texture } from "pixi.js";
import cardBackImage from "../assets/images/card-back.png";

export class Deck {
    public container: Container;
    private static readonly STACK_SIZE = 10;
    private static readonly OFFSET_X = 5;
    private static readonly OFFSET_Y = 1.5;
    private static readonly BORDER_THICK = 4;

    constructor(x: number, y: number) {
        this.container = new Container();
        this.container.position.set(x, y);
        this.createDeck();
    }

    private createDeck(): void {
        const cardBackTexture = Texture.from(cardBackImage);

        for (let i = 0; i < Deck.STACK_SIZE; i++) {
            const cardSprite = new Sprite(cardBackTexture);
            cardSprite.width = 100;
            cardSprite.height = 140;
            cardSprite.position.set(i * -Deck.OFFSET_X, i * Deck.OFFSET_Y);

            const border = new Sprite(Texture.WHITE);
            border.width = cardSprite.width + Deck.BORDER_THICK;
            border.height = cardSprite.height + Deck.BORDER_THICK;
            border.tint = 0xdedede;
            border.position.set(cardSprite.position.x - 2, cardSprite.position.y - 2);

            this.container.addChild(border);
            this.container.addChild(cardSprite);
        }
    }
}
