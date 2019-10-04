import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

import { FPGame, TestGame, ConcentrationGame } from '../../shared/game';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit, OnDestroy, AfterViewInit {

    public game: FPGame;

    @ViewChild('gameStage', {static: false}) public gameStage: ElementRef;

    constructor() { }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
        this.game = new ConcentrationGame();
        this.game.init(this.gameStage, 1000, 1000);
        this.game.start();
    }

    public ngOnDestroy() {
        this.game.destroy();
    }
}
