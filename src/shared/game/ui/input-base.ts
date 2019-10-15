/**
 * Type that denotes the input handler callbacks.
 */
export type InputHandler = () => void;

/**
 * String enum for the different input events.
 */
export enum InputEvents {
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    MouseOver = 'mouseover',
    MouseOut = 'mouseout'
};

/**
 * Abstract class built around basae ui functionalty.
 */
export abstract class InputBase {
    protected inputHandlers: Map<string, InputHandler> = new Map<string, InputHandler>();

    /**
     * Default constructor.
     */
    constructor() {
        // Empty.
    }

    /**
     * Handle 'mousedown' event.
     * @param h The callback when the 'mousedown' event occurs.
     */
    public onMouseDown(h: InputHandler) {
        this.inputHandlers.set(InputEvents.MouseDown, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseUp(h: InputHandler) {
        this.inputHandlers.set(InputEvents.MouseUp, h);
    }

    /**
     * Handle 'mouseover' event.
     * @param h The callback when the 'mouseover' event occurs.
     */
    public onMouseOver(h: InputHandler) {
        this.inputHandlers.set(InputEvents.MouseOver, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseOut(h: InputHandler) {
        this.inputHandlers.set(InputEvents.MouseOut, h);
    }

    /**
     * Abstract handleEvents - not all ui elements will handle all input events.
     */
    protected abstract handleEvents();
}