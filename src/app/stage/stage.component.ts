import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as PIXI from 'pixi.js';
import * as ui from 'pixi-ui';

import { GameManager, Scene } from '../../shared/game';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit, OnDestroy {

    // public app: PIXI.Application;
    // public cat: PIXI.Sprite;


    @ViewChild('gameStage', {static: false}) public gameStage: ElementRef;

    constructor() { }

    public ngOnInit() {

        GameManager.init(this.gameStage, 256, 256);
        GameManager.load(["assets/cat.png"]);


        //!!!!!!!!!!!!!!!!!
        // GameManager should be inherited from such that each specific game can specify
        // its own logic.
        //!!!!!!!!!!!!!!!!!
        
        const playScene: Scene = GameManager.sceneManager.createScene('play');
        playScene.onUpdate((delta: number) => {
            //
            // Scenes control assets?
            //
        });

        // this.app = new PIXI.Application({
        //     width: 256,
        //     height: 256,
        //     antialias: true
        // });
        // document.body.appendChild(this.app.view);

        // if (PIXI.utils.isWebGLSupported()) {
        //     console.log('WebGL is supported!');
        // }
        // else {
        //     console.log('WebGL is NOT supported!');
        // }

        // this.app.loader
        //     .add("assets/cat.png")
        //     .on("progress", (loader: PIXI.Loader, resources: PIXI.LoaderResource) => {
        //         console.log("progress: " + loader.progress + "%");
        //     })
        //     .load(() => {
        //         this.cat = new PIXI.Sprite(this.app.loader.resources['assets/cat.png'].texture);
        //         this.app.stage.addChild(this.cat);

        //         let test = new ui.Button({ text: 'Submit'});

        //         this.app.ticker.add(delta => this.gameLoop(delta));
        //     })
    }

    public ngOnDestroy() {
        GameManager.destroy();
    }
}
