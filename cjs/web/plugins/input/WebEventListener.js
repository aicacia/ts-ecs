"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebEventListener = void 0;
const EventListener_1 = require("../../../plugins/input/EventListener");
const pool_1 = require("@aicacia/pool");
const input_1 = require("../../../plugins/input");
class WebEventListener extends EventListener_1.EventListener {
    constructor(element) {
        super();
        this.touchInputEventPool = new pool_1.Pool(input_1.TouchInputEvent, input_1.TouchInputEvent.init);
        this.mouseInputEventPool = new pool_1.Pool(input_1.MouseInputEvent, input_1.MouseInputEvent.init);
        this.mouseWheelInputEventPool = new pool_1.Pool(input_1.MouseWheelInputEvent, input_1.MouseWheelInputEvent.init);
        this.keyboardInputEventPool = new pool_1.Pool(input_1.KeyboardInputEvent, input_1.KeyboardInputEvent.init);
        this.resizeInputEventPool = new pool_1.Pool(input_1.ResizeInputEvent, input_1.ResizeInputEvent.init);
        this.onResize = () => {
            const event = this.resizeInputEventPool.create("resize");
            event.width = this.window.innerWidth;
            event.height = this.window.innerHeight;
            this.queueEvent(event);
        };
        this.onTouch = (e) => {
            const touchEvent = e, elementRect = this.element.getBoundingClientRect();
            for (let i = 0, il = touchEvent.touches.length; i < il; i++) {
                const touch = touchEvent.touches[i], x = touch.clientX - elementRect.left, y = touch.clientY - elementRect.top, event = this.touchInputEventPool.create(touchEvent.type);
                event.id = touch.identifier;
                event.x = x;
                event.y = y;
                this.queueEvent(event);
            }
        };
        this.onMouse = (e) => {
            const mouseEvent = e, elementRect = this.element.getBoundingClientRect(), x = mouseEvent.clientX - elementRect.left, y = mouseEvent.clientY - elementRect.top, event = this.mouseInputEventPool.create(mouseEvent.type);
            event.button = mouseEvent.button;
            event.x = x;
            event.y = y;
            this.queueEvent(event);
        };
        this.onMouseWheel = (e) => {
            const mouseWheelEvent = e, event = this.mouseWheelInputEventPool.create(mouseWheelEvent.type);
            event.wheel = mouseWheelEvent.deltaY;
            this.queueEvent(event);
        };
        this.onKeyboard = (e) => {
            const keyEvent = e, event = this.keyboardInputEventPool.create(keyEvent.type);
            event.code = keyEvent.code;
            this.queueEvent(event);
        };
        this.element = element;
        this.window = element.ownerDocument.defaultView;
    }
    onAdd() {
        this.window.addEventListener("orientationchange", this.onResize);
        this.window.addEventListener("resize", this.onResize);
        this.element.addEventListener("touchstart", this.onTouch);
        this.element.addEventListener("touchmove", this.onTouch);
        this.element.addEventListener("touchend", this.onTouch);
        this.element.addEventListener("touchcancel", this.onTouch);
        this.element.addEventListener("mousemove", this.onMouse);
        this.element.addEventListener("mousedown", this.onMouse);
        this.element.addEventListener("mouseup", this.onMouse);
        this.element.addEventListener("wheel", this.onMouseWheel);
        this.element.addEventListener("mouseleave", this.onMouse);
        this.element.addEventListener("keydown", this.onKeyboard);
        this.element.addEventListener("keyup", this.onKeyboard);
        this.onResize();
        return this;
    }
    onRemove() {
        this.window.removeEventListener("orientationchange", this.onResize);
        this.window.removeEventListener("resize", this.onResize);
        this.element.removeEventListener("touchstart", this.onTouch);
        this.element.removeEventListener("touchmove", this.onTouch);
        this.element.removeEventListener("touchend", this.onTouch);
        this.element.removeEventListener("touchcancel", this.onTouch);
        this.element.removeEventListener("mousemove", this.onMouse);
        this.element.removeEventListener("mousedown", this.onMouse);
        this.element.removeEventListener("mouseup", this.onMouse);
        this.element.removeEventListener("wheel", this.onMouseWheel);
        this.element.removeEventListener("mouseleave", this.onMouse);
        this.element.removeEventListener("keydown", this.onKeyboard);
        this.element.removeEventListener("keyup", this.onKeyboard);
        return this;
    }
    dequeueEvent(event) {
        if (event instanceof input_1.MouseInputEvent) {
            this.mouseInputEventPool.release(event);
            return true;
        }
        else if (event instanceof input_1.KeyboardInputEvent) {
            this.keyboardInputEventPool.release(event);
            return true;
        }
        else if (event instanceof input_1.MouseWheelInputEvent) {
            this.mouseWheelInputEventPool.release(event);
            return true;
        }
        else if (event instanceof input_1.TouchInputEvent) {
            this.touchInputEventPool.release(event);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.WebEventListener = WebEventListener;
WebEventListener.toFromJSONEnabled = false;
