"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridContext = exports.GridContext = void 0;
const react_1 = require("react");
exports.GridContext = (0, react_1.createContext)({
    wordWrap: false,
});
const useGridContext = () => (0, react_1.useContext)(exports.GridContext);
exports.useGridContext = useGridContext;
//# sourceMappingURL=GridContext.js.map