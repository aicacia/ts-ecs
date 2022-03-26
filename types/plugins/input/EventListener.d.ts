import type { IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
import type { Time } from "../Time";
import type { Input } from "./Input";
import type { InputEvent } from "./InputEvent";
export declare abstract class EventListener<I extends Input = Input> extends ToFromJSONEventEmitter {
    private input;
    getConstructor(): IConstructor<this>;
    /**
     * @ignore
     */
    UNSAFE_setInput(input: I): this;
    /**
     * @ignore
     */
    UNSAFE_removeInput(): this;
    getInput(): I | null;
    getRequiredInput(): I;
    getScene(): import("../..").Scene | null;
    getRequiredScene(): import("../..").Scene;
    queueEvent(event: InputEvent): this;
    abstract dequeueEvent(event: InputEvent): boolean;
    onAdd(): this;
    onRemove(): this;
    onUpdate(_time: Time): this;
    onAfterUpdate(_time: Time): this;
}
