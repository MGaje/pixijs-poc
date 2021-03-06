/**
 * The foundation of what Fountas and Pinnell games will be created from.
 *
 * This file encapsulates some of the main elements of the game. It contains
 * the pixi.js application and a scene manager.
 *
 */

import * as PIXI from 'pixi.js';
import * as FontFaceObserver from 'fontfaceobserver';
import {ElementRef} from '@angular/core';

import {SceneManager, ISceneManager} from './scene-manager';
import {Scene} from './scene';
import {GameController} from './game-controller';
import { CanvasUtil } from './ui/util/canvas';
import { IStageMetrics } from './stage-metrics';

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

    private _fpsDisplay: PIXI.Text;
    private _fpsLastUpdate: number = 0;

    private _progress: PIXI.Graphics;
    private _logo: PIXI.Sprite;

    private readonly _targetRatio: number;

    /**
     * Constructor.
     *
     * @param debugMode Enable debug mode.
     */
    constructor(debugMode?: boolean) {
        this._debugMode = !!debugMode;
        this._targetRatio = 16 / 9;
    }

    /**
     * Initialize the game.
     *
     * @param stageElement The HTML element to create the stage/render area on.
     * @param width The width of the stage.
     * @param height The heigh of the stage.
     */
    public init(stageElement: ElementRef, yOffset?: number) {
        if (this.app) {
            return;
        }

        if (!yOffset) {
            yOffset = 0;
        }

        const w = window.innerWidth;
        const h = window.innerHeight - yOffset;

        // if (window.innerWidth / window.innerHeight >= this._targetRatio) {
        //     w = window.innerHeight * this._targetRatio;
        //     h = window.innerHeight;
        // }
        // else {
        //     w = window.innerWidth;
        //     h = window.innerHeight / this._targetRatio;
        // }

        this.app = new PIXI.Application({
            width: w, height: h,
            antialias: true,
            resolution: window.devicePixelRatio,
            backgroundColor: 0xEEEEEE
        });

        this._stageElement = stageElement;
        this._stageElement.nativeElement.appendChild(this.app.view);

        this._fpsDisplay = new PIXI.Text('', {fontSize: 14, fill: '#00ff00'});

        GameController.setGameInstance(this);

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

        this._setupLogo();
        this._setupProgressbar();

        this.app.loader
            .add(this._assets)
            .on('progress', (loader: PIXI.Loader, resources: PIXI.LoaderResource) => {
                console.log('progress: ' + loader.progress + '%');
                this._updateProgressbar(loader.progress / 100);
            })
            .load(() => {
                this.loadFonts().then(() => {
                    this._destroyProgressbarAndLogo();
                    this.setupScenes();
                    this.app.ticker.add(delta => this._update(delta, this.app.ticker));
                }, () => {
                    console.error("Couldn't load fonts");
                });
            });
    }

    /**
     * Obtain the metrics of the game stage.
     */
    public getStageMetrics(): IStageMetrics {
        return {
            width: this.app.view.width / window.devicePixelRatio,
            height: this.app.view.height / window.devicePixelRatio
        };
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
        GameController.setGameInstance(null);
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
    public goToScene(name: string): boolean {
        if (this.sceneManager.goToScene(name)) {
            this._resetStage(this.sceneManager.currentScene);

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
    private _update(delta: number, ticker: PIXI.Ticker) {
        // console.log("Last Time: " + ticker.lastTime);
        // console.log("Last deltaMS: " + ticker.deltaMS);
        // console.log("Last deltaTime: " + ticker.deltaTime);
        if (this._debugMode) {
            this._fpsLastUpdate += ticker.elapsedMS;
            if (this._fpsLastUpdate > 1000) {
                this._fpsDisplay.text = `${Math.round(ticker.FPS)}`;
                this._fpsLastUpdate = 0;
            }
        }

        if (this.sceneManager.currentScene) {
            this.sceneManager.currentScene.update(delta);
        } else {
            if (this._debugMode) {
                console.warn('Game - no current scene');
            }
        }
    }

    /**
     * Reset the stage to a scene.
     * @param s The scene to reset to.
     */
    private _resetStage(s: Scene) {
        this.app.stage.removeChildren();
        this.app.stage.addChild(this._fpsDisplay); // Better way to do this?
        this.app.stage.addChild(s);
    }

    private _setupLogo() {
        const l: PIXI.Loader = new PIXI.Loader();
        l.add('logo', 'assets/fpl-logo.png').load((loader, resources) => {
            this._logo = new PIXI.Sprite(resources.logo.texture);
            this._logo.anchor.set(0.5, 0.5);
            this._logo.position.set(
                ((this.app.view.width / window.devicePixelRatio) / 2),
                ((this.app.view.height / window.devicePixelRatio) / 2 - (this._logo.height / 2))
            );
            this.app.stage.addChild(this._logo);
        });
    }

    /**
     * Setup the loading progress bar.
     */
    private _setupProgressbar() {
        this._progress = new PIXI.Graphics();
        this._progress.beginFill(0xE1B022);
        this._progress.drawRect(0, 0, 250, 25);
        this._progress.beginHole();
        this._progress.drawRect(1, 1, 248, 23);
        this._progress.endHole();
        this._progress.endFill();

        this._setProgressBarPosition();

        this.app.stage.addChild(this._progress);
    }

    /**
     * Update the progress bar with the given percentage.
     * @param percentage Percentage of assets loaded.
     */
    private _updateProgressbar(percentage: number) {
        const holeX: number = 250 * percentage;
        const holeWidth: number = (250 - holeX) - 1;

        this._progress.clear();
        this._progress.beginFill(0xE1B022);
        this._progress.drawRect(0, 0, 250, 25);
        this._progress.beginHole();
        this._progress.drawRect(holeX, 1, holeWidth, 23);
        this._progress.endHole();
        this._progress.endFill();

        this._setProgressBarPosition();
    }

    /**
     * Helper function for setting progressbar position.
     */
    private _setProgressBarPosition() {
        this._progress.position.x = ((this.app.view.width / window.devicePixelRatio) / 2) - (this._progress.width / 2);
        this._progress.position.y = ((this.app.view.height / window.devicePixelRatio) / 2) - (this._progress.height / 2) + 15;
    }

    /**
     * Destroy the progress bar.
     */
    private _destroyProgressbarAndLogo() {
        this._progress.clear();
        this._progress.destroy();
        this._progress = null;

        this.app.stage.removeChild(this._logo);
    }

    /**
     * Load custom fonts.
     */
    private loadFonts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const chunkFont = new FontFaceObserver('chunkfive_printregular');
            const fontAwesome = new FontFaceObserver('FontAwesome');

            Promise.all([
                chunkFont.load(),
                fontAwesome.load()
            ])
            .then(() => resolve(true), () => reject(false));
        });
    }
}
