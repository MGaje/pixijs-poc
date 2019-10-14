import * as PIXI from 'pixi.js';

export class MultiStateSprite extends PIXI.Sprite {
    private _stateTextures: any = {};

    constructor(texture: PIXI.Texture, states?: any) {
        super(texture);

        this._stateTextures['default'] = texture;

        if (states) {
            for (let s in states) {
                const tx = states[s];
                if (tx instanceof PIXI.Texture) {
                    this._stateTextures[s] = tx;
                }
            }
        }
    }

    public addState(id: string, texture: PIXI.Texture) {
        this._stateTextures[id] = texture;
    }

    public setState(state = 'default') {
        const sprite: any = this;

        if (!sprite._stateTextures[state]) {
            return;
        }

        if (sprite.texture) {
            sprite.texture = sprite._stateTextures[state];
        }
        else {
            if (sprite._texture) {
                sprite._texture = sprite._stateTextures[state];
            }
        }

        if (sprite._tilingTexture) {
            sprite._tilingTexture = sprite._stateTextures[state];
        }
    }
}