import { Canvas } from "../Canvas";
export declare class WebCanvas extends Canvas {
    private canvas;
    constructor(canvas?: HTMLCanvasElement);
    getElement(): HTMLCanvasElement;
    onResize(): this;
    getImageURI(): string;
    getStream(fps?: number): MediaStream;
}
