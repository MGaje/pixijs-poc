import * as PIXI from "pixi.js";

import { InputBase } from './input-base';
import { IUIDrawable } from './ui-drawable';

export abstract class InputComponent extends InputBase implements IUIDrawable {
    protected sprite: PIXI.Sprite;
    private _id: string;

    constructor(id: string) {
        super();
        this._id = id;
        this.sprite = new PIXI.Sprite();
    }

    public getId() {
        return this._id;
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
}