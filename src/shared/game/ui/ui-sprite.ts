import { UIContainer } from './ui-container';

export class UISprite extends UIContainer {
    private _textObj: any;

    constructor() {
        super();
    }

    public get text(): string {
        if (this._textObj) {
            return this._textObj.text;
        }

        return null;
    }

    public set text(val: string) {
        if (this._textObj) {
            if (this._textObj instanceof PIXI.Text ||
                this._textObj instanceof PIXI.BitmapText) {
                this._textObj.text = val;
            }
            else {
                console.warn('Unsupported text object in ui-sprite');
            }
        }
    }

    public setState(state: string = 'default') {
        this.children.forEach(child => {
            if (true) {
                // ?
            }
        });
    }

    protected handleEvents() {
        // todo.
    }
}