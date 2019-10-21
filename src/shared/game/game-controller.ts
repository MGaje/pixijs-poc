import { FPGame } from './fp-game';
import { IStageMetrics } from './stage-metrics';

/**
 * Static game controller class that is used to help control flow
 * and provide data on the currently running game.
 */
export class GameController {
    private static _gameInstance: FPGame;

    /**
     * Get the currently running game instance.
     */
    public static getGameInstance<T extends unknown>(): T {
        return GameController._gameInstance as T;
    }

    /**
     * Set the currently running game instance.
     * @param g The game that is currently running.
     */
    public static setGameInstance(g: FPGame) {
        GameController._gameInstance = g;
    }

    /**
     * Go to the specified scene.
     * @param name The name of the scene.
     */
    public static gotoScene(name: string): boolean {
        if (!GameController._gameInstance) {
            return false;
        }

        return GameController.getGameInstance<any>().gotoScene(name);
    }

    /**
     * Get stage metrics.
     */
    public static getStageMetrics(): IStageMetrics {
        if (!GameController._gameInstance) {
            return {
                width: 0,
                height: 0
            };
        }

        return GameController._gameInstance.getStageMetrics();
    }
}