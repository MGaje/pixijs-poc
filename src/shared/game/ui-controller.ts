import { Button } from './ui/components/button';
import { UISprite } from './ui/ui-sprite';
import { UISettings } from './ui/ui-settings';

export class UIController {
    private static _components: { [key: string]: any } = {};

    public static registerComponent(c: any, name: string) {
        UIController._components[name] = c;
    }

    public static registerComponents() {
        UIController.registerComponent(Button, 'button');
    }

    public static create(settings: UISettings): UISprite {
        const compConstructor: any = UIController._components[settings.component];

        if (!compConstructor) {
            return null;
        }

        return new compConstructor(settings);
    }
}