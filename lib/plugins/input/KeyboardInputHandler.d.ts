import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { KeyboardInputEvent } from "./KeyboardInputEvent";
export declare class KeyboardInputHandler extends InputHandler {
    onEvent(time: Time, event: KeyboardInputEvent): this;
}
