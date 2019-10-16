import { WindowBase, WindowBaseEvents, IWindowBaseSettings } from '../window-base';

export class SimpleWindow extends WindowBase {
    constructor(settings: IWindowBaseSettings) {
        super(settings);
        this.init();
    }

    public handleEvents() {
        // Nothing.
    }
}