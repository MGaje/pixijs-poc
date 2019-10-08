/**
 * The foundation of what Fountas and Pinnell games will be created from.
 *
 * This file encapsulates some of the main elements of the game. It contains
 * the pixi.js application and a scene manager.
 *
 */

import * as PIXI from 'pixi.js';
import { ElementRef } from '@angular/core';

import { SceneManager, ISceneManager } from './scene-manager';

/**
 * Interface for what our games must implement.
 */
export interface IGame {
    init(stageElement: ElementRef, width: number, height: number): void;
    start(): void;
    destroy(): void;
}

/**
 * Fountas and Pinell Game
 */
export abstract class FPGame implements IGame {
    public app: PIXI.Application;
    public sceneManager: SceneManager = new SceneManager();

    private _stageElement: ElementRef;
    private _debugMode: boolean = false;
    private _assets: string[];

    /**
     * Constructor.
     *
     * @param debugMode Enable debug mode.
     */
    constructor(debugMode?: boolean) {
        this._debugMode = !!debugMode;
    }

    /**
     * Initialize the game.
     *
     * @param stageElement The HTML element to create the stage/render area on.
     * @param width The width of the stage.
     * @param height The heigh of the stage.
     */
    public init(stageElement: ElementRef, width: number, height: number) {
        if (this.app) {
            return;
        }

        this.app = new PIXI.Application({
            width: width, height: height,
            antialias: true
        });

        this._stageElement = stageElement;
        this._stageElement.nativeElement.appendChild(this.app.view);

        this.load();
    }

    /**
     * Start the game.
     */
    public start() {
        if (!this.app) {
            console.error('PixiJS app not initialized!');
            return;
        }

        if (!this._assets) {
            console.error('No assets loaded for the game');
            return;
        }

        this.app.loader
            .add(this._assets)
            .on("progress", (loader: PIXI.Loader, resources: PIXI.LoaderResource) => {
                console.log("progress: " + loader.progress + "%");
            })
            .load(() => {
                this.setupScenes();
                this.app.ticker.add(delta => this._update(delta));
            });
    }

    /**
     * Destroy the game in the hopes it might release memory back into
     * the hopeless void the browser created.
     */
    public destroy(): void {
        if (this.app) {
            console.error('PixiJS app not initialized! Cannot destroy!');
            return;
        }

        this.app.destroy(true);
        this.sceneManager.clearAll();
    }

    /**
     * Setup the different scenes for the game. This is deferred to the specific game
     * (in the derived class).
     */
    protected abstract setupScenes(): void;

    /**
     * Any load logic for a particular game. This is deferred to the specific game
     * (in the derived class).
     */
    protected abstract load(): void;

    /**
     * Set the assets the game needs. Right now this will be for every scene.
     * @param assets The assets to load for the game.
     */
    protected setAssets(assets: string[]) {
        this._assets = assets;
    }

    /**
     * Go/resume the specified scene.
     * @param name The name of the scene to go to.
     */
    protected goToScene(name: string): boolean {
        if (this.sceneManager.goToScene(name)) {
            this.app.stage.removeChildren(); // todo: this may need to be smarter if we want to have multiple scenes at once.
            this.app.stage.addChild(this.sceneManager.currentScene);

            return true;
        }

        return false;
    }

    /**
     * Helper function to get the resources directly from the pixijs app.
     */
    protected get resources(): PIXI.IResourceDictionary {
        return this.app.loader.resources;
    }

    /**
     * Helper function to get the stage element in specific games (derived classes).
     */
    protected getStageElement(): ElementRef {
        return this._stageElement;
    }

    /**
     * Game update loop.
     * @param delta The time delta between frames.
     */
    private _update(delta: number) {
        if (this.sceneManager.currentScene) {
            this.sceneManager.currentScene.update(delta);
        }
        else {
            if (this._debugMode) {
                console.warn("Game - no current scene");
            }
        }
    }
}
