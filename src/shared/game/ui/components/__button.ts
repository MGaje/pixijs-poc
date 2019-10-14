import { UISprite } from '../ui-sprite';
import { UISettings } from '../ui-settings';


export class __Button extends UISprite {
    constructor(settings?: UISettings) {
        super();

        if (settings && settings.text) {
            this.text = settings.text;
        }
    }

    protected handleEvents() {
        super.handleEvents();

        let isDown: boolean = false;

        this.on('mousedown', () => {
            isDown = true;
            this.setState('down');
        });

        this.on('mouseup', () => {
            isDown = false;
            this.setState('default');
        });

        this.on('mouseover', () => {
            if (!isDown) this.setState('hover');
        });

        this.on('mouseout', () => {
            isDown = false;
            this.setState('default');
        });
    }
}