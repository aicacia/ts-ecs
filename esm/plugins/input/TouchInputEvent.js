import { InputEvent } from "./InputEvent";
export class TouchInputEvent extends InputEvent {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.x = 0;
        this.y = 0;
    }
}
