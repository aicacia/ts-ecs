import type { IJSONObject } from "@aicacia/json";
import type { Time } from "../Time";

export class InputAxis {
  private name: string;

  private negButton: string;
  private posButton: string;

  private gravity = 3;
  private sensitivity = 3;

  private dead = 0.001;

  private value = 0.0;

  constructor(name: string, negButton: string, posButton: string) {
    this.name = name;
    this.negButton = negButton;
    this.posButton = posButton;
  }

  getName() {
    return this.name;
  }

  getNegButton() {
    return this.negButton;
  }
  setNegButton(negButton: string) {
    this.negButton = negButton;
    return this;
  }
  getPosButton() {
    return this.posButton;
  }
  setPosButton(posButton: string) {
    this.posButton = posButton;
    return this;
  }

  getGravity() {
    return this.gravity;
  }
  setGravity(gravity: number) {
    this.gravity = gravity;
    return this;
  }
  getSensitivity() {
    return this.sensitivity;
  }
  setSensitivity(sensitivity: number) {
    this.sensitivity = sensitivity;
    return this;
  }

  getDead() {
    return this.dead;
  }
  setDead(dead: number) {
    this.dead = dead;
    return this;
  }

  getValue() {
    return this.value;
  }
  /**
   * @ignore
   */
  UNSAFE_setValue(value: number) {
    this.value = value;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_update(time: Time, value: number, isNeg: boolean, isPos: boolean) {
    const delta = time.getDelta();

    if (isNeg) {
      value -= this.getSensitivity() * delta;
    }
    if (isPos) {
      value += this.getSensitivity() * delta;
    }

    if (!isPos && !isNeg && value !== 0.0) {
      value -= (value >= 0 ? 1 : -1) * this.getGravity() * delta;
    }

    value = value >= 1.0 ? 1.0 : value <= -1.0 ? -1.0 : value;

    if (Math.abs(value) <= this.getDead()) {
      value = 0.0;
    }

    this.value = value;
  }

  toJSON() {
    return {
      name: this.name,
      negButton: this.negButton,
      posButton: this.posButton,
      gravity: this.gravity,
      sensitivity: this.sensitivity,
      dead: this.dead,
      value: this.value,
    };
  }
  fromJSON(json: IJSONObject) {
    this.name = json.name as string;
    this.negButton = json.negButton as string;
    this.posButton = json.posButton as string;
    this.gravity = json.gravity as number;
    this.sensitivity = json.sensitivity as number;
    this.dead = json.dead as number;
    this.value = json.value as number;
    return this;
  }
}
