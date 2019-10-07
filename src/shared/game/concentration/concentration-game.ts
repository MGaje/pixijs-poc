import { FPGame } from '../fp-game';
import { Scene } from '../scene';
import { ConcentrationGamePlayScene } from './scenes/concentration-game-play-scene';
import { Keyboard } from '../keyboard';

enum Scenes {
    Play = 'play'
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

        // Set play scene as the current scene.
        if (this.goToScene(Scenes.Play)) {
            console.log('play scene!');
        }
        else {
            console.log('could not set play scene');
        }
    }
}
