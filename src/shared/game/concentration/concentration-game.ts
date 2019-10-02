import { FPGame } from '../fp-game';
import { Scene } from '../scene';
import { ConcentrationGamePlayScene } from './scenes/concentration-game-play-scene';

enum Scenes {
    Play = 'play'
};

export class ConcentrationGame extends FPGame {

    protected load() {
        this.setAssets([
            'assets/cat.png',
            'assets/whistle.mp3'
        ]);

        // Any additional load logic.
    }

    protected setupScenes(): void {
        // Setup play scene.
        this.sceneManager.addScene(
            Scenes.Play,
            new ConcentrationGamePlayScene(this.resources)
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
