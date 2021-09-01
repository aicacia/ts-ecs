export type IRequestAnimationFrame = (
  callback: (timestamp: number) => void
) => number;
export type ICancelAnimationFrame = (handle: number) => void;

const win = typeof window !== "undefined" ? window : ({} as any),
  p = typeof performance !== "undefined" ? performance : Date,
  now = () => p.now();

let requestAnimationFrame: IRequestAnimationFrame =
    win.requestAnimationFrame && win.requestAnimationFrame.bind(win),
  cancelAnimationFrame: ICancelAnimationFrame =
    win.cancelAnimationFrame && win.cancelAnimationFrame.bind(win);

if (!requestAnimationFrame || !cancelAnimationFrame) {
  let lastTime = 0;
  requestAnimationFrame = (callback: (timestamp: number) => void) => {
    const curr = now(),
      next = Math.max(lastTime + 1000 / 60, curr);
    return setTimeout(() => {
      callback((lastTime = next));
    }, next - curr) as any;
  };
  cancelAnimationFrame = (h) => clearTimeout(h as any);
}

export { requestAnimationFrame, cancelAnimationFrame, now };
