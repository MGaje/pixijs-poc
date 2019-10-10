import * as PIXI from 'pixi.js';
import {ElementRef} from '@angular/core';
import 'pixi-sound';
import * as TWEEN from '@tweenjs/tween.js';
import {Scene} from '../../../scene';
import {Keyboard, Keys} from '../../../keyboard';
import {InputController} from 'src/shared/game/input-controller';
import {ConcentrationGame} from '../../concentration-game';
import {GameController} from 'src/shared/game/game-controller';

const cardWidth = 75;
const numCols = 16;

enum SceneResources {
    CardBackImage = 'card-back.png',
    WhistleSound = 'whistle.mp3'
}

class Card {
    public cardFaceUp = false;
    public resource: PIXI.LoaderResource;
    public sprite: PIXI.Sprite;
    public scale: number;
    public anchor = 0.5;


    public constructor(resource: PIXI.LoaderResource) {
        this.resource = resource;
        this.sprite = new PIXI.Sprite(this.resource.texture);
        this.scale = cardWidth / this.sprite.width;
    }
}

export class ConcentrationGamePlayScene extends Scene {
    public sound: PIXI.sound.Sound;
    public cards: Card[] = [];

    public pauseText: PIXI.Text;

    constructor(r: PIXI.IResourceDictionary, stageElement: ElementRef) {
        super(r, stageElement);

        this._init();
        this.initInputController(this._getInputController());
    }

    protected onUpdate(delta: number) {
    }

    protected onPause() {
        this.pauseText.visible = true;
    }

    protected onResume() {
        this.pauseText.visible = false;
    }

    protected onStart() {
        this._reset();
        console.log('Concentration Game Play Scene Start!');
    }

    protected onStop() {
        console.log('Concentration Game Play Scene Stop!');
    }

    private shuffle(array: any[]): any[] {
        return array.sort(() => Math.random() - 0.5);
    }

    private createCardStack(): void {
        // double this, so there are two of each card
        const assets = [...ConcentrationGame.cardAssets(), ...ConcentrationGame.cardAssets()];
        this.cards = this.shuffle(assets).map(asset => {
            return new Card(this.getResource(asset));
        });
    }

    private _init() {
        this.createCardStack();
        // this.card = new PIXI.Sprite(this.getResource(SceneResources.CardBackImage).texture);
        this.cards.forEach(card => {
            this.addChild(card.sprite);
            card.sprite.on('mouseup', () => this._onCardClick(card));
            card.sprite.on('touchend', () => this._onCardClick(card));
        });


        this.pauseText = new PIXI.Text('Paused', {fontFamily: 'Arial', fontSize: 48, fill: 0xff1010, align: 'center'});
        this.addChild(this.pauseText);
    }

    private _reset() {
        let row = 0;
        let col = 0;
        this.cards.forEach(card => {
            card.cardFaceUp = false;
            card.sprite.texture = this.getResource(SceneResources.CardBackImage).texture;

            card.sprite.scale.x = card.scale;
            card.sprite.scale.y = card.scale;
            card.sprite.anchor.x = card.anchor;
            card.sprite.anchor.y = card.anchor;
            card.sprite.position.x = (col * (cardWidth + 10)) + (cardWidth / 2);
            card.sprite.position.y = row * (card.sprite.height + 10) + (card.sprite.height / 2);
            card.sprite.interactive = true;
            card.sprite.buttonMode = true;
            card.sprite.zIndex = 2;

            const atMaxCol = (col + 1) >= numCols;
            row = atMaxCol ? row + 1 : row;
            col = atMaxCol ? 0 : col + 1;
        });

        this.pauseText.visible = false;
    }

    private _onCardClick(card: Card) {
        this.getResource(SceneResources.WhistleSound).sound.play();

        const scale = {y: card.sprite.scale.y};

        this.createTween(scale)
            .onStart(() => card.sprite.interactive = false)
            .to({y: 0}, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(result => {
                card.sprite.scale.y = result.y;
            })
            .chain(this.createTween({y: 0})
                .onStart(() => {
                    if (card.cardFaceUp) {
                        card.sprite.texture = this.getResource(SceneResources.CardBackImage).texture;
                        card.cardFaceUp = false;
                    } else {
                        card.sprite.texture = card.resource.texture;
                        card.cardFaceUp = true;
                    }
                })
                .to({y: card.scale}, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(result => {
                    card.sprite.scale.y = result.y;
                })
                .onComplete(() => card.sprite.interactive = true)
            )
            .start();
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
                console.log('resume!');
            } else {
                this.pause();
                console.log('pause!');
            }
        } else if (Keyboard.isKeyActive(e, Keys.KeyX)) {
            GameController.getGameInstance<ConcentrationGame>().goToTestScene();
        }
    }
}
