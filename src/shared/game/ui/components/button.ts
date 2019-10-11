import { UISprite } from '../ui-sprite';


export class Button extends UISprite {
    constructor(settings?: any) {
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
        });
    }
}