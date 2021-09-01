import type { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import type { KeyboardInputEvent } from "./KeyboardInputEvent";
export declare class KeyboardInputHandler extends InputHandler {
    onEvent(time: Time, event: KeyboardInputEvent): this;
}
