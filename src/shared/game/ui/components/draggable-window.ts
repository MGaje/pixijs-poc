import { WindowBase, IWindowBaseSettings, WindowBaseEvents } from '../window-base';

export interface IDraggableWindowSettings extends IWindowBaseSettings {
    titlebarColor: number;
    title: string;
}

export class DraggableWindow extends WindowBase {
    private _titleBarContext: PIXI.Graphics;
    private _data: PIXI.interaction.InteractionData;
    private _pos: any;
    private _dragging: boolean = false;

    constructor(settings: IDraggableWindowSettings) {
        super(settings);

        this._setupDraggableWindow();
        this.init();
    }

    public handleEvents() {
        // Empty.
    }

    private get _draggableWindowSettings(): IDraggableWindowSettings {
        return this.settings as IDraggableWindowSettings;
    }

    private _setupDraggableWindow() {
        this._titleBarContext = new PIXI.Graphics();
        this._titleBarContext.beginFill(this._draggableWindowSettings.titlebarColor);
        this._titleBarContext.drawRect(0, 0, this._draggableWindowSettings.width, 25);
        this._titleBarContext.endFill();

        this._titleBarContext.interactive = true;
        this._titleBarContext.buttonMode = true;

        this._titleBarContext.on('pointerdown', this._onDragStart.bind(this));
        this._titleBarContext.on('pointerup', this._onDragEnd.bind(this));
        this._titleBarContext.on('pointerupoutside', this._onDragEnd.bind(this));
        this._titleBarContext.on('pointermove', this._onDragMove.bind(this));

        console.log('anchor of sprite -> ' + this.sprite.anchor.x + ', ' + this.sprite.anchor.y);

        this.graphicsContext.addChild(this._titleBarContext);
    }

    private _onDragStart(e: PIXI.interaction.InteractionEvent) {
        this._data = e.data;

        if (!this._pos) {
            const anchorPos = this._data.getLocalPosition(this.sprite);
            this._pos = anchorPos;
            console.log('anchor pos: ' + anchorPos.x + ', ' + anchorPos.y);
        }

        this.graphicsContext.alpha = 0.5;
        this._dragging = true;
    }

    private _onDragEnd() {
        this.graphicsContext.alpha = 1;
        this._dragging = false;
        this._data = null;
        this._pos = null;
    }

    private _onDragMove() {
        if (this._dragging) {
            const newPosition = this._data.getLocalPosition(this.sprite.parent);
            const relPosition = this._data.getLocalPosition(this._titleBarContext);
            console.log('rel pos: ' + relPosition.x + ', ' + relPosition.y);
            this.sprite.position.set(newPosition.x - this._pos.x, newPosition.y - this._pos.y);
        }
    }
}