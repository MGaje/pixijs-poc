import * as PIXI from 'pixi.js';

export class UIContainer extends PIXI.Container {
    private _guiId: string;
    private _container: PIXI.Container;

    constructor() {
        super();

        this._container = new PIXI.Container();
    }

    public get id(): string {
        return this._guiId;
    }

    public set id(val: string) {
        this._guiId = val;
    }

    protected setupEvents() {
        // todo.
    }
}