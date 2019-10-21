/**
 * Type that denotes the input handler callbacks.
 */
export type InputHandler = () => void;

/**
 * String enum for the different input events.
 */
export enum InputEvents {
    MouseDown = 'mousedown',
    PointerDown = 'pointerdown',
    TouchStart = 'touchstart',
    MouseUp = 'mouseup',
    PointerUp = 'pointerup',
    TouchEnd = 'touchend',
    MouseOver = 'mouseover',
    PointerOver = 'pointerover',
    MouseOut = 'mouseout',
    PointerOut = 'pointerout',
    PointerUpOutside = 'pointerupoutside',
    MouseUpOutside = 'mouseupoutside',
    TouchEndOutside = 'touchendoutside'
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
     * Handle 'pointerdown' event.
     * @param h The callback when the 'pointerdown' event occurs.
     */
    public onPointerDown(h: InputHandler) {
        this.handlers.set(InputEvents.PointerDown, h);
    }

    /**
     * Handle 'touchstart' event.
     * @param h The callback when the 'touchstart' event occurs.
     */
    public onTouchStart(h: InputHandler) {
        this.handlers.set(InputEvents.TouchStart, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseUp(h: InputHandler) {
        this.handlers.set(InputEvents.MouseUp, h);
    }

    /**
     * Handle 'pointerup' event.
     * @param h The callback when the 'pointerup' event occurs.
     */
    public onPointerUp(h: InputHandler) {
        this.handlers.set(InputEvents.PointerUp, h);
    }

    /**
     * Handle 'touchend' event.
     * @param h The callback when the 'touchend' event occurs.
     */
    public onTouchEnd(h: InputHandler) {
        this.handlers.set(InputEvents.TouchEnd, h);
    }

    /**
     * Handle 'onmouseupoutside' event.
     * @param h The callback when the 'onmouseupoutside' event occurs.
     */
    public onMouseUpOutside(h: InputHandler) {
        this.handlers.set(InputEvents.MouseUpOutside, h);
    }

    /**
     * Handle 'pointerupoutside' event.
     * @param h The callback when the 'pointerupoutside' event occurs.
     */
    public onPointerUpOutside(h: InputHandler) {
        this.handlers.set(InputEvents.PointerUpOutside, h);
    }

    /**
     * Handle 'touchendoutside' event.
     * @param h The callback when the 'touchendoutside' event occurs.
     */
    public onTouchEndOutside(h: InputHandler) {
        this.handlers.set(InputEvents.TouchEndOutside, h);
    }

    /**
     * Handle 'mouseover' event.
     * @param h The callback when the 'mouseover' event occurs.
     */
    public onMouseOver(h: InputHandler) {
        this.handlers.set(InputEvents.MouseOver, h);
    }

    /**
     * Handle 'pointerover' event.
     * @param h The callback when the 'pointerover' event occurs.
     */
    public onPointerOver(h: InputHandler) {
        this.handlers.set(InputEvents.PointerOver, h);
    }

    /**
     * Handle 'mouseup' event.
     * @param h The callback when the 'mouseup' event occurs.
     */
    public onMouseOut(h: InputHandler) {
        this.handlers.set(InputEvents.MouseOut, h);
    }

    /**
     * Handle 'pointerout' event.
     * @param h The callback when the 'pointerout' event occurs.
     */
    public onPointerOut(h: InputHandler) {
        this.handlers.set(InputEvents.PointerOut, h);
    }

    /**
     * TODO: Add destroy() method to free some memory.
     */

    /**
     * Abstract handleEvents - not all ui elements will handle all input events.
     */
    protected abstract handleEvents();
}