import * as TWEEN from '@tweenjs/tween.js';

import { InputComponent } from './input-component';
import { IUISettings } from './ui-settings';
import { InputHandler } from './input-base';

/**
 * Events common to all windows.
 */
export enum WindowBaseEvents {
    OnBeforeLoad = 'onbeforeload',
    OnBeforeUnload = 'onbeforeunload',
    OnOpen = 'onopen',
    OnClose = 'onclose'
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
        super(settings);
        this._children = new Map<string, InputComponent>();
        this.sprite.zIndex = 5;

        this.settings = settings;

        this.setVisibility(false);
        this.sprite.alpha = 0;

        this.sprite.alpha = settings.alpha;
        this.graphicsContext = new PIXI.Graphics();

        this.sprite.sortableChildren = true;

        this._setupWindow();
    }

    public addChildComponent(c: InputComponent) {
        if (this._children.has(c.getId())) {
            console.warn(`Window with id '${this.getId()}' already has child component with id '${c.getId()}'`)
        }

        this._children.set(c.getId(), c);
        this.sprite.addChild(c.getPixiSprite());
    }

    public removeChildComponent(c: InputComponent) {
        this._children.delete(c.getId());
        this.sprite.removeChild(c.getPixiSprite());
    }

    public addPixiChild(c: PIXI.DisplayObject) {
        this.sprite.addChild(c);
    }

    public removePixiChild(c: PIXI.DisplayObject) {
        this.sprite.removeChild(c);
    }

    public onBeforeLoad(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnBeforeLoad, h);
    }

    public onBeforeUnload(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnBeforeUnload, h);
    }

    public onOpen(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnOpen, h);
    }

    public onClose(h: InputHandler) {
        this.handlers.set(WindowBaseEvents.OnClose, h);
    }

    public open() {
        if (this.isVisible()) {
            return;
        }

        this.setVisibility(true);

        const s: IWindowBaseSettings = this.getSettings<IWindowBaseSettings>();

        new Promise((resolve, reject) => {
            if (this.handlers.has(WindowBaseEvents.OnBeforeLoad)) {
                this.handlers.get(WindowBaseEvents.OnBeforeLoad)();
            }

            const origY: number = s.y;
            const destY: number = origY + 100;

            // new TWEEN.Tween({ alpha: 0, y: destY})
            //     .to({ alpha: 1, y: origY }, 100)
            //     .easing(TWEEN.Easing.Linear.None)
            //     .onUpdate(update => {
            //         this.sprite.alpha = update.alpha;
            //         this.sprite.position.y = update.y;
            //     })
            //     .onComplete(() => {
            //         resolve(true);
            //     })
            //     .start();

            resolve(true);
        })
        .then(() => {
            if (this.handlers.has(WindowBaseEvents.OnOpen)) {
                this.handlers.get(WindowBaseEvents.OnOpen)();
            }
        });
    }

    public close() {
        if (!this.isVisible()) {
            return;
        }

        const s: IWindowBaseSettings = this.getSettings<IWindowBaseSettings>();

        new Promise((resolve, reject) => {
            if (this.handlers.has(WindowBaseEvents.OnBeforeUnload)) {
                this.handlers.get(WindowBaseEvents.OnBeforeUnload)();
            }

            const origY: number = s.y;
            const destY: number = origY + 100;

            // new TWEEN.Tween({ alpha: 1, y: origY })
            //     .to({ alpha: 0, y: destY }, 100)
            //     .easing(TWEEN.Easing.Linear.None)
            //     .onUpdate(update => {
            //         this.sprite.alpha = update.alpha;
            //         this.sprite.position.y = update.y;
            //     })
            //     .onComplete(() => {
            //         resolve(true);
            //     })
            //     .start();

            resolve(true);
        })
        .then(() => {
            this.setVisibility(false);
            if (this.handlers.has(WindowBaseEvents.OnClose)) {
                this.handlers.get(WindowBaseEvents.OnClose)();
            }
        });
    }

    protected getComponentZIndex(): number {
        return this.graphicsContext.zIndex + 1;
    }

    protected init() {
        this.sprite.position.set(this.settings.x, this.settings.y);
        this.sprite.addChild(this.graphicsContext);
        this.sprite.sortChildren();
    }

    private _setupWindow() {
        this.graphicsContext.beginFill(this.settings.backgroundColor);
        this.graphicsContext.drawRect(0, 0, this.settings.width, this.settings.height);
        this.graphicsContext.endFill();
    }
}