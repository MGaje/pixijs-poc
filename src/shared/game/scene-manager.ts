/**
 * Facilitates scene management.
 */

import * as PIXI from 'pixi.js';
import { Scene } from './scene';

/**
 * Interface for what the scene manager must implement.
 */
export interface ISceneManager {
    addScene(name: string, s: Scene): void;
    hasScene(name: string): boolean;
    goToScene(name: string): boolean;
    removeScene(name: string): boolean;
    clearAll(): void;
}

/**
 * Definition of the SceneManager.
 */
export class SceneManager implements ISceneManager {
    private _scenes: Map<string, Scene> = new Map<string, Scene>();
    public currentScene: Scene;

    /**
     * Add scene to the list of scenes.
     * @param name The name of the scene.
     * @param s The instantiated scene.
     */
    public addScene(name: string, s: Scene): void {
        if (this._scenes[name]) {
            // This function is specifically for creating a scene.
            return null;
        }

        this._scenes[name] = s;
    }

    /**
     * Determines if the specified scene exists in the pool.
     * @param name The name of the scene.
     */
    public hasScene(name: string): boolean {
        return this._scenes.has(name);
    }

    /**
     * Go to specified scene (and set to current).
     * @param name The name of the scene.
     */
    public goToScene(name: string): boolean {
        if (!this._scenes[name]) {
            return false;
        }

        if (this.currentScene) {
            this.currentScene.stop();
        }

        this.currentScene = this._scenes[name];
        this.currentScene.start();

        return true;
    }

    /**
     * Remove a scene from the pool.
     * @param name The name of the scene.
     */
    public removeScene(name: string): boolean {
        if (!this._scenes[name]) {
            return false;
        }

        this._scenes[name].cleanup();
        this._scenes.delete(name);

        return true;
    }

    /**
     * Clear all scenes from the pool.
     */
    public clearAll() {
        this._scenes.forEach((scene: Scene, name: string) => {
            scene.cleanup();
        });

        this._scenes.clear();
    }
}
