export class InputEvent<T extends string = string> {
  type: T;

  constructor(type: T) {
    this.type = type;
  }

  static init<T extends string = string>(
    event: InputEvent,
    type: T
  ): InputEvent {
    event.type = type;
    return event;
  }
}
