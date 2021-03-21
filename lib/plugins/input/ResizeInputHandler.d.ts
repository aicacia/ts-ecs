import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { ResizeInputEvent } from "./ResizeInputEvent";
export declare class ResizeInputHandler extends InputHandler {
    onEvent(_time: Time, event: ResizeInputEvent): this;
}
