import * as PIXI from 'pixi.js';

/**
 * Canvas utility class.
 * Used when we need an auxilary canvas to pull off some more complicated features.
 */
export class CanvasUtil {

    public static gradient(fromColor: string, toColor: string, w: number = 100, h: number = 100): PIXI.Texture {
        const c: HTMLCanvasElement = document.createElement("canvas");
        const ctx: CanvasRenderingContext2D = c.getContext("2d");

        // Last two parameters here are x2 and y2 not necessarily a width/height.
        const grd: CanvasGradient = ctx.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, fromColor);
        grd.addColorStop(1, toColor);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        return PIXI.Texture.from(c);
    }
}