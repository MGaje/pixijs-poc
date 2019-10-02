import * as PIXI from 'pixi.js';
import { Scene } from './scene';

export class SceneManager {
    private _scenes: Map<string, Scene> = new Map<string, Scene>();
    public currentScene: Scene;

    public createScene(name: string): Scene {
        if (this._scenes[name]) {
            // This function is specifically for creating a scene.
            return null;
        }

        const scene: Scene = new Scene();
        this._scenes[name] = scene;

        return scene;
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
}
