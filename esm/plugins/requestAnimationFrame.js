const win = typeof window !== "undefined" ? window : {}, p = typeof performance !== "undefined" ? performance : Date, now = () => p.now();
let requestAnimationFrame = win.requestAnimationFrame && win.requestAnimationFrame.bind(win), cancelAnimationFrame = win.cancelAnimationFrame && win.cancelAnimationFrame.bind(win);
if (!requestAnimationFrame || !cancelAnimationFrame) {
    let lastTime = 0;
    requestAnimationFrame = (callback) => {
        const curr = now(), next = Math.max(lastTime + 1000 / 60, curr);
        return setTimeout(() => {
            callback((lastTime = next));
        }, next - curr);
    };
    cancelAnimationFrame = (h) => clearTimeout(h);
}
export { requestAnimationFrame, cancelAnimationFrame, now };
