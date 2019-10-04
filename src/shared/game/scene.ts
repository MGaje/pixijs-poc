import { ElementRef } from '@angular/core';
import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

type DOMGameEventHandler = (...params: any[]) => void;

export abstract class Scene extends PIXI.Container {
    private _paused: boolean = false;
    private _stageElement: ElementRef;
    private _eventHandlers: Map<string, DOMGameEventHandler>;
    protected resources: PIXI.IResourceDictionary;

    constructor(r: PIXI.IResourceDictionary, stageElement: ElementRef) {
        super();

        this.resources = r;
        this._stageElement = stageElement;
        this._eventHandlers = new Map<string, DOMGameEventHandler>();

        this._baseSetup();
    }

    public update(delta: number) {
        if (!this.isPaused()) {
            this.onUpdate(delta);
            TWEEN.update();
        }

    }

    // Not named 'destroy' because that exists on type PIXI.Container.
    public cleanup() {
        this._eventHandlers.forEach((handler: DOMGameEventHandler, eventName: string) => {
            window.removeEventListener(eventName, handler);
        });

        this._eventHandlers.clear();
        this._stageElement = undefined;
    }

    protected onUpdate(delta: number) {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    protected getResource(file: string): PIXI.LoaderResource {
        return this.resources[`assets/${file}`];
    }

    public pause() {
        this._paused = true;
        this.onPause();
    }

    protected onPause() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    public resume() {
        this._paused = false;
        this.onResume();
    }

    protected onResume() {
        // Empty.
        // Instead of making this an abstract method, I decided to just have an empty
        // implementation. This is so you're not forced to provide your own empty
        // implementations in the derived classes.
    }

    public isPaused() {
        return this._paused;
    }

    protected initInput(config: { onKeyDown?: any, onKeyUp?: any}) {
        // Setup handlers.
        if (config.onKeyDown) {
            this._eventHandlers.set('keydown', config.onKeyDown);
            window.addEventListener('keydown', this._eventHandlers.get('keydown'));
        }

        if (config.onKeyUp) {
            this._eventHandlers.set('keyup', config.onKeyUp);
            window.addEventListener('keyup', this._eventHandlers.get('keyup'));
        }

        // Register the events on the DOM element.
    }

    private _baseSetup() {
        if (!this._stageElement) {
            console.error('Stage element must be defined before scene can be setup');
            return;
        }

        // Enable z-indexing.
        this.sortableChildren = true;
    }
}
