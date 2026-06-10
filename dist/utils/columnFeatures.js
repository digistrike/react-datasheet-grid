"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyResizableColumns = exports.hasAnyWordWrap = exports.getColumnResizable = exports.getColumnWordWrap = void 0;
/** Per-column override, otherwise falls back to the grid-level default. */
const getColumnWordWrap = (column, gridWordWrap) => {
    if (column.wordWrap === true) {
        return true;
    }
    if (column.wordWrap === false) {
        return false;
    }
    return gridWordWrap;
};
exports.getColumnWordWrap = getColumnWordWrap;
/** Per-column override, otherwise falls back to the grid-level default. */
const getColumnResizable = (column, gridResizableColumns) => {
    if (column.resizable === true) {
        return true;
    }
    if (column.resizable === false) {
        return false;
    }
    return gridResizableColumns;
};
exports.getColumnResizable = getColumnResizable;
const hasAnyWordWrap = (columns, gridWordWrap) => columns.some((column) => (0, exports.getColumnWordWrap)(column, gridWordWrap));
exports.hasAnyWordWrap = hasAnyWordWrap;
const hasAnyResizableColumns = (columns, gridResizableColumns) => columns.some((column) => (0, exports.getColumnResizable)(column, gridResizableColumns));
exports.hasAnyResizableColumns = hasAnyResizableColumns;
//# sourceMappingURL=columnFeatures.js.map