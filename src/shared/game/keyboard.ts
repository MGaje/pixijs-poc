/**
 * Helper class to help facilitate keyboard input (cross-browser support).
 */

import { NumberFormatStyle } from '@angular/common';

// String enum of key names.
export enum Keys {
    KeyF = "KeyF",
    KeyX = "KeyX"
};

// Enum of keycodes whose properties match those of key names in the above
// string enum.
enum KeyCodes {
    KeyF = 70,
    KeyX = 88
}

/**
 * The wrapper class for keyboard input.
 */
export class Keyboard {

    /**
     * This is a construct that maps key name to a key code.
     */
    static KeyCodes: Map<string, number> = new Map<string, number>();

    /**
     * This basically sets up the KeyCodes map declared above.
     */
    static init() {
        for (const key in Keys) {
            Keyboard.KeyCodes[key] = KeyCodes[key];
        }
    }

    /**
     * Determines if the specified key is active from the triggered event.
     * @param e The keyboard event.
     * @param keyName The key name.
     */
    static isKeyActive(e: KeyboardEvent, keyName: string): boolean {
        const key: string | number = e.code || e.keyCode;

        // Browsers that were updated in the last 10 years.
        if (typeof(key) === "string") {
            return key === Keys[keyName];
        }

        // Match on key code (IE).
        return key === Keyboard.KeyCodes[keyName];
    }
}