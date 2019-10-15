import * as PIXI from 'pixi.js';
import { InputBase, InputHandler } from '../input-base';
import { IUIDrawable } from '../ui-drawable';

export type ButtonSettings = {
    text: string,
    textColor: number, backgroundColor: number,
    textHoverColor?: number, backgroundHoverColor?: number,
    width?: number, height?: number,
    x?: number, y?: number
};

export class Button extends InputBase implements IUIDrawable {
    private _settings: ButtonSettings;
    private _sprite: PIXI.Sprite;
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;

    constructor(settings: ButtonSettings) {
        super();

        this._sprite = new PIXI.Sprite();
        this._sprite.interactive = true;
        this._sprite.buttonMode = true;
        this._settings = settings;
        this._graphics = new PIXI.Graphics();

        this._init();
        this.handleEvents();

        this._sprite.position.set(this._settings.x, this._settings.y);
    }

    public setText(text: string) {
        this._text.text = text;
    }

    public getPixiSprite(): PIXI.Sprite {
        return this._sprite;
    }

    public onMouseDown(h: InputHandler) {
        super.onMouseDown(h);
    }

    protected handleEvents() {
        this._sprite.on('mousedown', () => {
            this._text.text = 'mouse down!';
        });

        this._sprite.on('mouseover', () => {
            if (this._settings.backgroundHoverColor) {
                this._drawRectangle(this._settings.backgroundHoverColor);
            }

            if (this._settings.textHoverColor) {
                this._drawText(this._settings.textHoverColor);
            }
        });

        this._sprite.on('mouseout', () => {
            if (this._settings.backgroundHoverColor) {
                this._drawRectangle(this._settings.backgroundColor);
            }

            if (this._settings.textHoverColor) {
                this._drawText(this._settings.textColor);
            }
        });
    }

    private _init() {
        if (!this._graphics) {
            console.error("Could not setup button. Graphics context was not created");
            return;
        }

        this._drawBackground();
        this._drawText(this._settings.textColor);
    }

    private _drawBackground() {
        this._drawRectangle(this._settings.backgroundColor);

        this._sprite.addChild(this._graphics);
    }

    private _drawRectangle(color: number) {
        this._graphics.clear();
        this._graphics.beginFill(color);
        this._graphics.drawRect(0, 0, this._settings.width, this._settings.height);
        this._graphics.endFill();
    }

    private _drawText(color: number) {
        if (!this._settings.text) {
            return;
        }

        this._text = new PIXI.Text(this._settings.text, { fontSize: 12, fill: color });
        this._text.anchor.set(0.5, 0.5);
        this._text.x = (this._settings.width) / 2;
        this._text.y = (this._settings.height) / 2;

        this._graphics.addChild(this._text);
    }
}