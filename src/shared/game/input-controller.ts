/**
 * Essentially a blueprint for what is expected around keyboard
 * input. May expand in the future.
 */

export interface InputController {
    onKeyDown?(e: KeyboardEvent): void;
    onKeyUp?(e: KeyboardEvent): void;
}