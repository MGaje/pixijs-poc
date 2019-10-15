import * as PIXI from 'pixi.js';
import { InputBase, InputHandler, InputEvents } from '../input-base';
import { IUIDrawable } from '../ui-drawable';
import { InputComponent } from '../input-component';
import { IUISettings } from '../ui-settings';

export interface IButtonSettings extends IUISettings {
    text: string,
    textColor: number,
    backgroundColor: number,
    textHoverColor?: number,
    backgroundHoverColor?: number,
    width?: number,
    height?: number,
    x?: number,
    y?: number
};

export class Button extends InputComponent {
    private _settings: IButtonSettings;
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;

    constructor(settings: IButtonSettings) {
        super(settings.id);

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this._settings = settings;
        this._graphics = new PIXI.Graphics();

        this._init();
        this.handleEvents();

        this.sprite.position.set(this._settings.x, this._settings.y);
    }

    public setText(text: string) {
        this._text.text = text;
    }

    public onMouseDown(h: InputHandler) {
        super.onMouseDown(h);
    }

    protected handleEvents() {
        this.sprite.on('mousedown', () => {
            this.inputHandlers.get(InputEvents.MouseDown)();
        });

        this.sprite.on('mouseover', () => {
            if (this._settings.backgroundHoverColor) {
                this._drawRectangle(this._settings.backgroundHoverColor);
            }

            if (this._settings.textHoverColor) {
                this._drawText(this._settings.textHoverColor);
            }
        });

        this.sprite.on('mouseout', () => {
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

        this.sprite.addChild(this._graphics);
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

        this.sprite.addChild(this._text);
    }
}