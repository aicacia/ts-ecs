import { IJSONObject } from "@aicacia/json";
import { Time } from "../Time";
export declare class InputAxis {
    private name;
    private negButton;
    private posButton;
    private gravity;
    private sensitivity;
    private dead;
    private value;
    constructor(name: string, negButton: string, posButton: string);
    getName(): string;
    getNegButton(): string;
    setNegButton(negButton: string): this;
    getPosButton(): string;
    setPosButton(posButton: string): this;
    getGravity(): number;
    setGravity(gravity: number): this;
    getSensitivity(): number;
    setSensitivity(sensitivity: number): this;
    getDead(): number;
    setDead(dead: number): this;
    getValue(): number;
    /**
     * @ignore
     */
    UNSAFE_setValue(value: number): this;
    /**
     * @ignore
     */
    UNSAFE_update(time: Time, value: number, isNeg: boolean, isPos: boolean): void;
    toJSON(): {
        name: string;
        negButton: string;
        posButton: string;
        gravity: number;
        sensitivity: number;
        dead: number;
        value: number;
    };
    fromJSON(json: IJSONObject): this;
}
