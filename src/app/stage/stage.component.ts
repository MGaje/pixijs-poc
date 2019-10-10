import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { FPGame, TestGame, ConcentrationGame } from '../../shared/game';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StageComponent implements OnInit, OnDestroy, AfterViewInit {

    public game: FPGame;

    @ViewChild('gameStage', {static: false}) public gameStage: ElementRef;
    @ViewChild('header', {static: false}) public header: ElementRef;

    constructor() { }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
        this.game = new ConcentrationGame(true);
        this.game.init(this.gameStage, this._getHeaderHeight());
        this.game.start();
    }

    public ngOnDestroy() {
        this.game.destroy();
    }

    private _getHeaderHeight(): number {
        // const styleList: string[] = [
        //     "margin-top",
        //     "margin-bottom",
        //     "border-top",
        //     "border-bottom",
        //     "padding-top",
        //     "padding-bottom",
        //     "height"
        // ];

        // const style = window.getComputedStyle(this.header.nativeElement);
        // return styleList
        //     .map(x => parseInt(style.getPropertyValue(x)))
        //     .reduce((prev, cur) => prev + cur);

        return this.header.nativeElement.getBoundingClientRect().height;
    }
}
