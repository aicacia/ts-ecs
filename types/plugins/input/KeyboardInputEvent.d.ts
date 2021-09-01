import { InputEvent } from "./InputEvent";
export declare class KeyboardInputEvent extends InputEvent<"keyup" | "keydown"> {
    code: string;
}
