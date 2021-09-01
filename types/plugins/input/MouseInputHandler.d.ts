import type { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import type { MouseInputEvent } from "./MouseInputEvent";
import type { MouseWheelInputEvent } from "./MouseWheelInputEvent";
export declare class MouseInputHandler extends InputHandler {
    onEvent(time: Time, event: MouseInputEvent | MouseWheelInputEvent): this;
    onAfterUpdate(): this;
}
