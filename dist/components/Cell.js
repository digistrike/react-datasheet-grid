"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const Cell = ({ children, gutter, stickyRight, active, disabled, className, wordWrap, width, left, }) => {
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-cell', gutter && 'dsg-cell-gutter', disabled && 'dsg-cell-disabled', gutter && active && 'dsg-cell-gutter-active', stickyRight && 'dsg-cell-sticky-right', wordWrap && 'dsg-cell-wrap', className), style: {
            width,
            left: stickyRight ? undefined : left,
        } }, children));
};
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map