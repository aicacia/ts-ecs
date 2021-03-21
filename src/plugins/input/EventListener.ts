import { none, Option, IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
import type { Time } from "../Time";
import type { Input } from "./Input";
import type { InputEvent } from "./InputEvent";

export abstract class EventListener<
  I extends Input = Input
> extends ToFromJSONEventEmitter {
  private input: Option<I> = none();

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }

  /**
   * @ignore
   */
  UNSAFE_setInput(input: I) {
    this.input.replace(input);
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeInput() {
    this.input.clear();
    return this;
  }
  getInput() {
    return this.input as Option<I>;
  }
  getRequiredInput() {
    return this.getInput().expect(
      `${this.getConstructor()} requires a Input Plugin`
    );
  }
  getScene() {
    return this.getInput().flatMap((input) => input.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(`${this.getConstructor()} requires a Scene`);
  }

  queueEvent(event: InputEvent) {
    return this.getInput().map((input) => input.queueEvent(event));
  }
  abstract dequeueEvent(event: InputEvent): boolean;

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate(_time: Time) {
    return this;
  }
  onAfterUpdate(_time: Time) {
    return this;
  }
}
