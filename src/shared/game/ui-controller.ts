import { Button } from './ui/components/button';
import { IUISettings } from './ui/ui-settings';

export class UIController {
    private static _components: { [key: string]: any } = {};

    public static registerComponent(c: any, name: string) {
        UIController._components[name] = c;
    }
}