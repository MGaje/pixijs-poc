import { FPGame } from '../fp-game';
import { Scene } from '../scene';
import { TestGamePlayScene } from './scenes/test-game-play-scene';

enum Scenes {
    Play = 'play'
};

export class TestGame extends FPGame {

    protected load() {
        this.setAssets([
            'assets/blob.png',
            'assets/success.mp3'
        ]);

        // Any additional load logic.
    }

    protected setupScenes(): void {
        // Setup play scene.
        this.sceneManager.addScene(
            Scenes.Play,
            new TestGamePlayScene(this.resources, this.getStageElement())
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
