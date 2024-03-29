import type { IConstructor } from "@aicacia/core";
import { Plugin } from "../../Plugin";
import { Time } from "../Time";
import { InputAxis } from "./InputAxis";
import { InputButton } from "./InputButton";
import { InputHandler } from "./InputHandler";
import { MouseInputHandler } from "./MouseInputHandler";
import { KeyboardInputHandler } from "./KeyboardInputHandler";
import type { EventListener } from "./EventListener";
import { TouchInputHandler } from "./TouchInputHandler";
import type { InputEvent } from "./InputEvent";
import { ResizeInputHandler } from "./ResizeInputHandler";
import { IJSONObject, isJSONArray } from "@aicacia/json";

export type IInputEventTypes = {
  "add-input_handler": (handler: InputHandler) => void;
  "remove-input_handler": (handler: InputHandler) => void;
  "add-event_listener": (listener: EventListener) => void;
  "remove-event_listener": (listener: EventListener) => void;
} & {
  [name: string]: (event: InputEvent) => void;
};

export class Input extends Plugin<IInputEventTypes> {
  private events: InputEvent[] = [];

  private inputHandlers: InputHandler[] = [];
  private inputHandlerMap: Map<IConstructor<InputHandler>, InputHandler> =
    new Map();

  private eventListeners: EventListener[] = [];
  private eventListenerMap: Map<IConstructor<EventListener>, EventListener> =
    new Map();

  private buttons: Record<string, InputButton> = {};
  private axes: Record<string, InputAxis> = {};

  constructor() {
    super();

    this.addInputHandler(
      new MouseInputHandler(),
      new KeyboardInputHandler(),
      new TouchInputHandler(),
      new ResizeInputHandler()
    );
    this.addAxis(
      new InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"),
      new InputAxis("vertical-keys", "ArrowDown", "ArrowUp")
    );
  }

  queueEvent(event: InputEvent) {
    this.emit("event", event);
    this.events.push(event);
    return this;
  }

  addAxes(axes: InputAxis[]) {
    for (const axis of axes) {
      this._addAxis(axis);
    }
    return this;
  }
  addAxis(...axes: InputAxis[]) {
    return this.addAxes(axes);
  }
  getAxis(name: string): InputAxis | null {
    return this.axes[name] || null;
  }
  getAxisValue(name: string) {
    const axis = this.getAxis(name);
    if (axis) {
      return axis.getValue();
    } else {
      return 0.0;
    }
  }

  getRequiredAxis(name: string) {
    const axis = this.getAxis(name);
    if (!axis) {
      throw new Error(`Failed to get Required Axis ${name}`);
    }
    return axis;
  }

  getInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ): I | null {
    return (this.inputHandlerMap.get(InputHandler) as I) || null;
  }
  getRequiredInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ) {
    const inputHandler = this.getInputHandler(InputHandler);
    if (!inputHandler) {
      throw new Error(`Failed to get Required InputHandler ${InputHandler}`);
    }
    return inputHandler;
  }

  getEventListener<I extends EventListener = EventListener>(
    EventListener: IConstructor<I>
  ): I | null {
    return (this.eventListenerMap.get(EventListener) as I) || null;
  }
  getRequiredEventListener<I extends EventListener = EventListener>(
    EventListener: IConstructor<I>
  ) {
    const eventListener = this.getEventListener(EventListener);
    if (!eventListener) {
      throw new Error(`Failed to get Required EventListener ${EventListener}`);
    }
    return eventListener;
  }

  removeAxes(axes: InputAxis[]) {
    for (const axis of axes) {
      this._removeAxis(axis);
    }
    return this;
  }
  removeAxis(...axes: InputAxis[]) {
    return this.removeAxes(axes);
  }

  addInputHandlers(inputHandlers: InputHandler[]) {
    for (const inputHandler of inputHandlers) {
      this._addInputHandler(inputHandler);
    }
    return this;
  }
  addInputHandler(...inputHandlers: InputHandler[]) {
    return this.addInputHandlers(inputHandlers);
  }

  removeInputHandlers(inputHandlers: IConstructor<InputHandler>[]) {
    for (const inputHandler of inputHandlers) {
      this._removeInputHandler(inputHandler);
    }
    return this;
  }
  removeInputHandler(...inputHandlers: IConstructor<InputHandler>[]) {
    return this.removeInputHandlers(inputHandlers);
  }

  addEventListeners(eventListeners: EventListener[]) {
    for (const eventListener of eventListeners) {
      this._addEventListener(eventListener);
    }
    return this;
  }
  addEventListener(...eventListeners: EventListener[]) {
    return this.addEventListeners(eventListeners);
  }

  removeEventListeners(EventListeners: IConstructor<EventListener>[]) {
    for (const EventListener of EventListeners) {
      this._removeEventListener(EventListener);
    }
    return this;
  }
  removeEventListener(...eventListeners: IConstructor<EventListener>[]) {
    return this.removeEventListeners(eventListeners);
  }

  getOrCreateButton(name: string) {
    const button = this.buttons[name];

    if (button) {
      return button;
    } else {
      const newButton = new InputButton(name);
      this.buttons[name] = newButton;
      return newButton;
    }
  }
  getButton(name: string): InputButton | null {
    return this.buttons[name] || null;
  }
  getButtonValue(name: string) {
    const button = this.getButton(name);
    if (button) {
      return button.getValue();
    } else {
      return 0.0;
    }
  }

  isDownCurrentFrame(name: string) {
    return (
      this.getButton(name)?.getFrameDown() ===
      this.getRequiredPlugin(Time).getFrame()
    );
  }
  isDown(name: string) {
    return !this.isUp(name);
  }

  isUpCurrentFrame(name: string) {
    return (
      this.getButton(name)?.getFrameUp() ===
      this.getRequiredPlugin(Time).getFrame()
    );
  }
  isUp(name: string) {
    return this.getButtonValue(name) == 0.0;
  }

  onUpdate() {
    const time = this.getRequiredPlugin(Time);
    for (const eventListener of this.eventListeners) {
      eventListener.onUpdate(time);
    }
    for (const inputHandler of this.inputHandlers) {
      for (const event of this.events) {
        inputHandler.onEvent(time, event);
      }
      inputHandler.onUpdate(time);
    }
    for (const event of this.events) {
      this.emit(event.type, event);
    }
    for (const eventListener of this.eventListeners) {
      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i];

        if (eventListener.dequeueEvent(event)) {
          this.events.splice(i, 1);
          i--;
        }
      }
    }
    this.events.length = 0;
    this.updateAxes(time);
    return this;
  }

  onAfterUpdate() {
    const time = this.getRequiredPlugin(Time);
    for (const eventListener of this.eventListeners) {
      eventListener.onAfterUpdate(time);
    }
    for (const inputHandler of this.inputHandlers) {
      inputHandler.onAfterUpdate(time);
    }
    return this;
  }

  private _addAxis(axis: InputAxis) {
    if (!this.axes[axis.getName()]) {
      this.axes[axis.getName()] = axis;
    }
    return this;
  }

  private _removeAxis(axis: InputAxis) {
    if (this.axes[axis.getName()]) {
      delete this.axes[axis.getName()];
    }
    return this;
  }

  private updateAxes(time: Time) {
    for (const axis of Object.values(this.axes)) {
      this.updateAxis(axis, time);
    }
  }

  private updateAxis(axis: InputAxis, time: Time) {
    const posValue = this.getButtonValue(axis.getPosButton()),
      negValue = this.getButtonValue(axis.getNegButton());

    axis.UNSAFE_update(
      time,
      axis.getValue(),
      negValue !== 0.0,
      posValue !== 0.0
    );
  }

  private _addInputHandler<I extends InputHandler = InputHandler>(
    inputHandler: I
  ) {
    const InputHandler = inputHandler.getConstructor();

    if (!this.inputHandlerMap.has(InputHandler)) {
      this.inputHandlers.push(inputHandler);
      this.inputHandlerMap.set(InputHandler, inputHandler);
      inputHandler.UNSAFE_setInput(this);
      inputHandler.onAdd();
      this.emit("add-input_handler", inputHandler);
    }

    return this;
  }
  private _removeInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ) {
    const inputHandler = this.getInputHandler(InputHandler);
    if (inputHandler) {
      this.emit("remove-input_handler", inputHandler);
      inputHandler.onRemove();

      this.inputHandlers.splice(this.inputHandlers.indexOf(inputHandler), 1);
      this.inputHandlerMap.delete(InputHandler);
      inputHandler.UNSAFE_removeInput();
    }
    return this;
  }

  private _addEventListener<E extends EventListener = EventListener>(
    eventListener: E
  ) {
    const EventListener = eventListener.getConstructor();

    if (!this.eventListenerMap.has(EventListener)) {
      this.eventListeners.push(eventListener);
      this.eventListenerMap.set(EventListener, eventListener);
      eventListener.UNSAFE_setInput(this);
      eventListener.onAdd();
      this.emit("add-event_listener", eventListener);
    }

    return this;
  }
  private _removeEventListener<E extends EventListener = EventListener>(
    EventListener: IConstructor<E>
  ) {
    const eventListener = this.getEventListener(EventListener);
    if (eventListener) {
      this.emit("remove-event_listener", eventListener);
      eventListener.onRemove();

      this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
      this.eventListenerMap.delete(EventListener);
      eventListener.UNSAFE_removeInput();
    }
    return this;
  }

  toJSON(): IJSONObject {
    return {
      ...super.toJSON(),
      buttons: Object.values(this.buttons).map((button) => button.toJSON()),
      axes: Object.values(this.axes).map((axis) => axis.toJSON()),
      inputHandlers: this.inputHandlers.map((inputHandler) =>
        inputHandler.toJSON()
      ),
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    if (isJSONArray(json.buttons)) {
      for (const value of json.buttons) {
        const buttonJSON = value as ReturnType<InputButton["toJSON"]>,
          button = new InputButton(buttonJSON.name).fromJSON(buttonJSON);
        this.buttons[button.getName()] = button;
      }
    }
    if (isJSONArray(json.axes)) {
      this.addAxes(
        json.axes.map((json) => {
          const axisJSON = json as ReturnType<InputAxis["toJSON"]>;
          return new InputAxis(
            axisJSON.name,
            axisJSON.negButton,
            axisJSON.posButton
          ).fromJSON(axisJSON);
        })
      );
    }
    if (isJSONArray(json.inputHandlers)) {
      this.addInputHandlers(
        json.inputHandlers.map((json) =>
          InputHandler.newFromJSON(json as IJSONObject)
        )
      );
    }
    return this;
  }
}
