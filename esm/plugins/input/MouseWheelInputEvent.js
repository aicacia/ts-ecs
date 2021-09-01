import { InputEvent } from "./InputEvent";
export class MouseWheelInputEvent extends InputEvent {
    constructor() {
        super(...arguments);
        this.wheel = 0;
    }
}
