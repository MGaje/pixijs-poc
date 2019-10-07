import { NumberFormatStyle } from '@angular/common';

// String enum of key names.
export enum Keys {
    KeyF = "KeyF"
};

// Enum of keycodes whose properties match those of key names in the above
// string enum.
enum KeyCodes {
    KeyF = 70
}

export class Keyboard {
    static KeyCodes: Map<string, number> = new Map<string, number>();

    static init() {
        for (const key in Keys) {
            Keyboard.KeyCodes[key] = KeyCodes[key];
        }
    }

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