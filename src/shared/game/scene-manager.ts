import * as PIXI from 'pixi.js';
import { Scene } from './scene';

export interface ISceneManager {
    addScene(name: string, s: Scene): void;
    hasScene(name: string): boolean;
    goToScene(name: string): boolean;
    removeScene(name: string): boolean;
    clearAll(): void;
}

export class SceneManager implements ISceneManager {
    private _scenes: Map<string, Scene> = new Map<string, Scene>();
    public currentScene: Scene;

    public addScene(name: string, s: Scene): void {
        if (this._scenes[name]) {
            // This function is specifically for creating a scene.
            return null;
        }

        this._scenes[name] = s;
    }

    public hasScene(name: string): boolean {
        return this._scenes.has(name);
    }

    public goToScene(name: string): boolean {
        if (!this._scenes[name]) {
            return false;
        }

        if (this.currentScene) {
            this.currentScene.pause();
        }

        this.currentScene = this._scenes[name];
        this.currentScene.resume();

        return true;
    }

    public removeScene(name: string): boolean {
        if (!this._scenes[name]) {
            return false;
        }

        this._scenes[name].cleanup();
        this._scenes.delete(name);

        return true;
    }

    public clearAll() {
        this._scenes.forEach((scene: Scene, name: string) => {
            scene.cleanup();
        });

        this._scenes.clear();
    }
}
