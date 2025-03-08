import { Application, Container, ObservablePoint, Text, Texture, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { Card, ButtonRenderer } from "./";
import { CardSuit } from "../types";
import { getRandom } from "../utils";
import config from "../../config/game-config.json";

export class Game {
    private static instance: Game | null = null;
    private app!: Application<HTMLCanvasElement>;
    private dealerCards: Card[] = [];
    // private playerCards: Card[] = [];
    private dealButton!: ButtonRenderer;
    private dealerCardsContainer!: Container;
    private playerCardsContainer!: Container;
    private isAnimating = false;
    private gameConfig = config;

    private static readonly CANVAS_WIDTH = 1110;
    private static readonly CANVAS_HEIGHT = 599;
    private static readonly BACKGROUND_COLOR = 0x143469;

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

        const containerElement = document.querySelector(".container") as HTMLDivElement;
        containerElement.appendChild(this.app.view);
    }

    public render(): void {
        this.app.stage.removeChildren();

        this.createGradientBackground();

        this.dealerCardsContainer = new Container();
        this.playerCardsContainer = new Container();

        this.dealerCardsContainer.position.set(400, 150);
        this.playerCardsContainer.position.set(400, 400);

        this.app.stage.addChild(this.dealerCardsContainer);
        this.app.stage.addChild(this.playerCardsContainer);

        this.createLabel("Dealer Cards", 400, 80);
        this.createLabel("Player Cards", 400, 330);

        this.dealButton = new ButtonRenderer("Deal", 970, 520, () => this.dealCardToDealer(), false);
        this.dealButton.render();
        this.app.stage.addChild(this.dealButton.container);
    }

    private createLabel(text: string, x: number, y: number): void {
        const label = new Text(text, {
            fontFamily: "Roboto,sans-serif",
            fontSize: 24,
            fill: 0xffffff,
            align: "center"
        });
        label.anchor.set(0.5);
        label.position.set(x, y);
        this.app.stage.addChild(label);
    }

    private dealCardToDealer(): void {
        if (this.isAnimating) return;

        const card = this.createCard();

        if (this.isDeckFull()) this.dealButton.setDisabled(true);

        this.startDealingAnimation();
        this.animateDeal(card);
    }

    private startDealingAnimation(): void {
        this.isAnimating = true;
        this.dealButton.setDisabled(true);
    }

    private createCard(): Card {
        const card = new Card(this.getRandomCardValue(), this.getRandomSuit());
        card.render();
        this.dealerCards.push(card);
        this.dealerCardsContainer.addChild(card.container); // Adding cards to Dealer
        // this.playerCardsContainer.addChild(card.container); // Adding cards to Player

        const startX = Game.CANVAS_WIDTH - 100; // Start top-right corner
        const startY = -100;

        card.container.position.set(startX, startY);

        return card;
    }

    private cardAnimation(card: Card): void {
        const index = this.dealerCards.length - 1;
        const cardsPerRow = 7;
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;

        const cardSpacingX = 30; // spacing between cards horizontally
        const cardSpacingY = 40; // spacing between cards vertically
        const upwardOffset = col * 5;
        const rowRightOffset = row * 10;

        const finalX = col * cardSpacingX + rowRightOffset; // Shift rows to the right progressively
        const finalY = row * cardSpacingY - upwardOffset; // Move each next card up slightly

        gsap.to(card.container.position, {
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
        gsap.to(target, {
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

    private createGradientBackground(): void {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = Game.CANVAS_WIDTH;
        canvas.height = Game.CANVAS_HEIGHT;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // gradient (top to bottom)
        gradient.addColorStop(0, "#0a2a43");
        gradient.addColorStop(1, "#143469");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const texture = Texture.from(canvas);
        const background = new Sprite(texture);
        this.app.stage.addChildAt(background, 0); // place gradient behind everything
    }
}
