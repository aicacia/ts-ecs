import { InputEvent } from "./InputEvent";
export declare class MouseInputEvent extends InputEvent<"mousemove" | "mousedown" | "mouseup" | "mouseleave"> {
    button: number;
    x: number;
    y: number;
}
