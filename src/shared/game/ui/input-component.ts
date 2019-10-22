import * as PIXI from "pixi.js";

import { InputBase } from './input-base';
import { IUIDrawable } from './ui-drawable';
import { IUISettings } from './ui-settings';

/**
 * Input Component Class.
 * Represents any ui components that will be drawn to the screen.
 */
export abstract class InputComponent extends InputBase implements IUIDrawable {
    protected sprite: PIXI.Sprite;
    protected settings: IUISettings;

    /**
     * Constructor.
     * @param settings UI settings.
     */
    constructor(settings: IUISettings) {
        super();
        this.settings = settings;
        this.sprite = new PIXI.Sprite();

        if (this.settings.zIndex) {
            this.sprite.zIndex = this.settings.zIndex;
        }
    }

    /**
     * Get component id.
     */
    public getId() {
        return this.settings.id;
    }

    /**
     * Get pixi js sprite.
     */
    public getPixiSprite(): PIXI.Sprite {
        return this.sprite;
    }

    /**
     * Get visibility state.
     */
    public isVisible(): boolean {
        return this.sprite.visible;
    }

    /**
     * Set visibility state.
     */
    public setVisibility(visible: boolean) {
        this.sprite.visible = visible;
    }

    /**
     * Get width of component.
     */
    public getWidth(): number {
        return this.sprite.width;
    }

    /**
     * Get position of component.
     */
    public getPosition(): PIXI.IPoint {
        return this.sprite.position;
    }

    /**
     * Get zIndex of component.
     */
    public get zIndex(): number {
        return this.sprite.zIndex;
    }

    /**
     * Set the zIndex of the component.
     */
    public set zIndex(value: number) {
        this.sprite.zIndex = value;
    }

    /**
     * Get the settings of the component.
     */
    protected getSettings<T extends IUISettings>(): T {
        return this.settings as T;
    }

    /**
     * Update the input component's settings.
     * @param settings The settings config to update to.
     */
    protected updateSettings<T extends IUISettings>(settings: T): void {
        this.settings = settings;
    }
}