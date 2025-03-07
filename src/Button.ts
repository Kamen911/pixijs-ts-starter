import { Graphics, Container, Text, TextStyle } from "pixi.js";

export class Button {
    public container: Container;
    private background: Graphics;
    private text: Text;
    private style: TextStyle;
    private callback: () => void;

    constructor(label: string, x: number, y: number, callback: () => void) {
        this.callback = callback;
        this.container = new Container();
        this.container.position.set(x, y);

        this.background = this.createButtonBackground();

        this.text = new Text(label, this.renderGenericTextStyle());

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

    private renderGenericTextStyle(): TextStyle {
        return new TextStyle({
            fontFamily: "Roboto,sans-serif",
            fontSize: 20,
            fontStyle: "italic",
            fill: 0xffffff,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 440
        });
    }
    private createButtonBackground(): Graphics {
        return new Graphics().beginFill(0xef4765).lineStyle(2, 0xff9a5a).drawRoundedRect(-75, -25, 150, 50, 10).endFill();
    }
}
