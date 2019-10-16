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
 * Abstract class built around base ui functionalty.
 */
export abstract class InputBase {
    protected handlers: Map<string, InputHandler> = new Map<string, InputHandler>();

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
        this.handlers.set(InputEvents.MouseDown, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseUp(h: InputHandler) {
        this.handlers.set(InputEvents.MouseUp, h);
    }

    /**
     * Handle 'mouseover' event.
     * @param h The callback when the 'mouseover' event occurs.
     */
    public onMouseOver(h: InputHandler) {
        this.handlers.set(InputEvents.MouseOver, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseOut(h: InputHandler) {
        this.handlers.set(InputEvents.MouseOut, h);
    }

    /**
     * TODO: Add destroy() method to free some memory.
     */

    /**
     * Abstract handleEvents - not all ui elements will handle all input events.
     */
    protected abstract handleEvents();
}