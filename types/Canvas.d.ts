import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface Entity {
    on(event: "resize", listener: (width: number, height: number, prevWidth: number, prevHeight: number) => void): this;
    off(event: "resize", listener: (width: number, height: number, prevWidth: number, prevHeight: number) => void): this;
}
export declare abstract class Canvas extends ToFromJSONEventEmitter {
    private width;
    private height;
    getWidth(): number;
    getHeight(): number;
    setWidth(width: number): this;
    setHeight(height: number): this;
    set(width: number, height: number): this;
    abstract onResize(): this;
}
