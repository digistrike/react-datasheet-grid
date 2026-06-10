"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnWidths = exports.useResizableColumnWidths = void 0;
const react_1 = require("react");
const useColumnWidths_1 = require("./useColumnWidths");
Object.defineProperty(exports, "getColumnWidths", { enumerable: true, get: function () { return useColumnWidths_1.getColumnWidths; } });
const buildColumnRights = (columnWidths) => {
    let totalWidth = 0;
    return columnWidths.map((w, i) => {
        totalWidth += w;
        return i === columnWidths.length - 1 ? Infinity : totalWidth;
    });
};
const useResizableColumnWidths = (columns, width, resizableColumns = false) => {
    const [overrides, setOverrides] = (0, react_1.useState)({});
    const flexResult = (0, useColumnWidths_1.useColumnWidths)(columns, width);
    const setColumnWidth = (0, react_1.useCallback)((index, nextWidth) => {
        var _a, _b, _c;
        const minWidth = (_b = (_a = columns[index]) === null || _a === void 0 ? void 0 : _a.minWidth) !== null && _b !== void 0 ? _b : 0;
        const maxWidth = (_c = columns[index]) === null || _c === void 0 ? void 0 : _c.maxWidth;
        let width = Math.max(minWidth, nextWidth);
        if (maxWidth !== undefined) {
            width = Math.min(maxWidth, width);
        }
        setOverrides((prev) => (Object.assign(Object.assign({}, prev), { [index]: width })));
    }, [columns]);
    return (0, react_1.useMemo)(() => {
        if (!flexResult.columnWidths || width === undefined) {
            return Object.assign(Object.assign({}, flexResult), { setColumnWidth,
                resizableColumns });
        }
        const hasOverrides = Object.keys(overrides).length > 0;
        if (!hasOverrides) {
            return Object.assign(Object.assign({}, flexResult), { setColumnWidth,
                resizableColumns });
        }
        const columnWidths = flexResult.columnWidths.map((columnWidth, index) => { var _a; return (_a = overrides[index]) !== null && _a !== void 0 ? _a : columnWidth; });
        const totalWidth = columnWidths.reduce((acc, cur) => acc + cur, 0);
        const columnRights = buildColumnRights(columnWidths);
        return {
            fullWidth: Math.abs(width - totalWidth) < 0.1,
            columnWidths,
            columnRights,
            totalWidth,
            setColumnWidth,
            resizableColumns,
        };
    }, [flexResult, overrides, resizableColumns, setColumnWidth, width]);
};
exports.useResizableColumnWidths = useResizableColumnWidths;
//# sourceMappingURL=useResizableColumnWidths.js.map