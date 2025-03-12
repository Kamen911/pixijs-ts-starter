import { Application, Container, ObservablePoint, Texture, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { Card, Button, Deck } from "./";
import { CardSuit } from "../types";
import { getRandom } from "../utils";
import config from "../../config/game-config.json";
import blackjackTableImage from "../assets/images/black-jack-table.png";
import { initDevtools } from "@pixi/devtools";

export class Game {
    private static instance: Game | null = null;
    private app!: Application<HTMLCanvasElement>;
    private dealerCards: Card[] = [];
    private dealButton!: Button;
    private deck!: Deck;
    private dealerCardsContainer!: Container;
    private playerCardsContainer!: Container;
    private isAnimating = false;
    private gameConfig = config;

    private static readonly CANVAS_WIDTH = 1110;
    private static readonly CANVAS_HEIGHT = 599;
    private static readonly BACKGROUND_COLOR = 0x333333;
    private static readonly DECK_X = 960;
    private static readonly DECK_Y = 20;

    constructor() {
        if (Game.instance) return Game.instance;
        Game.instance = this;

        const existingCanvas = document.querySelector("canvas");
        if (existingCanvas) existingCanvas.remove();

        const canvasElement = document.querySelector("#game-canvas") as HTMLCanvasElement;

        this.app = new Application({
            view: canvasElement,
            width: Game.CANVAS_WIDTH,
            height: Game.CANVAS_HEIGHT,
            background: Game.BACKGROUND_COLOR,
            antialias: true
        });
        initDevtools({ app: this.app });

        const containerElement = document.querySelector(".container") as HTMLDivElement;
        containerElement.appendChild(this.app.view);
    }

    public render(): void {
        this.app.stage.removeChildren();
        this.renderBackground();

        this.dealerCardsContainer = new Container();
        this.playerCardsContainer = new Container();

        this.dealerCardsContainer.position.set(450, 150);
        this.playerCardsContainer.position.set(450, 400);

        this.app.stage.addChild(this.dealerCardsContainer);
        this.app.stage.addChild(this.playerCardsContainer);

        this.deck = new Deck(Game.DECK_X, Game.DECK_Y);
        this.app.stage.addChild(this.deck.container);

        this.dealButton = new Button("Deal", 1010, 550, () => this.dealCardToDealer(), false);
        this.dealButton.render();
        this.app.stage.addChild(this.dealButton.container);
    }

    private dealCardToDealer(): void {
        if (this.isAnimating) return;

        const card = this.createCard();

        if (this.isDeckFull()) this.dealButton.setDisabled(true);

        this.animateDeckDeal();
        this.animateDeal(card);
    }

    private animateDeckDeal(): void {
        this.isAnimating = true;
        this.dealButton.setDisabled(true);

        gsap.timeline().to(this.deck.container, {
            x: this.deck.container.x - 5,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    private createCard(): Card {
        const card = new Card(this.getRandomCardValue(), this.getRandomSuit());
        card.render();
        this.dealerCards.push(card);
        this.dealerCardsContainer.addChild(card.container); // Cards go to dealer
        // this.playerCardsContainer.addChild(card.container); // Cards go to dealer

        const deckGlobalPosition = this.deck.container.getGlobalPosition();
        const deckLocalPosition = this.dealerCardsContainer.toLocal(deckGlobalPosition);

        card.container.position.set(deckLocalPosition.x, deckLocalPosition.y);

        return card;
    }

    private cardAnimation(card: Card): void {
        const index = this.dealerCards.length - 1;
        const cardsPerRow = 7;
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;

        const cardSpacingX = 30;
        const cardSpacingY = 40;
        const upwardOffset = col * 5;
        const rowRightOffset = row * 10;

        const finalX = col * cardSpacingX + rowRightOffset;
        const finalY = row * cardSpacingY - upwardOffset;

        gsap.timeline().to(card.container.position, {
            x: finalX,
            y: finalY,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                this.isAnimating = false;
                this.dealButton.setDisabled(this.isDeckFull());
            }
        });
    }

    private animateDeal(card: Card): void {
        this.buttonAnimation(this.dealButton.container.scale);
        this.cardAnimation(card);
    }

    private getRandomCardValue(): string {
        return getRandom(this.gameConfig.cardLabels);
    }

    private getRandomSuit(): CardSuit {
        return getRandom(Object.values(CardSuit));
    }

    private buttonAnimation(target: ObservablePoint): void {
        gsap.timeline().to(target, {
            x: 0.9,
            y: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
    }

    private isDeckFull(): boolean {
        return this.dealerCards.length >= this.gameConfig.maxCardsInHand;
    }

    private renderBackground(): void {
        const texture = Texture.from(blackjackTableImage);
        const background = new Sprite(texture);

        background.width = Game.CANVAS_WIDTH;
        background.height = Game.CANVAS_HEIGHT;

        this.app.stage.addChildAt(background, 0);
    }
}
