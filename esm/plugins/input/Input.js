import { Option } from "@aicacia/core";
import { Plugin } from "../../Plugin";
import { Time } from "../Time";
import { InputAxis } from "./InputAxis";
import { InputButton } from "./InputButton";
import { InputHandler } from "./InputHandler";
import { MouseInputHandler } from "./MouseInputHandler";
import { KeyboardInputHandler } from "./KeyboardInputHandler";
import { TouchInputHandler } from "./TouchInputHandler";
import { ResizeInputHandler } from "./ResizeInputHandler";
import { isJSONArray } from "@aicacia/json";
export class Input extends Plugin {
    constructor() {
        super();
        this.events = [];
        this.inputHandlers = [];
        this.inputHandlerMap = new Map();
        this.eventListeners = [];
        this.eventListenerMap = new Map();
        this.buttons = {};
        this.axes = {};
        this.addInputHandler(new MouseInputHandler(), new KeyboardInputHandler(), new TouchInputHandler(), new ResizeInputHandler());
        this.addAxis(new InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"), new InputAxis("vertical-keys", "ArrowDown", "ArrowUp"));
    }
    queueEvent(event) {
        this.emit("event", event);
        this.events.push(event);
        return this;
    }
    addAxes(axes) {
        for (const axis of axes) {
            this._addAxis(axis);
        }
        return this;
    }
    addAxis(...axes) {
        return this.addAxes(axes);
    }
    getAxis(name) {
        return Option.from(this.axes[name]);
    }
    getAxisValue(name) {
        return this.getAxis(name)
            .map((axis) => axis.getValue())
            .unwrapOr(0.0);
    }
    getRequiredAxis(name) {
        return this.getAxis(name).expect(`Failed to get Required Axis ${name}`);
    }
    getInputHandler(InputHandler) {
        return Option.from(this.inputHandlerMap.get(InputHandler));
    }
    getRequiredInputHandler(InputHandler) {
        return this.getInputHandler(InputHandler).expect(`Failed to get Required InputHandler ${InputHandler}`);
    }
    getEventListener(EventListener) {
        return Option.from(this.eventListenerMap.get(EventListener));
    }
    getRequiredEventListener(EventListener) {
        return this.getEventListener(EventListener).expect(`Failed to get Required EventListener ${EventListener}`);
    }
    removeAxes(axes) {
        for (const axis of axes) {
            this._removeAxis(axis);
        }
        return this;
    }
    removeAxis(...axes) {
        return this.removeAxes(axes);
    }
    addInputHandlers(inputHandlers) {
        for (const inputHandler of inputHandlers) {
            this._addInputHandler(inputHandler);
        }
        return this;
    }
    addInputHandler(...inputHandlers) {
        return this.addInputHandlers(inputHandlers);
    }
    removeInputHandlers(inputHandlers) {
        for (const inputHandler of inputHandlers) {
            this._removeInputHandler(inputHandler);
        }
        return this;
    }
    removeInputHandler(...inputHandlers) {
        return this.removeInputHandlers(inputHandlers);
    }
    addEventListeners(eventListeners) {
        for (const eventListener of eventListeners) {
            this._addEventListener(eventListener);
        }
        return this;
    }
    addEventListener(...eventListeners) {
        return this.addEventListeners(eventListeners);
    }
    removeEventListeners(EventListeners) {
        for (const EventListener of EventListeners) {
            this._removeEventListener(EventListener);
        }
        return this;
    }
    removeEventListener(...eventListeners) {
        return this.removeEventListeners(eventListeners);
    }
    getOrCreateButton(name) {
        const button = this.buttons[name];
        if (button) {
            return button;
        }
        else {
            const newButton = new InputButton(name);
            this.buttons[name] = newButton;
            return newButton;
        }
    }
    getButton(name) {
        return Option.from(this.buttons[name]);
    }
    getButtonValue(name) {
        return this.getButton(name)
            .map((button) => button.getValue())
            .unwrapOr(0.0);
    }
    isDownCurrentFrame(name) {
        return this.getButton(name)
            .map((button) => button.getFrameDown() === this.getRequiredPlugin(Time).getFrame())
            .unwrapOr(false);
    }
    isDown(name) {
        return !this.isUp(name);
    }
    isUpCurrentFrame(name) {
        return this.getButton(name)
            .map((button) => button.getFrameUp() === this.getRequiredPlugin(Time).getFrame())
            .unwrapOr(false);
    }
    isUp(name) {
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
    _addAxis(axis) {
        if (!this.axes[axis.getName()]) {
            this.axes[axis.getName()] = axis;
        }
        return this;
    }
    _removeAxis(axis) {
        if (this.axes[axis.getName()]) {
            delete this.axes[axis.getName()];
        }
        return this;
    }
    updateAxes(time) {
        for (const axis of Object.values(this.axes)) {
            this.updateAxis(axis, time);
        }
    }
    updateAxis(axis, time) {
        const posValue = this.getButtonValue(axis.getPosButton()), negValue = this.getButtonValue(axis.getNegButton());
        axis.UNSAFE_update(time, axis.getValue(), negValue !== 0.0, posValue !== 0.0);
    }
    _addInputHandler(inputHandler) {
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
    _removeInputHandler(InputHandler) {
        this.getInputHandler(InputHandler).ifSome((inputHandler) => {
            this.emit("remove-input_handler", inputHandler);
            inputHandler.onRemove();
            this.inputHandlers.splice(this.inputHandlers.indexOf(inputHandler), 1);
            this.inputHandlerMap.delete(InputHandler);
            inputHandler.UNSAFE_removeInput();
        });
        return this;
    }
    _addEventListener(eventListener) {
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
    _removeEventListener(EventListener) {
        this.getEventListener(EventListener).ifSome((eventListener) => {
            this.emit("remove-event_listener", eventListener);
            eventListener.onRemove();
            this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
            this.eventListenerMap.delete(EventListener);
            eventListener.UNSAFE_removeInput();
        });
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { buttons: Object.values(this.buttons).map((button) => button.toJSON()), axes: Object.values(this.axes).map((axis) => axis.toJSON()), inputHandlers: this.inputHandlers.map((inputHandler) => inputHandler.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (isJSONArray(json.buttons)) {
            for (const value of json.buttons) {
                const buttonJSON = value, button = new InputButton(buttonJSON.name).fromJSON(buttonJSON);
                this.buttons[button.getName()] = button;
            }
        }
        if (isJSONArray(json.axes)) {
            this.addAxes(json.axes.map((json) => {
                const axisJSON = json;
                return new InputAxis(axisJSON.name, axisJSON.negButton, axisJSON.posButton).fromJSON(axisJSON);
            }));
        }
        if (isJSONArray(json.inputHandlers)) {
            this.addInputHandlers(json.inputHandlers.map((json) => InputHandler.newFromJSON(json)));
        }
        return this;
    }
}