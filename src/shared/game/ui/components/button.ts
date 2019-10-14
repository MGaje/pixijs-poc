import * as PIXI from 'pixi.js';

export type ButtonSettings = {
    text?: string,
    textColor?: number, backgroundColor?: number,
    textHoverColor?: number, backgroundHoverColor?: number,
    width?: number, height?: number,
    x?: number, y?: number
};

export class Button extends PIXI.Sprite {
    private _settings: ButtonSettings;
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;

    constructor(settings: ButtonSettings) {
        super();

        this.interactive = true;
        this.buttonMode = true;
        this._settings = settings;
        this._graphics = new PIXI.Graphics();

        this._init();
        this._handleEvents();

        this.position.set(this._settings.x, this._settings.y);
    }

    public setText(text: string) {
        this._text.text = text;
    }

    private _init() {
        if (!this._graphics) {
            console.error("Could not setup button. Graphics context was not created");
            return;
        }

        this._drawBackground();
        this._drawText();
    }

    private _drawBackground() {
        this._drawRectangle(this._settings.backgroundColor);

        this.addChild(this._graphics);
    }

    private _drawRectangle(color: number) {
        this._graphics.clear();
        this._graphics.beginFill(color);
        this._graphics.drawRect(0, 0, this._settings.width, this._settings.height);
        this._graphics.endFill();
    }

    private _drawText() {
        if (!this._settings.text) {
            return;
        }

        this._text = new PIXI.Text(this._settings.text, { color: this._settings.textColor });
        this._text.anchor.set(0.5, 0.5);
        this._text.x = (this._settings.width) / 2;
        this._text.y = (this._settings.height) / 2;

        this._graphics.addChild(this._text);
    }

    private _handleEvents() {
        this.on('mousedown', () => {
            this._text.text = 'mouse down!';
        });

        this.on('mouseover', () => {
            this._drawRectangle(0x0000ff);
        });

        this.on('mouseout', () => {
            this._drawRectangle(this._settings.backgroundColor);
        });
    }
}