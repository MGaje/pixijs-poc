/**
 * A scene is the collection of objects that will be rendered to the stage.
 * 
 * Typically there will just be one scene (the 'play' scene). But it's setup in such a way
 * that will allow us to support multiple scenes in the case of menus and such.
 */

import { ElementRef } from '@angular/core';
import * as PIXI from 'pixi.js';
import Sound from 'pixi-sound';
import * as TWEEN from '@tweenjs/tween.js';
import { InputController } from './input-controller';

type DOMGameEventHandler = (...params: any[]) => void;

/**
 * Scene class.
 */
export abstract class Scene extends PIXI.Container {
    private _paused: boolean = false;
    private _stageElement: ElementRef;
    private _eventHandlers: Map<string, DOMGameEventHandler>;
    private _tweenGroup: TWEEN.Group;
    private _tweens: TWEEN.Tween[];
    protected resources: PIXI.IResourceDictionary;

    /**
     * Constructor.
     * @param r The resources loaded for the game.
     * @param stageElement The HTML element the stage is displayed in.
     */
    constructor(r: PIXI.IResourceDictionary, stageElement: ElementRef) {
        super();

        this.resources = r;
        this._stageElement = stageElement;

        this._baseSetup();
    }

    /**
     * Update the scene
     * @param delta The time delta between frames.
     */
    public update(delta: number) {
        if (!this.isPaused()) {
            this.onUpdate(delta);
            this._tweenGroup.update();
        }

    }

    /**
     * Clean the scene up.
     *
     * @remarks
     * Not named 'destroy' because that exists on type PIXI.Container.
     */
    public cleanup() {
        this._eventHandlers.forEach((handler: DOMGameEventHandler, eventName: string) => {
            window.removeEventListener(eventName, handler);
        });

        this._eventHandlers.clear();
        this._tweenGroup.removeAll();
        this._tweens = [];
        this._stageElement = undefined;
    }

    /**
     * Logic to run from specific scenes (derived classes).
     * @param delta The time delta between frames.
     */
    protected onUpdate(delta: number) {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    /**
     * Helper method to get a specific resource from the loaded resources.
     * @param file 
     */
    protected getResource(file: string): PIXI.LoaderResource {
        return this.resources[`assets/${file}`];
    }

    /**
     * Pause the scene.
     */
    public pause() {
        this._paused = true;

        this._tweens.forEach(x => {
            x.pause();
        });

        Sound.pauseAll();
        this.interactiveChildren = false;

        this.onPause();
    }

    /**
     * Additional logic to run when a scene is paused.
     * For use in specific scenes (derived classes).
     */
    protected onPause() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    /**
     * Resume a paused scene.
     */
    public resume() {
        this._paused = false;

        this._tweens.forEach(x => {
            x.resume();
        });

        Sound.resumeAll();
        this.interactiveChildren = true;

        this.onResume();
    }

    /**
     * Additional logic to run when a scene is resumed.
     * For use in specific scenes (derived classes).
     */
    protected onResume() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    /**
     * Is the scene paused?
     */
    public isPaused() {
        return this._paused;
    }

    /**
     * Start the scene.
     */
    public start() {
        this._eventHandlers.forEach((handler: DOMGameEventHandler, eventName: string) => {
            window.addEventListener(eventName, handler);
        });

        this.interactiveChildren = true;
        this.onStart();
    }

    /**
     * Additional logic to run when a scene is started.
     * For use in specific scenes (derived classes).
     */
    protected onStart() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    /**
     * Stop the scene.
     */
    public stop() {
        this._paused = false;

        this._eventHandlers.forEach((handler: DOMGameEventHandler, eventName: string) => {
            window.removeEventListener(eventName, handler);
        });

        this.interactiveChildren = false;
        this.onStop();
    }

    /**
     * Additional logic to run when a scene is stopped.
     * For use in specific scenes (derived classes).
     */
    protected onStop() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    /**
     * Initialize the input for the scene.
     * @param config The input configuration.
     */
    protected initInputController(c: InputController) {
        if (c.onKeyDown) {
            this._eventHandlers.set('keydown', c.onKeyDown);
        }

        if (c.onKeyUp) {
            this._eventHandlers.set('keyup', c.onKeyUp);
        }
    }

    /**
     * Create tween.
     * @param obj The properties to tween.
     */
    protected createTween(obj?: any): TWEEN.Tween {
        const t = new TWEEN.Tween(obj, this._tweenGroup)
            .onComplete(() => {
                this._tweens = this._tweens.filter(x => x.getId() !== t.getId());
            });

        this._tweens.push(t);

        return t;
    }

    /**
     * Base setup for any particular scene.
     */
    private _baseSetup() {
        if (!this._stageElement) {
            console.error('Stage element must be defined before scene can be setup');
            return;
        }

        // Enable z-indexing.
        this.sortableChildren = true;

        // Create container for event handlers.
        this._eventHandlers = new Map<string, DOMGameEventHandler>();

        // Create tween group for the scene.
        this._tweenGroup = new TWEEN.Group();
        this._tweens = [];
    }
}
