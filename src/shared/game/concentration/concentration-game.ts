import { FPGame } from '../fp-game';
import { GameController } from '../game-controller';
import { Scene } from '../scene';
import { ConcentrationGamePlayScene } from './scenes/play-scene/concentration-game-play-scene';
import { Keyboard } from '../keyboard';
import { ConcentrationGameTestScene } from './scenes/test-scene/concentration-game-test-scene';

enum Scenes {
    Play = 'play',
    Test = 'test'
};

export class ConcentrationGame extends FPGame {

    private static cardValues = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'
    ];

    private static cardSuits = [
        'spades', 'clubs', 'hearts', 'diamonds'
    ];

    public static cardAssets(): string[] {
        const assets = [];
        ConcentrationGame.cardValues.forEach(val => {
            ConcentrationGame.cardSuits.forEach(suit => {
                assets.push(`assets/cards/${val}_of_${suit}.png`);
            });
        });
        return assets;
    }

    protected load() {
        this.setAssets([
            'assets/card-back.png',
            'assets/whistle.mp3',
            'assets/loops/loop1.mp3',
            'assets/loops/loop2.mp3',
            'assets/loops/loop3.mp3',
            'assets/loops/loop4.mp3',
            'assets/applause.mp3',
            'assets/applause.ogg',
            'assets/bird.mp3',
            'assets/boing.mp3',
            'assets/buzzer.mp3',
            'assets/car.mp3',
            'assets/chime.mp3',
            'assets/mechanical.mp3',
            'assets/musical.mp3',
            'assets/sprite.mp3',
            'assets/success.mp3',
            'assets/sword.mp3',
            "assets/burst.png",
            ...ConcentrationGame.cardAssets()
        ]);

        Keyboard.init();
    }

    protected setupScenes(): void {
        // Setup play scene.
        this.sceneManager.addScene(
            Scenes.Play,
            new ConcentrationGamePlayScene(this.resources, this.getStageElement())
        );

        // Setup test scene.
        this.sceneManager.addScene(
            Scenes.Test,
            new ConcentrationGameTestScene(this.resources, this.getStageElement())
        );

        // Set play scene as the current scene.
        if (this.goToScene(Scenes.Play)) {
            console.log('play scene!');
        }
        else {
            console.log('could not set play scene');
        }
    }

    public goToPlayScene(): boolean {
        return this.goToScene(Scenes.Play);
    }

    public goToTestScene(): boolean {
        return this.goToScene(Scenes.Test);
    }
}
