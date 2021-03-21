/// <reference types="node" />
import { EventEmitter } from "events";
export declare abstract class Canvas extends EventEmitter {
    private width;
    private height;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: number): this;
    setHeight(height: number): this;
    set(width: number, height: number): this;
    abstract onResize(): this;
}
