import { Plugin } from "../Plugin";
export declare type ILoopHandler = (ms: number) => void;
export declare class Loop extends Plugin {
    private id;
    private running;
    private resolves;
    promise(): Promise<void>;
    start(): void;
    stop(): this;
    isStopped(): boolean;
    private run;
    private request;
    onInit(): this;
}
