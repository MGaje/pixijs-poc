import * as PIXI from 'pixi.js';

export class Scene extends PIXI.Container {
    private _paused: boolean = false;
    private _update = (delta: number) => {};

    constructor() {
        super();
    }

    public onUpdate(cb: (delta: number) => void) {
        this._update = cb;
    }

    public update(delta: number) {
        this._update(delta);
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
