import * as PIXI from 'pixi.js';
import 'pixi-sound';
import { Scene } from '../../scene';

enum SceneResources {
    CatImage = 'cat.png',
    WhistleSound = 'whistle.mp3'
};

export class ConcentrationGamePlayScene extends Scene {

    public cat: PIXI.Sprite;
    public sound: PIXI.sound.Sound;

    constructor(r: PIXI.IResourceDictionary) {
        super(r);

        this._setup();
    }

    public onUpdate(delta: number) {
    }

    private _setup() {
        this.cat = new PIXI.Sprite(this.getResource(SceneResources.CatImage).texture);
        this.addChild(this.cat);

        this.cat.interactive = true;
        this.cat.on('mouseup', this._onCatClick.bind(this));
        this.cat.on('touchend', this._onCatClick.bind(this));
    }

    private _onCatClick() {
        this.getResource(SceneResources.WhistleSound).sound.play();
    }
}
