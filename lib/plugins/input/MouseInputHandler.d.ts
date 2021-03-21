import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { MouseInputEvent } from "./MouseInputEvent";
import { MouseWheelInputEvent } from "./MouseWheelInputEvent";
export declare class MouseInputHandler extends InputHandler {
    onEvent(time: Time, event: MouseInputEvent | MouseWheelInputEvent): this;
    onAfterUpdate(): this;
}
