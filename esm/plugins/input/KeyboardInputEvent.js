import { InputEvent } from "./InputEvent";
export class KeyboardInputEvent extends InputEvent {
    constructor() {
        super(...arguments);
        this.code = "";
    }
}
