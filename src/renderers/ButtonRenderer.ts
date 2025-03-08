import { Graphics, Container, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

export class ButtonRenderer {
    public container: Container;
    private background: Graphics;
    private text: Text;
    private callback: () => void;
    private disabled: boolean;

    constructor(label: string, x: number, y: number, callback: () => void, disabled = false) {
        this.callback = callback;
        this.disabled = disabled;
        this.container = new Container();
        this.container.position.set(x, y);

        this.background = new Graphics();
        this.text = this.renderButtonText(label);
    }

    public render(): void {
        this.renderButtonBackground();
        this.container.addChild(this.background, this.text);
        this.updateInteractivity();
    }

    public setDisabled(disabled: boolean): void {
        if (this.disabled === disabled) return;

        gsap.to(this.background, {
            duration: 0.1,
            onUpdate: () => this.renderButtonBackground(),
            ease: "power1.out",
            onComplete: () => {
                this.disabled = disabled;
                this.renderButtonBackground();
                this.updateInteractivity();
            }
        });

        gsap.to(this.text.style, {
            fill: disabled ? "#555555" : "#ffffff",
            duration: 0.1,
            ease: "power1.out"
        });
    }

    private renderButtonText(label: string): Text {
        const textStyle = new TextStyle({
            fontFamily: "Roboto,sans-serif",
            fontSize: 20,
            fill: this.disabled ? 0x555555 : 0xffffff,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 440
        });

        const text = new Text(label, textStyle);
        text.anchor.set(0.5, 0.5);

        return text;
    }

    private renderButtonBackground(): void {
        this.background.clear();
        this.background.beginFill(this.disabled ? 0x888888 : 0xef4765);
        this.background.drawRoundedRect(-75, -25, 150, 50, 10);
        this.background.endFill();
    }

    private updateInteractivity(): void {
        this.container.interactive = !this.disabled;
        this.container.cursor = this.disabled ? "not-allowed" : "pointer";

        if (!this.disabled) {
            this.container.on("pointerdown", this.onButtonDown.bind(this));
            this.container.on("pointerover", this.onButtonOver.bind(this));
            this.container.on("pointerout", this.onButtonOut.bind(this));
        } else {
            this.container.off("pointerdown");
            this.container.off("pointerover");
            this.container.off("pointerout");
        }
    }

    private onButtonOver(): void {
        if (this.disabled) return;

        gsap.to(this.background, {
            duration: 0.2,
            scaleX: 1.1,
            scaleY: 1.1,
            ease: "power1.out"
        });

        gsap.to(this.background, {
            duration: 0.2,
            alpha: 0.85,
            ease: "power1.out"
        });
    }

    private onButtonOut(): void {
        if (this.disabled) return;

        gsap.to(this.background, {
            duration: 0.2,
            scaleX: 1,
            scaleY: 1,
            ease: "power1.out"
        });

        gsap.to(this.background, {
            duration: 0.2,
            alpha: 1,
            ease: "power1.out"
        });
    }

    private onButtonDown(): void {
        if (this.disabled) return;
        this.callback();
    }
}
