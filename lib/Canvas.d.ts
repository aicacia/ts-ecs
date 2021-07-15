/// <reference types="node" />
import { EventEmitter } from "events";
export interface Entity {
    on(event: "resize", listener: (width: number, height: number, origWidth: number, origHeight: number) => void): this;
    off(event: "resize", listener: (width: number, height: number, origWidth: number, origHeight: number) => void): this;
}
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
