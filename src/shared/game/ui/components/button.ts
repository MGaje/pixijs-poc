import * as PIXI from 'pixi.js';
import { InputBase, InputHandler, InputEvents } from '../input-base';
import { IUIDrawable } from '../ui-drawable';
import { InputComponent } from '../input-component';
import { IUISettings } from '../ui-settings';
import { IButton } from 'selenium-webdriver';

export interface IButtonSettings extends IUISettings {
    text: string,
    textColor: number,
    texture?: PIXI.Texture,
    textureHover?: PIXI.Texture,
    textureActive?: PIXI.Texture,
    backgroundColor?: number,
    textHoverColor?: number,
    backgroundHoverColor?: number,
    backgroundActiveColor?: number,
    accessibilityTitle?: string,
    dropShadow: {

    }
};

export class Button extends InputComponent {
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;
    private _isActivated: boolean;

    constructor(settings: IButtonSettings) {
        super(settings);

        this.sprite.sortableChildren = true;

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this._graphics = new PIXI.Graphics();

        this._init(settings);
        this.handleEvents();

        this.sprite.position.set(settings.x, settings.y);
    }

    public setText(text: string) {
        this._text.text = text;
    }

    public onMouseDown(h: InputHandler) {
        super.onMouseDown(h);
    }

    protected handleEvents() {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this.sprite.on('mousedown', () => {
            if (this.handlers.has(InputEvents.MouseDown)) {
                this.handlers.get(InputEvents.MouseDown)();
            }

            if (s.backgroundActiveColor) {
                this._drawRect(s.backgroundActiveColor);
            }
            else if (s.textureActive) {
                this._drawTexturedRect(s.textureActive);
            }

            this._isActivated = true;
        });

        this.sprite.on('mouseup', () => {
            if (this.handlers.has(InputEvents.MouseUp)) {
                this.handlers.get(InputEvents.MouseUp)();
            }

            if (s.backgroundActiveColor) {
                this._drawRect(s.backgroundColor);
            }
            else if (s.textureActive) {
                this._drawTexturedRect(s.textureActive);
            }

            this._isActivated = false;
        })

        this.sprite.on('mouseover', () => {
            if (s.backgroundHoverColor) {
                this._drawRect(s.backgroundHoverColor);
            }
            else if (s.textureHover) {
                this._drawTexturedRect(s.textureHover);
            }

            if (s.textHoverColor) {
                this._drawText(s.textHoverColor);
            }
        });

        this.sprite.on('mouseout', () => {
            if (s.backgroundHoverColor) {
                this._drawRect(s.backgroundColor);
            }
            else if (s.textureHover) {
                this._drawTexturedRect(s.texture);
            }

            if (s.textHoverColor) {
                this._drawText(s.textColor);
            }
        });
    }

    private _init(s: IButtonSettings) {
        if (!this._graphics) {
            console.error("Could not setup button. Graphics context was not created");
            return;
        }

        this._drawBackground(s);
        this._drawText(s.textColor);
        //this._drawDropShadow(s);

        if (s.accessibilityTitle) {
            this.sprite.accessible = true;
            this.sprite.accessibleTitle = s.accessibilityTitle;
        }
    }

    private _drawBackground(s: IButtonSettings) {
        if (s.backgroundColor) {
            this._drawRect(s.backgroundColor);
        }
        else if (s.texture) {
            this._drawTexturedRect(s.texture);
        }

        this.sprite.addChild(this._graphics);
    }

    private _drawRect(color: number) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this._graphics.clear();
        this._graphics.beginFill(color);
        this._graphics.drawRect(0, 0, s.width, s.height);
        this._graphics.endFill();
    }

    private _drawTexturedRect(t: PIXI.Texture) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this._graphics.clear();
        this._graphics
            .beginTextureFill(t)
            .drawRect(0, 0, s.width, s.height);
    }

    private _drawText(color: number) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        if (!s.text) {
            return;
        }

        this._text = new PIXI.Text(s.text, { fontSize: 12, fill: color });
        this._text.anchor.set(0.5, 0.5);
        this._text.x = (s.width) / 2;
        this._text.y = (s.height) / 2;

        this.sprite.addChild(this._text);
    }

    private _drawDropShadow(s: IButtonSettings) {
        const dropShadowSprite: PIXI.Sprite = new PIXI.Sprite();
        dropShadowSprite.zIndex = this.sprite.zIndex - 1;

        const blurFilter: PIXI.filters.BlurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 5;
        dropShadowSprite.filters = [blurFilter];

        const dropShadowGraphics: PIXI.Graphics = new PIXI.Graphics();
        dropShadowGraphics.beginFill(0x000000, 0.75);
        dropShadowGraphics.drawRect(3, 3, s.width, s.height);
        dropShadowGraphics.endFill();

        dropShadowSprite.addChild(dropShadowGraphics);
        this.sprite.addChild(dropShadowSprite);
    }
}