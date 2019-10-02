import * as PIXI from 'pixi.js';
import { ElementRef } from '@angular/core';

import { SceneManager, ISceneManager } from './scene-manager';

export interface IGame {
    init(stageElement: ElementRef, width: number, height: number): void;
    destroy(): void;
}

export abstract class FPGame implements IGame {
    public app: PIXI.Application;
    public sceneManager: SceneManager = new SceneManager();
    private _debugMode: boolean = false;
    private _assets: string[];

    constructor(debugMode?: boolean) {
        this._debugMode = !!debugMode;
    }

    public init(stageElement: ElementRef, width: number, height: number) {
        if (this.app) {
            return;
        }

        this.app = new PIXI.Application({
            width: width, height: height,
            antialias: true
        });

        stageElement.nativeElement.appendChild(this.app.view);

        this.load();
    }

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

    public destroy(): void {
        if (this.app) {
            console.error('PixiJS app not initialized! Cannot destroy!');
            return;
        }

        this.app.destroy(true);
    }

    protected abstract setupScenes(): void;
    protected abstract load(): void;

    protected setAssets(assets: string[]) {
        this._assets = assets;
    }

    protected goToScene(name: string): boolean {
        if (this.sceneManager.goToScene(name)) {
            this.app.stage.removeChildren(); // todo: this may need to be smarter if we want to have multiple scenes at once.
            this.app.stage.addChild(this.sceneManager.currentScene);

            return true;
        }

        return false;
    }

    protected get resources(): PIXI.IResourceDictionary {
        return this.app.loader.resources;
    }

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
