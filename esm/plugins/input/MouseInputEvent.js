import { InputEvent } from "./InputEvent";
export class MouseInputEvent extends InputEvent {
    constructor() {
        super(...arguments);
        this.button = 0;
        this.x = 0;
        this.y = 0;
    }
}
