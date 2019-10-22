import * as PIXI from 'pixi.js';
import { InputBase, InputHandler, InputEvents } from '../input-base';
import { IUIDrawable } from '../ui-drawable';
import { InputComponent } from '../input-component';
import { IUISettings } from '../ui-settings';
import { IButton } from 'selenium-webdriver';

/**
 * Settings specifically for buttons.
 */
export interface IButtonSettings extends IUISettings {
    symbol?: string,
    text?: string,
    textColor?: number,
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

/**
 * Button class.
 * Supports symbols and text or just straight up textures. Supports pixijs' builtin
 * accessibility features.
 */
export class Button extends InputComponent {
    private _graphics: PIXI.Graphics;
    private _text: PIXI.Text;
    private _textMetrics: PIXI.TextMetrics;
    private _symbol: PIXI.Text;
    private _symbolMetrics: PIXI.TextMetrics;
    private _isActivated: boolean;

    /**
     * Constructor.
     * @param settings Button settings.
     */
    constructor(settings: IButtonSettings) {
        super(settings);

        // Combine default settings and supplied settings.
        // Is there a better approach for this?
        this.settings = Object.assign({}, { fontSize: 24 }, settings);

        this.sprite.sortableChildren = true;

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this._graphics = new PIXI.Graphics();

        this._init(this.settings as IButtonSettings);
        this.handleEvents();

        this.sprite.position.set(this.settings.x, this.settings.y);
    }

    /**
     * Set the button text. (Experimental/Untested).
     * @param text The text to update to.
     */
    public setText(text: string) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        s.text = text;

        this.updateSettings(s);

        this._calculateTextMetrics(s.text, s.fontSize);
        this._text.text = text;
    }

    /**
     * Set the button symbol. (Experimental/Untested).
     * @param symbol The symbol to update to.
     */
    public setSymbol(symbol: string) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        s.symbol = symbol;

        this.updateSettings(s);

        this._calculateSymbolMetrics(s.symbol, s.fontSize);
        this._symbol.text = s.symbol;
    }

    /**
     * Handle children events.
     * This is mostly the pixijs component events.
     */
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
                this._drawTexturedRect(s.texture);
            }

            this._isActivated = false;
        });

        this.sprite.on('pointerupoutside', () => {
            if (this.handlers.has(InputEvents.PointerUpOutside)) {
                this.handlers.get(InputEvents.PointerUpOutside)();
            }

            if (s.backgroundActiveColor) {
                this._drawRect(s.backgroundColor);
            }
            else if (s.textureActive) {
                this._drawTexturedRect(s.texture);
            }

            this._isActivated = false;
        });

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

    /**
     * Initialize the button.
     * @param s Button settings.
     */
    private _init(s: IButtonSettings) {
        if (!this._graphics) {
            console.error("Could not setup button. Graphics context was not created");
            return;
        }

        this._drawBackground(s);

        //
        // We only need to calculate the metrics if both symbol and text data
        // are provided. Otherwise it's wasted cycles.
        //
        if (s.symbol && s.text) {
            this._calculateSymbolMetrics(s.symbol, s.fontSize);
        }

        if (s.text) {
            if (s.symbol) {
                this._calculateTextMetrics(s.text, s.fontSize);
            }

            this._drawText(s.textColor);
        }

        //this._drawDropShadow(s);

        // Setup accessibility if an accessbility title is specified.
        if (s.accessibilityTitle) {
            this.sprite.accessible = true;
            this.sprite.accessibleTitle = s.accessibilityTitle;
        }
    }

    /**
     * Draw the background of the button.
     * @param s Button settings.
     */
    private _drawBackground(s: IButtonSettings) {
        if (s.backgroundColor) {
            this._drawRect(s.backgroundColor);
        }
        else if (s.texture) {
            this._drawTexturedRect(s.texture);
        }

        this.sprite.addChild(this._graphics);
    }

    /**
     * Draws primitive background for button.
     * @param color The background color of the button.
     */
    private _drawRect(color: number) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this._graphics.clear();
        this._graphics.beginFill(color);
        this._graphics.drawRect(0, 0, s.width, s.height);
        this._graphics.endFill();
    }

    /**
     * Draws a texture for the background of the button.
     * @param t The texture of the button.
     */
    private _drawTexturedRect(t: PIXI.Texture) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        this.sprite.texture = t;
        this.sprite.scale.set(s.width / t.width, s.height / t.height);
    }

    /**
     * Draw the text of the button.
     * @param color The text color.
     */
    private _drawText(color: number) {
        const s: IButtonSettings = this.getSettings<IButtonSettings>();

        if (!s.text) {
            return;
        }

        let centerX: number = s.width / 2;
        let centerY: number = s.height / 2;

        if (!this._text) {
            this._text = new PIXI.Text(s.text, { fontFamily: 'chunkfive_printregular', fontSize: s.fontSize, fill: color });
            this._text.anchor.set(0.5, 0.5);
            this.sprite.addChild(this._text);
        }
        else {
            this._text.text = s.text;
        }

        if (s.symbol) {
            if (!this._symbol) {
                this._symbol = new PIXI.Text(s.symbol, { fontFamily: 'FontAwesome', fontSize: s.fontSize, fill: color });
                this._symbol.anchor.set(0.5, 0.5);
                this.sprite.addChild(this._symbol);
            }

            this._symbol.position.set(centerX - (this._textMetrics.width / 2), centerY);

            this._text.x = centerX + (this._symbolMetrics.width / 2) + 6;
        }
        else {
            this._text.x = centerX;
        }

        this._text.y = centerY;
    }

    /**
     * Calculate the metrics for the specified text and font size.
     * @param text The text to calculate the metrics for.
     * @param fontSize The font size of the text.
     */
    private _calculateTextMetrics(text: string, fontSize: number) {
        const style: PIXI.TextStyle = new PIXI.TextStyle({ fontFamily: 'chunkfive_printregular', fontSize: fontSize });
        this._textMetrics = PIXI.TextMetrics.measureText(text, style);
    }

    /**
     * Calculate the metrics for the specified symbol and font size.
     * @param symbol The symbol to calculate the metrics for.
     * @param fontSize The font size of the symbol.
     */
    private _calculateSymbolMetrics(symbol: string, fontSize: number) {
        const style: PIXI.TextStyle = new PIXI.TextStyle({ fontFamily: 'FontAwesome', fontSize: fontSize });
        this._symbolMetrics = PIXI.TextMetrics.measureText(symbol, style);
    }

    /**
     * Draw the drop shadow of the button.
     * This is primarily unused and was meant as an experiment.
     * @param s The button settings.
     */
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