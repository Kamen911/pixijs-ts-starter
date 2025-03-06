import { Graphics, Container, Text } from "pixi.js";

export class Button {
    public container: Container;
    private background: Graphics;
    private text: Text;
    private callback: () => void;

    constructor(label: string, x: number, y: number, callback: () => void) {
        this.callback = callback;
        this.container = new Container();
        this.container.position.set(x, y);

        // Button background
        this.background = new Graphics();
        this.background.beginFill(0xef4765);
        this.background.lineStyle(2, 0xff9a5a);
        this.background.drawRoundedRect(-75, -25, 150, 50, 10);
        this.background.endFill();

        // Button text
        this.text = new Text(label, {
            fontFamily: "Roboto,sans-serif",
            fontSize: 20,
            fill: 0xffffff,
            align: "center"
        });

        this.text.anchor.set(0.5, 0.5);

        this.container.addChild(this.background);
        this.container.addChild(this.text);

        this.container.interactive = true;
        this.container.cursor = "pointer";

        // Event listeners
        this.container.on("pointerdown", this.onButtonDown.bind(this));
    }

    private onButtonDown(): void {
        this.callback();
    }
}
