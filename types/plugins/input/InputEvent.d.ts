export declare class InputEvent<T extends string = string> {
    type: T;
    constructor(type: T);
    static init<T extends string = string>(event: InputEvent, type: T): InputEvent;
}
