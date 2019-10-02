import * as PIXI from 'pixi.js';
import 'pixi-sound';
import { Scene } from '../../scene';

enum SceneResources {
    BlobImage = 'blob.png',
    SuccessSound = 'success.mp3'
};

export class TestGamePlayScene extends Scene {

    public cat: PIXI.Sprite;
    public sound: PIXI.sound.Sound;

    constructor(r: PIXI.IResourceDictionary) {
        super(r);

        this._setup();
    }

    public onUpdate(delta: number) {
    }

    private _setup() {
        this.cat = new PIXI.Sprite(this.getResource(SceneResources.BlobImage).texture);
        this.addChild(this.cat);

        this.cat.interactive = true;
        this.cat.on('mouseup', this._onBlobClick.bind(this));
        this.cat.on('touchend', this._onBlobClick.bind(this));
    }

    private _onBlobClick() {
        this.getResource(SceneResources.SuccessSound).sound.play();
    }
}
