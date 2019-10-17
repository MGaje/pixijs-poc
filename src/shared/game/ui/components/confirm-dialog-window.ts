import { WindowBase, IWindowBaseSettings } from '../window-base';
import { Button } from './button';
import { InputHandler } from '../input-base';

export interface IConfirmDialogWindowSettings extends IWindowBaseSettings {
    message?: string;
    yesOptionText?: string;
    noOptionText?: string;
}

export enum ConfirmDialogWindowEvents {
    OnConfirm = 'onconfirm',
    OnCancel = 'oncancel'
}

export class ConfirmDialogWindow extends WindowBase {
    private _message: PIXI.Text;

    constructor(settings: IConfirmDialogWindowSettings) {
        super(settings);

        this._setupConfirmationDialogWindow(settings);
        this.handleEvents();

        this.init();
    }

    public handleEvents() {
        // todo.
    }

    private _setupConfirmationDialogWindow(s: IConfirmDialogWindowSettings) {
        this._setupMessage(s);
        this._setupButtons(s);
    }

    private _setupMessage(s: IConfirmDialogWindowSettings) {
        const compZIndex: number = this.getComponentZIndex();
        const msg: string = s.message || 'Are you sure?';
        const style: PIXI.TextStyle = new PIXI.TextStyle({ fill: 0x000000, fontSize: 24, align: 'center' });
        const metrics = PIXI.TextMetrics.measureText(msg, style);

        const x: number = (s.width - metrics.width) / 2;

        // - 55 because we need to remove the button height from the equation.
        const y: number = ((s.height - 55) - metrics.height) / 2;

        this._message = new PIXI.Text(msg, style);
        this._message.position.set(x, y);
        this._message.zIndex = compZIndex;

        this.addPixiChild(this._message);
    }

    public onConfirm(h: InputHandler) {
        this.handlers.set(ConfirmDialogWindowEvents.OnConfirm, h);
    }

    public onCancel(h: InputHandler) {
        this.handlers.set(ConfirmDialogWindowEvents.OnCancel, h);
    }

    private _setupButtons(s: IConfirmDialogWindowSettings) {
        const compZIndex: number = this.getComponentZIndex();
        const btnWidth: number = (s.width / 2) - 10;

        const noBtn: Button = new Button({
            id: 'noBtn',
            text: s.noOptionText || 'Cancel',
            textColor: 0xffffff,
            width: btnWidth,
            height: 50,
            backgroundColor: 0x666666,
            x: 5,
            y: (s.height - 50) - 5,
            zIndex: compZIndex
        });

        noBtn.onMouseUp(() => {
            if (this.handlers.has(ConfirmDialogWindowEvents.OnCancel)) {
                this.handlers.get(ConfirmDialogWindowEvents.OnCancel)();
            }

            this.close();
        });

        const yesBtn: Button = new Button({
            id: 'yesBtn',
            text: s.yesOptionText || 'Ok',
            textColor: 0xffffff,
            width: (s.width / 2) - 5,
            height: 50,
            backgroundColor: 0x00aaff,
            x: noBtn.getPosition().x + btnWidth + 5,
            y: (s.height - 50) - 5,
            zIndex: compZIndex
        });

        yesBtn.onMouseUp(() => {
            if (this.handlers.has(ConfirmDialogWindowEvents.OnConfirm)) {
                this.handlers.get(ConfirmDialogWindowEvents.OnConfirm)();
            }

            this.close();
        });

        this.addChildComponent(yesBtn);
        this.addChildComponent(noBtn);
    }
}