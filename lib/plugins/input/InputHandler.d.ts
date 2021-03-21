import { Option, IConstructor } from "@aicacia/core";
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
    getInput(): Option<I>;
    getRequiredInput(): I;
    getScene(): Option<import("../..").Scene>;
    getRequiredScene(): import("../..").Scene;
    onAdd(): this;
    onRemove(): this;
    onUpdate(_time: Time): this;
    onAfterUpdate(_time: Time): this;
    abstract onEvent(time: Time, event: InputEvent): this;
}
import { Time } from "../Time";
import { Input } from "./Input";
import { InputEvent } from "./InputEvent";
