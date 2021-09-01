export declare type IRequestAnimationFrame = (callback: (timestamp: number) => void) => number;
export declare type ICancelAnimationFrame = (handle: number) => void;
declare const now: () => number;
declare let requestAnimationFrame: IRequestAnimationFrame, cancelAnimationFrame: ICancelAnimationFrame;
export { requestAnimationFrame, cancelAnimationFrame, now };
