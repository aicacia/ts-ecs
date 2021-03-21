import { IJSONObject } from "@aicacia/json";
import { Plugin } from "../Plugin";
export declare class Time extends Plugin {
    static pluginPriority: number;
    private scale;
    private fixedDelta;
    private frame;
    private last;
    private current;
    private delta;
    private fps;
    private fpsFrame;
    private fpsLast;
    private startTime;
    private minDelta;
    private maxDelta;
    getStartTime(): number;
    getDelta(): number;
    getRealDelta(): number;
    getCurrent(): number;
    getMinDelta(): number;
    setMinDelta(minDelta: number): this;
    getMaxDelta(): number;
    setMaxDelta(maxDelta: number): this;
    getFrame(): number;
    getFps(): number;
    getScale(): number;
    setScale(scale: number): this;
    getFixedDelta(): number;
    setFixedDelta(fixedDelta: number): this;
    now(): number;
    onUpdate(): this;
    toJSON(): {
        frame: number;
        scale: number;
        fixedDelta: number;
    };
    fromJSON(json: IJSONObject): this;
}
