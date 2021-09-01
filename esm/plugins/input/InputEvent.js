export class InputEvent {
    constructor(type) {
        this.type = type;
    }
    static init(event, type) {
        event.type = type;
        return event;
    }
}
