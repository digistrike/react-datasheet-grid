"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoizedIndexCallback = void 0;
const react_1 = require("react");
const useMemoizedIndexCallback = (callbackFn, argsLength) => {
    return (0, react_1.useMemo)(() => {
        const cache = new Map();
        return (index) => {
            if (!cache.has(index)) {
                cache.set(index, (...args) => {
                    callbackFn(index, ...args.slice(0, argsLength));
                });
            }
            return cache.get(index);
        };
    }, [argsLength, callbackFn]);
};
exports.useMemoizedIndexCallback = useMemoizedIndexCallback;
//# sourceMappingURL=useMemoizedIndexCallback.js.map