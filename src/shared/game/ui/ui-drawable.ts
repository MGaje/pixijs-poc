import * as PIXI from 'pixi.js';

/**
 * This interface denotes which ui components are drawable/have a pixi sprite.
 */
export interface IUIDrawable {
    getId(): string;
    getPixiSprite(): PIXI.Sprite;
}