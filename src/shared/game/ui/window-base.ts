import { InputComponent } from './input-component';
import { IUISettings } from './ui-settings';

export abstract class WindowBase extends InputComponent {
    private _children: Map<string, InputComponent>;

    constructor(settings: IUISettings) {
        super(settings.id);
        this._children = new Map<string, InputComponent>();
    }

    public addChild(c: InputComponent) {
        this._children.set(c.getId(), c);
        this.sprite.addChild(c.getPixiSprite());
    }

    public removeChild(c: InputComponent) {
        this._children.delete(c.getId());
        this.sprite.removeChild(c.getPixiSprite());
    }

}