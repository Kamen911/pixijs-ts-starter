import { Application } from "pixi.js";
import { Button } from "./Button";

export class Game {
    protected game: Application;
    private dealButton!: Button;

    start(): void {
        this.game = new Application({
            view: document.querySelector("#game-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            backgroundAlpha: 1,
            backgroundColor: 0x143469,
            antialias: true,
            width: 1110,
            height: 599
        });

        this.dealButton = new Button("Deal", 970, 520, () => {});
        this.game.stage.addChild(this.dealButton.container);
    }
}

new Game().start();
