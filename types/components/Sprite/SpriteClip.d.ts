import type { IJSONObject } from "@aicacia/json";
export declare class SpriteClip {
    private duration;
    private x;
    private y;
    private width;
    private height;
    getDuration(): number;
    setDuration(duration: number): this;
    getX(): number;
    setX(x: number): this;
    getY(): number;
    setY(y: number): this;
    getWidth(): number;
    setWidth(width: number): this;
    getHeight(): number;
    setHeight(height: number): this;
    toJSON(): {
        duration: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    fromJSON(json: IJSONObject): this;
}
