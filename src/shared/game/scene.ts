import * as PIXI from 'pixi.js';


export abstract class Scene extends PIXI.Container {
    private _paused: boolean = false;
    protected resources: PIXI.IResourceDictionary;

    constructor(r: PIXI.IResourceDictionary) {
        super();

        this.resources = r;
    }

    public update(delta: number) {
        if (!this.isPaused()) {
            this.onUpdate(delta);
        }
    }

    protected abstract onUpdate(delta: number);

    protected getResource(file: string): PIXI.LoaderResource {
        return this.resources[`assets/${file}`];
    }

    public pause() {
        this._paused = true;
    }

    public resume() {
        this._paused = false;
    }

    public isPaused() {
        return this._paused;
    }
}
