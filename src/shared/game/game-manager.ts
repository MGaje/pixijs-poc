import * as PIXI from 'pixi.js';
import { ElementRef } from '@angular/core';

import { SceneManager } from './scene-manager';

export class GameManager {
    public static app: PIXI.Application;
    public static sceneManager: SceneManager = new SceneManager();

    private _assets: string[] = [];

    public setAssets(assets: string[]) {
        this._assets = assets;
    }

    public static init(stageElement: ElementRef, width: number, height: number) {
        if (GameManager.app) {
            return;
        }

        GameManager.app = new PIXI.Application({
            width: width, height: height,
            antialias: true
        });

        stageElement.nativeElement.appendChild(GameManager.app.view);
    }

    public static load(assets: string[]) {
        if (!GameManager.app) {
            console.error('PixiJS app not initialized!');
            return;
        }

        GameManager.app.loader
            .add(assets)
            .on("progress", (loader: PIXI.Loader, resources: PIXI.LoaderResource) => {
                console.log("progress: " + loader.progress + "%");
            })
            .load(() => GameManager.app.ticker.add(delta => this._update(delta)));
    }

    public static destroy() {
        if (GameManager.app) {
            console.error('PixiJS app not initialized! Cannot destroy!');
            return;
        }

        GameManager.app.destroy(true);
    }

    private static _update(delta: number) {
        if (GameManager.sceneManager.currentScene) {
            GameManager.sceneManager.currentScene.update(delta);
        }
    }
}
