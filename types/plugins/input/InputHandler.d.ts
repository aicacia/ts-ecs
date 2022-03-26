import type { IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export declare abstract class InputHandler<I extends Input = Input> extends ToFromJSONEventEmitter {
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
    onAdd(): this;
    onRemove(): this;
    onUpdate(_time: Time): this;
    onAfterUpdate(_time: Time): this;
    abstract onEvent(time: Time, event: InputEvent): this;
}
import type { Time } from "../Time";
import type { Input } from "./Input";
import type { InputEvent } from "./InputEvent";
