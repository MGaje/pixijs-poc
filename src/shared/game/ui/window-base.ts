import { InputComponent } from './input-component';
import { IUISettings } from './ui-settings';
import { InputHandler } from './input-base';

/**
 * Events common to all windows.
 */
export enum WindowBaseEvents {
    OnBeforeLoad = 'onbeforeload',
    OnBeforeUnload = 'onbeforeunload'
};

export interface IWindowBaseSettings extends IUISettings {
    backgroundColor: number;
    alpha: number;
}

/**
 * Represents the bare minimum of what a window could be.
 */
export abstract class WindowBase extends InputComponent {
    protected graphicsContext: PIXI.Graphics;
    protected settings: any;
    private _children: Map<string, InputComponent>;

    constructor(settings: IWindowBaseSettings) {
        super(settings.id);
        this._children = new Map<string, InputComponent>();

        this.settings = settings;
        this.setVisibility(false);
        this.sprite.alpha = settings.alpha;
        this.graphicsContext = new PIXI.Graphics();

        this._setupWindow();
    }

    public addChild(c: InputComponent) {
        this._children.set(c.getId(), c);
        this.sprite.addChild(c.getPixiSprite());
    }

    public removeChild(c: InputComponent) {
        this._children.delete(c.getId());
        this.sprite.removeChild(c.getPixiSprite());
    }

    public onBeforeLoad(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnBeforeLoad, h);
    }

    public onBeforeUnload(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnBeforeUnload, h);
    }

    public open() {
        if (this.isVisible()) {
            return;
        }

        new Promise((resolve, reject) => {
            if (this.handlers.has(WindowBaseEvents.OnBeforeLoad)) {
                this.handlers.get(WindowBaseEvents.OnBeforeLoad)();
            }

            resolve(true);
        })
        .then(() => {
            this.setVisibility(true);
        });
    }

    public close() {
        if (!this.isVisible()) {
            return;
        }

        new Promise((resolve, reject) => {
            if (this.handlers.has(WindowBaseEvents.OnBeforeUnload)) {
                this.handlers.get(WindowBaseEvents.OnBeforeUnload)();
            }

            resolve(true);
        })
        .then(() => {
            this.setVisibility(false);
        });
    }

    protected init() {
        //this.graphicsContext.position.set(this.settings.x, this.settings.y);
        this.sprite.position.set(this.settings.x, this.settings.y);
        this.sprite.addChild(this.graphicsContext);
    }

    private _setupWindow() {
        this.graphicsContext.beginFill(this.settings.backgroundColor);
        this.graphicsContext.drawRect(0, 0, this.settings.width, this.settings.height);
        this.graphicsContext.endFill();
    }
}