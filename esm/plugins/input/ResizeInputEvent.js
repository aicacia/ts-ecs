import { InputEvent } from "./InputEvent";
export class ResizeInputEvent extends InputEvent {
    constructor() {
        super(...arguments);
        this.width = 0;
        this.height = 0;
    }
}
