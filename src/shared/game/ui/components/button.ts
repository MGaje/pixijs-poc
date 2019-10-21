import * as PIXI from 'pixi.js';
import { InputBase, InputHandler, InputEvents } from '../input-base';
import { IUIDrawable } from '../ui-drawable';
import { InputComponent } from '../input-component';
import { IUISettings } from '../ui-settings';
import { IButton } from 'selenium-webdriver';

export interface IButtonSettings extends IUISettings {
    symbol?: string,
    text: string,
    textColor: number,
    fontSize?: number,
    texture?: PIXI.Texture,
    textureHover?: PIXI.Texture,
    textureActive?: PIXI.Texture,
    backgroundColor?: number,
    textHoverColor?: number,
    backgroundHoverColor?: number,
    backgroundActiveColor?: number,
    accessibilityTitle?: string
};

export class Button extends InputComponent {
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;
    private _textMetrics: PIXI.TextMetrics;
    private _symbol: PIXI.Text;
    private _symbolMetrics: PIXI.TextMetrics;
    private _isActivated: boolean;

    constructor(settings: IButtonSettings) {
        super(settings);

        // Combine default settings and supplied settings.
        this.settings = Object.assign({}, { fontSize: 24 }, settings);

        this.sprite.sortableChildren = true;

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this._graphics = new PIXI.Graphics();

        this._init(this.settings as IButtonSettings);
        this.handleEvents();

        this.sprite.position.set(this.settings.x, this.settings.y);
    }

    public setText(text: string) {
        // todo: add support for symbol.
        // todo: update metrics for symbol/text.
        this._text.text = text;
    }

    public onMouseDown(h: InputHandler) {
        super.onMouseDown(h);
    }

    protected handleEvents() {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this.sprite.on('pointerdown', () => {
            if (this.handlers.has(InputEvents.PointerDown)) {
                this.handlers.get(InputEvents.PointerDown)();
            }

            if (s.backgroundActiveColor) {
                this._drawRect(s.backgroundActiveColor);
            }
            else if (s.textureActive) {
                this._drawTexturedRect(s.textureActive);
            }

            this._isActivated = true;
        });

        this.sprite.on('pointerup', () => {
            if (this.handlers.has(InputEvents.PointerUp)) {
                this.handlers.get(InputEvents.PointerUp)();
            }

            if (s.backgroundActiveColor) {
                this._drawRect(s.backgroundColor);
            }
            else if (s.textureActive) {
                this._drawTexturedRect(s.textureActive);
            }

            this._isActivated = false;
        })

        this.sprite.on('pointerover', () => {
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

        this.sprite.on('pointerout', () => {
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

        if (s.symbol) {
            this._calculateSymbolMetrics(s);
        }
        this._calculateTextMetrics(s);

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

        let totalWidth: number = this._textMetrics.width;
        let centerX: number = s.width / 2;
        let centerY: number = s.height / 2;

        if (s.symbol) {
            totalWidth += this._symbolMetrics.width;

            if (!this._symbol) {
                this._symbol = new PIXI.Text(s.symbol, { fontFamily: 'FontAwesome', fontSize: s.fontSize, fill: color });
                this._symbol.anchor.set(0.5, 0.5);
                this.sprite.addChild(this._symbol);
            }

            this._symbol.position.set(centerX - (this._textMetrics.width / 2), centerY);
        }

        if (!this._text) {
            this._text = new PIXI.Text(s.text, { fontFamily: 'chunkfive_printregular', fontSize: s.fontSize, fill: color });
            this._text.anchor.set(0.5, 0.5);
            this.sprite.addChild(this._text);
        }
        else {
            this._text.text = s.text;
        }

        if (s.symbol) {
            this._text.x = centerX + (this._symbolMetrics.width / 2) + 6;
            this._text.y = centerY;
        }
        else {
            this._text.x = centerX;
            this._text.y = centerY;
        }
    }

    private _calculateTextMetrics(s: IButtonSettings) {
        const style: PIXI.TextStyle = new PIXI.TextStyle({ fontFamily: 'chunkfive_printregular', fontSize: s.fontSize });
        this._textMetrics = PIXI.TextMetrics.measureText(s.text, style);
    }

    private _calculateSymbolMetrics(s: IButtonSettings) {
        const style: PIXI.TextStyle = new PIXI.TextStyle({ fontFamily: 'FontAwesome', fontSize: s.fontSize });
        this._symbolMetrics = PIXI.TextMetrics.measureText(s.symbol, style);
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