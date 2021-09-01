"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.cancelAnimationFrame = exports.requestAnimationFrame = void 0;
const win = typeof window !== "undefined" ? window : {}, p = typeof performance !== "undefined" ? performance : Date, now = () => p.now();
exports.now = now;
let requestAnimationFrame = win.requestAnimationFrame && win.requestAnimationFrame.bind(win), cancelAnimationFrame = win.cancelAnimationFrame && win.cancelAnimationFrame.bind(win);
exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;
if (!requestAnimationFrame || !cancelAnimationFrame) {
    let lastTime = 0;
    exports.requestAnimationFrame = requestAnimationFrame = (callback) => {
        const curr = now(), next = Math.max(lastTime + 1000 / 60, curr);
        return setTimeout(() => {
            callback((lastTime = next));
        }, next - curr);
    };
    exports.cancelAnimationFrame = cancelAnimationFrame = (h) => clearTimeout(h);
}
