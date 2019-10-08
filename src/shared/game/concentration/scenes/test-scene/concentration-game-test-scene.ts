import { Scene } from '../../../scene';
import { ElementRef } from '@angular/core';
import * as PIXI from 'pixi.js';
import { InputController } from '../../../input-controller';
import { Keyboard, Keys } from '../../../keyboard';
import { ConcentrationGame } from '../../concentration-game';

export class ConcentrationGameTestScene extends Scene {
    public testText: PIXI.Text;

    constructor(r: PIXI.IResourceDictionary, stageElement: ElementRef) {
        super(r, stageElement);

        this._setup();
        this.initInputController(this._getInputController())
    }

    protected onStart() {
        console.log("Concentration Game Test Scene Start!");
    }

    protected onStop() {
        console.log("Concentration Game Test Scene Stop!");
    }

    private _setup() {
        this.testText = new PIXI.Text('Test Scene', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
        this.testText.visible = true;
        this.addChild(this.testText);
    }

    private _getInputController(): InputController {
        return {
            onKeyDown: (e: KeyboardEvent) => this._onKeyDown(e)
        };
    }

    private _onKeyDown(e: KeyboardEvent) {
        if (Keyboard.isKeyActive(e, Keys.KeyF)) {
            if (this.isPaused()) {
                this.resume();
                console.log('ZOOM');
            }
            else {
                this.pause();
                console.log('UNZOOM');
            }
        }
        else if (Keyboard.isKeyActive(e, Keys.KeyX)) {
            ConcentrationGame.getInstance().goToPlayScene();
        }
    }
}