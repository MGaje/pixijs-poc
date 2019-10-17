import * as PIXI from "pixi.js";

import { InputBase } from './input-base';
import { IUIDrawable } from './ui-drawable';
import { IUISettings } from './ui-settings';

export abstract class InputComponent extends InputBase implements IUIDrawable {
    protected sprite: PIXI.Sprite;
    protected settings: IUISettings;

    constructor(settings: IUISettings) {
        super();
        this.settings = settings;
        this.sprite = new PIXI.Sprite();

        if (this.settings.zIndex) {
            this.sprite.zIndex = this.settings.zIndex;
        }
    }

    public getId() {
        return this.settings.id;
    }

    public getPixiSprite(): PIXI.Sprite {
        return this.sprite;
    }

    public isVisible(): boolean {
        return this.sprite.visible;
    }

    public setVisibility(visible: boolean) {
        this.sprite.visible = visible;
    }

    public getWidth(): number {
        return this.sprite.width;
    }

    public getPosition(): PIXI.IPoint {
        return this.sprite.position;
    }

    public get zIndex(): number {
        return this.sprite.zIndex;
    }

    public set zIndex(value: number) {
        this.sprite.zIndex = value;
    }

    protected getSettings<T extends IUISettings>(): T {
        return this.settings as T;
    }
}