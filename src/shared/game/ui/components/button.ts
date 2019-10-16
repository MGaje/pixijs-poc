import * as PIXI from 'pixi.js';
import { InputBase, InputHandler, InputEvents } from '../input-base';
import { IUIDrawable } from '../ui-drawable';
import { InputComponent } from '../input-component';
import { IUISettings } from '../ui-settings';

export interface IButtonSettings extends IUISettings {
    text: string,
    textColor: number,
    texture?: PIXI.Texture,
    textureHover?: PIXI.Texture,
    backgroundColor?: number,
    textHoverColor?: number,
    backgroundHoverColor?: number
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
            if (this.handlers.has(InputEvents.MouseDown)) {
                this.handlers.get(InputEvents.MouseDown)();
            }
        });

        this.sprite.on('mouseup', () => {
            if (this.handlers.has(InputEvents.MouseUp)) {
                this.handlers.get(InputEvents.MouseUp)();
            }
        })

        this.sprite.on('mouseover', () => {
            if (this._settings.backgroundHoverColor) {
                this._drawRect(this._settings.backgroundHoverColor);
            }
            else if (this._settings.textureHover) {
                this._drawTexturedRect(this._settings.textureHover);
            }

            if (this._settings.textHoverColor) {
                this._drawText(this._settings.textHoverColor);
            }
        });

        this.sprite.on('mouseout', () => {
            if (this._settings.backgroundHoverColor) {
                this._drawRect(this._settings.backgroundColor);
            }
            else if (this._settings.textureHover) {
                this._drawTexturedRect(this._settings.texture);
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
        if (this._settings.backgroundColor) {
            this._drawRect(this._settings.backgroundColor);
        }
        else if (this._settings.texture) {
            this._drawTexturedRect(this._settings.texture);
        }

        this.sprite.addChild(this._graphics);
    }

    private _drawRect(color: number) {
        this._graphics.clear();
        this._graphics.beginFill(color);
        this._graphics.drawRect(0, 0, this._settings.width, this._settings.height);
        this._graphics.endFill();
    }

    private _drawTexturedRect(t: PIXI.Texture) {
        this._graphics.clear();
        this._graphics
            .beginTextureFill(t)
            .drawRect(0, 0, this._settings.width, this._settings.height);
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