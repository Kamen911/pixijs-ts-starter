import { Application } from "pixi.js";

export class Game {
  protected game: Application;

  start(): void {
    this.game = new Application({
      view: document.querySelector("#game-canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      backgroundAlpha: 1,
      backgroundColor: 0x000000,
    });
  }
}

new Game().start();
