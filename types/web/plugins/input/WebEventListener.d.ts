import { EventListener } from "../../../plugins/input/EventListener";
export declare class WebEventListener extends EventListener {
    static toFromJSONEnabled: boolean;
    private touchInputEventPool;
    private mouseInputEventPool;
    private mouseWheelInputEventPool;
    private keyboardInputEventPool;
    private resizeInputEventPool;
    private element;
    private window;
    constructor(element: Element);
    onAdd(): this;
    onRemove(): this;
    onResize: () => void;
    onTouch: (e: Event) => void;
    onMouse: (e: Event) => void;
    onMouseWheel: (e: Event) => void;
    onKeyboard: (e: Event) => void;
    dequeueEvent(event: InputEvent): boolean;
}
