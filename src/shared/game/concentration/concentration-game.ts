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

    protected load() {
        this.setAssets([
            'assets/card-back.png',
            'assets/ace_of_spades.png',
            'assets/whistle.mp3'
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
