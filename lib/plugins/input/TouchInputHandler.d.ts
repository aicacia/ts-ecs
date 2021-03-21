import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { TouchInputEvent } from "./TouchInputEvent";
export declare class TouchInputHandler extends InputHandler {
    onEvent(time: Time, event: TouchInputEvent): this;
}
