import type { IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";

export abstract class InputHandler<
  I extends Input = Input
> extends ToFromJSONEventEmitter {
  private input: I | null = null;

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }

  /**
   * @ignore
   */
  UNSAFE_setInput(input: I) {
    this.input = input;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeInput() {
    this.input = null;
    return this;
  }
  getInput() {
    return this.input;
  }
  getRequiredInput() {
    const input = this.getInput();
    if (!input) {
      throw new Error(`${this.getConstructor()} requires a Input Plugin`);
    }
    return input;
  }
  getScene() {
    const input = this.getInput();
    if (input) {
      return input.getScene();
    } else {
      return null;
    }
  }
  getRequiredScene() {
    const scene = this.getScene();
    if (!scene) {
      throw new Error(`${this.getConstructor()} requires a Scene`);
    }
    return scene;
  }

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
  abstract onEvent(time: Time, event: InputEvent): this;
}

import type { Time } from "../Time";
import type { Input } from "./Input";
import type { InputEvent } from "./InputEvent";
