import { InputEvent } from "./InputEvent";
export declare class TouchInputEvent extends InputEvent<"touchstart" | "touchmove" | "touchend"> {
    id: number;
    x: number;
    y: number;
}
