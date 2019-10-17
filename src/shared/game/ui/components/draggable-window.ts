import { WindowBase, IWindowBaseSettings, WindowBaseEvents } from '../window-base';

export interface IDraggableWindowSettings extends IWindowBaseSettings {
    titlebarColor: number;
    title: string;
}

export class DraggableWindow extends WindowBase {
    private _titleBarContext: PIXI.Graphics;
    private _data: PIXI.interaction.InteractionData;
    private _mouseRelPos: any;
    private _dragging: boolean = false;

    constructor(settings: IDraggableWindowSettings) {
        super(settings);

        this._setupDraggableWindow();
        this.init();
        this.handleEvents();
    }

    public handleEvents() {
        this._titleBarContext.on('pointerdown', this._onDragStart.bind(this));
        this._titleBarContext.on('pointerup', this._onDragEnd.bind(this));
        this._titleBarContext.on('pointerupoutside', this._onDragEnd.bind(this));
        this._titleBarContext.on('pointermove', this._onDragMove.bind(this));
    }

    private _setupDraggableWindow() {
        const s: IDraggableWindowSettings = this.getSettings<IDraggableWindowSettings>();

        this._titleBarContext = new PIXI.Graphics();
        this._titleBarContext.beginFill(s.titlebarColor);
        this._titleBarContext.drawRect(0, 0, s.width, 25);
        this._titleBarContext.endFill();

        this._titleBarContext.interactive = true;
        this._titleBarContext.buttonMode = true;


        this.graphicsContext.addChild(this._titleBarContext);
    }

    private _onDragStart(e: PIXI.interaction.InteractionEvent) {
        this._data = e.data;

        if (!this._mouseRelPos) {
            const anchorPos = this._data.getLocalPosition(this.sprite);
            this._mouseRelPos = anchorPos;
        }

        this.sprite.alpha = 0.5;
        this._dragging = true;
    }

    private _onDragEnd() {
        this.sprite.alpha = 1;
        this._dragging = false;
        this._data = null;
        this._mouseRelPos = null;
    }

    private _onDragMove() {
        if (this._dragging) {
            const newPosition = this._data.getLocalPosition(this.sprite.parent);
            this.sprite.position.set(newPosition.x - this._mouseRelPos.x, newPosition.y - this._mouseRelPos.y);
        }
    }
}