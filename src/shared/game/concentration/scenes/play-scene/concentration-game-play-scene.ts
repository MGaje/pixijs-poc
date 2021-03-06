import * as PIXI from 'pixi.js';
import {ElementRef} from '@angular/core';
import sound from 'pixi-sound';
import * as TWEEN from '@tweenjs/tween.js';
import {Scene} from '../../../scene';
import {Keyboard, Keys} from '../../../keyboard';
import {InputController} from '../../../input-controller';
import {ConcentrationGame} from '../../concentration-game';
import {GameController} from '../../../game-controller';
import { Button } from '../../../ui/components/button';
import { CanvasUtil } from '../../../ui/util/canvas';
import { DraggableWindow } from '../../../ui/components/draggable-window';
import { ConfirmDialogWindow } from 'src/shared/game/ui/components/confirm-dialog-window';
import { IStageMetrics } from 'src/shared/game/stage-metrics';
import { FontAwesomeSymbols } from 'src/shared/game/ui/util/font-awesome';

const cardWidth = 75;
const numCols = 16;

enum SceneResources {
    CardBackImage = 'card-back.png',
    WhistleSound = 'whistle.mp3',
    BurstImage = 'burst.png',
    ApplauseSound = 'applause.mp3',
    UndoButton = 'undo-200-8.png',
    UndoButtonActive = 'undo-active-200-8.png'
}

class Card {
    private static _lastId: number = 0;
    public id: number = 0;
    public cardFaceUp = false;
    public resource: PIXI.LoaderResource;
    public sprite: PIXI.Sprite;
    public scale: number;
    public anchor = 0.5;

    public constructor(resource: PIXI.LoaderResource) {
        this.resource = resource;
        this.sprite = new PIXI.Sprite(this.resource.texture);
        this.scale = cardWidth / this.sprite.width;
        this.id = ++Card._lastId;
    }
}

export class ConcentrationGamePlayScene extends Scene {
    public sound: PIXI.sound.Sound;
    public cards: Card[] = [];
    public selected: Card[] = [];
    public btn: Button;
    public btn2: Button;
    public win: ConfirmDialogWindow;
    public cover: PIXI.Graphics;

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
        // this.createCardStack();
        // // this.card = new PIXI.Sprite(this.getResource(SceneResources.CardBackImage).texture);
        // this.cards.forEach(card => {
        //     this.addChild(card.sprite);
        //     card.sprite.on('mouseup', () => this._onCardClick(card));
        //     card.sprite.on('touchend', () => this._onCardClick(card));
        // });

        const stageMetrics: IStageMetrics = GameController.getStageMetrics();

        this.cover = new PIXI.Graphics();
        this.cover.beginFill(0x000000);
        this.cover.drawRect(0, 0, stageMetrics.width, stageMetrics.height);
        this.cover.endFill();
        this.cover.alpha = 0.75;
        this.cover.zIndex = 1;
        this.cover.visible = false;

        this.addChild(this.cover);

        this.pauseText = new PIXI.Text('Paused', {fontFamily: 'Arial', fontSize: 48, fill: 0xff1010, align: 'center'});
        this.addChild(this.pauseText);

        this.btn = new Button({
            id: "button",
            //text: "Button Test",
            //symbol: FontAwesomeSymbols.Times,
            textColor: 0xffffff,
            texture: this.getResource(SceneResources.UndoButton).texture,
            textureActive: this.getResource(SceneResources.UndoButtonActive).texture,
            //backgroundColor: 0x0000ff,
            //backgroundHoverColor: 0x000064,
            //backgroundActiveColor: 0x00ff00,
            width: 100,
            height: 38.5,
            x: 100,
            y: 250,
            accessibilityTitle: 'Test Accessibility Title From Concentration Game Test Scene'
        });

        // this.btn.onPointerUp(() => {
        //     if (!this.win.isVisible()) {
        //         this.win.open();
        //     }
        //     else {
        //         this.win.close();
        //     }
        // });

        this.addChild(this.btn.getPixiSprite());

        this.btn2 = new Button({
            id: "button2",
            text: "Undo",
            symbol: FontAwesomeSymbols.Undo,
            textColor: 0xffffff,
            backgroundColor: 0x0000ff,
            //backgroundHoverColor: 0x000064,
            backgroundActiveColor: 0x00ff00,
            width: 200,
            height: 77,
            x: 477,
            y: 250,
            accessibilityTitle: 'Test Accessibility Title From Concentration Game Test Scene'
        });

        this.btn2.onPointerUp(() => {
            if (!this.win.isVisible()) {
                this.win.open();
            }
            else {
                this.win.close();
            }
        });

        this.addChild(this.btn2.getPixiSprite());

        // this.win = new DraggableWindow({
        //     id: "simplewin",
        //     backgroundColor: 0x006400,
        //     titlebarColor: 0x00ff00,
        //     title: "Title",
        //     alpha: 1,
        //     width: 500,
        //     height: 500,
        //     x: 400,
        //     y: 400
        // });

        // this.win.onBeforeLoad(() => {
        //     alert('some loading stuff');
        // });

        // this.win.onBeforeUnload(() => {
        //     alert('some cleanup stuff');
        // });

        this.win = new ConfirmDialogWindow({
            id: 'confirmDialog',
            message: 'Are you sure you want to undo the last move?',
            yesOptionText: 'Yes, Undo',
            noOptionText: 'No',
            backgroundColor: 0xffffff,
            alpha: 1,
            width: 600,
            height: 250,
            x: (stageMetrics.width - 600) / 2,
            y: (stageMetrics.height - 250) / 2
        });

        this.win.onConfirm(() => {
            sound.play(this.getResourcePath(SceneResources.ApplauseSound), { 'complete': () => {
                console.log('sound complete!');
            }});
        });

        this.win.onBeforeLoad(() => {
            this.cover.visible = true;
        });

        this.win.onClose(() => {
            this.cover.visible = false;
        });

        this.addChild(this.win.getPixiSprite());
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

            const x = (col * (cardWidth + 10)) + (cardWidth / 2);
            const y = row * (card.sprite.height + 10) + (card.sprite.height / 2);

            card.sprite.position.x = Math.random() * 600;
            card.sprite.position.y = -Math.random() * 100 - 100;
            card.sprite.rotation = Math.random() * 2 * 3.14;

            this.createTween(card.sprite)
                .onStart(() => {
                    card.sprite.interactive = false;
                    card.sprite.buttonMode = false;
                })
                .to({ x: x, y: y, rotation: 0}, 2400 + Math.random() * 1200)
                .easing(TWEEN.Easing.Elastic.Out)
                .onComplete(() => {
                    card.sprite.interactive = true;
                    card.sprite.buttonMode = true;
                })
            .start();

            card.sprite.zIndex = 2;

            const atMaxCol = (col + 1) >= numCols;
            row = atMaxCol ? row + 1 : row;
            col = atMaxCol ? 0 : col + 1;
        });

        this.pauseText.visible = false;
    }

    private _onCardClick(card: Card) {
        if (this.selected.some(x => x.id === card.id)) {
            // Card is flipped over
            return;
        }

        sound.play(this.getResourcePath(SceneResources.WhistleSound));

        const scale = {y: card.sprite.scale.y};

        this.createTween(scale)
            .onStart(() => {
                card.sprite.interactive = false;
            })
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
                .onComplete(() => {
                    card.sprite.interactive = true;
                    this.selected.push(card);

                    if (this.selected.length === 2) {
                        this._removeCards();
                    }
                })
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
        else if (Keyboard.isKeyActive(e, Keys.KeyP)) {
            this.children.filter(x => x.interactive).forEach(x => {
                x.interactive = false;
                x.buttonMode = false;
            });
        }
    }

    private _removeCards() {
        if (this.selected.length < 2) {
            return;
        }

        this._removeCardTween(this.selected[0]);
        this._removeCardTween(this.selected[1]);
    }

    private _removeCardTween(c: Card): TWEEN.Tween {
        const tweenProperties = {
            width: c.sprite.width,
            height: c.sprite.height,
            x: c.sprite.position.x,
            y: c.sprite.position.y,
            alpha: c.sprite.alpha
        };

        return this.createTween(tweenProperties)
            .delay(1000)
            .to({ width: "+100", height: "+100", x: "-50", y: "-50", alpha: 0}, 200)
            .onUpdate(update => {
                c.sprite.width = update.width;
                c.sprite.height = update.height;
                c.sprite.x = update.x;
                c.sprite.y = update.y;
                c.sprite.alpha = update.alpha;
            })
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                this.removeChild(c.sprite);
                this.selected = this.selected.filter(x => x.id !== c.id);
            })
        .start();
    }
}
