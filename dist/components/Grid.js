"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const react_virtual_1 = require("@tanstack/react-virtual");
const react_1 = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const Cell_1 = require("./Cell");
const useMemoizedIndexCallback_1 = require("../hooks/useMemoizedIndexCallback");
const measureRowContentHeight_1 = require("../utils/measureRowContentHeight");
const columnFeatures_1 = require("../utils/columnFeatures");
const Grid = ({ data, columns, outerRef, innerRef, columnWidths, hasStickyRightColumn, displayHeight, headerRowHeight, rowHeight, baseRowHeight, rowKey, fullWidth, selection, activeCell, rowClassName, cellClassName, children, editing, getContextMenuItems, setRowData, deleteRows, duplicateRows, insertRowAfter, stopEditing, onScroll, wordWrap = false, hasWordWrap = false, resizableColumns = false, hasResizableColumns = false, resizableRows = false, onColumnResizeStart, onRowResizeStart, onRowHeightsChange, }) => {
    var _a, _b, _c, _d, _e;
    const rowVirtualizer = (0, react_virtual_1.useVirtualizer)({
        count: data.length,
        getScrollElement: () => outerRef.current,
        paddingStart: headerRowHeight,
        estimateSize: (index) => rowHeight(index).height,
        getItemKey: (index) => {
            if (rowKey && index > 0) {
                const row = data[index - 1];
                if (typeof rowKey === 'function') {
                    return rowKey({ rowData: row, rowIndex: index });
                }
                else if (typeof rowKey === 'string' &&
                    row instanceof Object &&
                    rowKey in row) {
                    const key = row[rowKey];
                    if (typeof key === 'string' || typeof key === 'number') {
                        return key;
                    }
                }
            }
            return index;
        },
        overscan: 5,
    });
    const colVirtualizer = (0, react_virtual_1.useVirtualizer)({
        count: columns.length,
        getScrollElement: () => outerRef.current,
        estimateSize: (index) => { var _a; return (_a = columnWidths === null || columnWidths === void 0 ? void 0 : columnWidths[index]) !== null && _a !== void 0 ? _a : 100; },
        horizontal: true,
        getItemKey: (index) => { var _a; return (_a = columns[index].id) !== null && _a !== void 0 ? _a : index; },
        overscan: 1,
        rangeExtractor: (range) => {
            const result = (0, react_virtual_1.defaultRangeExtractor)(range);
            if (result[0] !== 0) {
                result.unshift(0);
            }
            if (hasStickyRightColumn &&
                result[result.length - 1] !== columns.length - 1) {
                result.push(columns.length - 1);
            }
            return result;
        },
    });
    (0, react_1.useEffect)(() => {
        colVirtualizer.measure();
    }, [colVirtualizer, columnWidths]);
    (0, react_1.useEffect)(() => {
        rowVirtualizer.measure();
    }, [rowVirtualizer, hasWordWrap, columnWidths, data.length, rowHeight]);
    const onRowHeightsChangeRef = (0, react_1.useRef)(onRowHeightsChange);
    onRowHeightsChangeRef.current = onRowHeightsChange;
    const columnWidthsKey = (_a = columnWidths === null || columnWidths === void 0 ? void 0 : columnWidths.join(',')) !== null && _a !== void 0 ? _a : '';
    const prevEditingRef = (0, react_1.useRef)(editing);
    const editingRef = (0, react_1.useRef)(editing);
    const activeCellRef = (0, react_1.useRef)(activeCell);
    editingRef.current = editing;
    activeCellRef.current = activeCell;
    const measureVisibleRows = (0, react_1.useCallback)(() => {
        var _a;
        if (!hasWordWrap || !onRowHeightsChangeRef.current || !innerRef.current) {
            return;
        }
        const heights = {};
        const editingRow = editingRef.current
            ? (_a = activeCellRef.current) === null || _a === void 0 ? void 0 : _a.row
            : undefined;
        innerRef.current.querySelectorAll('.dsg-row-wrap').forEach((rowElement) => {
            const index = Number(rowElement.dataset.index);
            if (Number.isNaN(index)) {
                return;
            }
            if (editingRow === index) {
                return;
            }
            heights[index] = (0, measureRowContentHeight_1.measureRowContentHeight)(rowElement, baseRowHeight);
        });
        if (Object.keys(heights).length > 0) {
            onRowHeightsChangeRef.current(heights);
        }
    }, [hasWordWrap, baseRowHeight, innerRef]);
    (0, react_1.useLayoutEffect)(() => {
        if (editing) {
            return;
        }
        measureVisibleRows();
    }, [
        hasWordWrap,
        columnWidthsKey,
        data,
        baseRowHeight,
        editing,
        measureVisibleRows,
    ]);
    (0, react_1.useLayoutEffect)(() => {
        if (prevEditingRef.current && !editing) {
            measureVisibleRows();
        }
        prevEditingRef.current = editing;
    }, [editing, measureVisibleRows]);
    const setGivenRowData = (0, useMemoizedIndexCallback_1.useMemoizedIndexCallback)(setRowData, 1);
    const deleteGivenRow = (0, useMemoizedIndexCallback_1.useMemoizedIndexCallback)(deleteRows, 0);
    const duplicateGivenRow = (0, useMemoizedIndexCallback_1.useMemoizedIndexCallback)(duplicateRows, 0);
    const insertAfterGivenRow = (0, useMemoizedIndexCallback_1.useMemoizedIndexCallback)(insertRowAfter, 0);
    const selectionColMin = (_b = selection === null || selection === void 0 ? void 0 : selection.min.col) !== null && _b !== void 0 ? _b : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col;
    const selectionColMax = (_c = selection === null || selection === void 0 ? void 0 : selection.max.col) !== null && _c !== void 0 ? _c : activeCell === null || activeCell === void 0 ? void 0 : activeCell.col;
    const selectionMinRow = (_d = selection === null || selection === void 0 ? void 0 : selection.min.row) !== null && _d !== void 0 ? _d : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row;
    const selectionMaxRow = (_e = selection === null || selection === void 0 ? void 0 : selection.max.row) !== null && _e !== void 0 ? _e : activeCell === null || activeCell === void 0 ? void 0 : activeCell.row;
    const lastStickyColumnIndex = hasStickyRightColumn
        ? columns.length - 1
        : columns.length;
    return (react_1.default.createElement("div", { ref: outerRef, className: "dsg-container", onScroll: onScroll, style: { height: displayHeight } },
        react_1.default.createElement("div", { ref: innerRef, style: {
                width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
                height: rowVirtualizer.getTotalSize(),
            } },
            headerRowHeight > 0 && (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-row', 'dsg-row-header'), style: {
                    width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
                    height: headerRowHeight,
                } },
                colVirtualizer.getVirtualItems().map((col) => (react_1.default.createElement(Cell_1.Cell, { key: col.key, gutter: col.index === 0, stickyRight: hasStickyRightColumn && col.index === columns.length - 1, width: col.size, left: col.start, className: (0, classnames_1.default)('dsg-cell-header', selectionColMin !== undefined &&
                        selectionColMax !== undefined &&
                        selectionColMin <= col.index - 1 &&
                        selectionColMax >= col.index - 1 &&
                        'dsg-cell-header-active', columns[col.index].headerClassName) },
                    react_1.default.createElement("div", { className: "dsg-cell-header-container" }, columns[col.index].title)))),
                hasResizableColumns && (react_1.default.createElement("div", { className: "dsg-column-resize-layer" }, colVirtualizer.getVirtualItems().map((col) => {
                    if (col.index === 0 ||
                        col.index >= lastStickyColumnIndex ||
                        !(0, columnFeatures_1.getColumnResizable)(columns[col.index], resizableColumns)) {
                        return null;
                    }
                    return (react_1.default.createElement("div", { key: `resize-${col.key}`, className: "dsg-column-resize-handle", style: { left: col.start + col.size - 3 }, onMouseDown: (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onColumnResizeStart === null || onColumnResizeStart === void 0 ? void 0 : onColumnResizeStart(col.index, event.clientX, col.size);
                        } }));
                }))))),
            rowVirtualizer.getVirtualItems().map((row) => {
                const rowActive = Boolean(row.index >= (selectionMinRow !== null && selectionMinRow !== void 0 ? selectionMinRow : Infinity) &&
                    row.index <= (selectionMaxRow !== null && selectionMaxRow !== void 0 ? selectionMaxRow : -Infinity));
                return (react_1.default.createElement("div", { key: row.key, "data-index": row.index, className: (0, classnames_1.default)('dsg-row', hasWordWrap && 'dsg-row-wrap', typeof rowClassName === 'string' ? rowClassName : null, typeof rowClassName === 'function'
                        ? rowClassName({
                            rowData: data[row.index],
                            rowIndex: row.index,
                        })
                        : null), style: {
                        height: row.size,
                        top: row.start,
                        width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
                    } }, colVirtualizer.getVirtualItems().map((col) => {
                    const colCellClassName = columns[col.index].cellClassName;
                    const disabled = columns[col.index].disabled;
                    const Component = columns[col.index].component;
                    const cellDisabled = disabled === true ||
                        (typeof disabled === 'function' &&
                            disabled({
                                rowData: data[row.index],
                                rowIndex: row.index,
                            }));
                    const cellIsActive = (activeCell === null || activeCell === void 0 ? void 0 : activeCell.row) === row.index &&
                        activeCell.col === col.index - 1;
                    return (react_1.default.createElement(Cell_1.Cell, { key: col.key, gutter: col.index === 0, stickyRight: hasStickyRightColumn && col.index === columns.length - 1, active: col.index === 0 && rowActive, disabled: cellDisabled, wordWrap: (0, columnFeatures_1.getColumnWordWrap)(columns[col.index], wordWrap), className: (0, classnames_1.default)(typeof colCellClassName === 'function'
                            ? colCellClassName({
                                rowData: data[row.index],
                                rowIndex: row.index,
                                columnId: columns[col.index].id,
                            })
                            : colCellClassName, typeof cellClassName === 'function'
                            ? cellClassName({
                                rowData: data[row.index],
                                rowIndex: row.index,
                                columnId: columns[col.index].id,
                            })
                            : cellClassName), width: col.size, left: col.start },
                        react_1.default.createElement(Component, { rowData: data[row.index], getContextMenuItems: getContextMenuItems, disabled: cellDisabled, active: cellIsActive, columnIndex: col.index - 1, rowIndex: row.index, focus: cellIsActive && editing, deleteRow: deleteGivenRow(row.index), duplicateRow: duplicateGivenRow(row.index), stopEditing: stopEditing, insertRowBelow: insertAfterGivenRow(row.index), setRowData: setGivenRowData(row.index), columnData: columns[col.index].columnData })));
                })));
            }),
            children)));
};
exports.Grid = Grid;
//# sourceMappingURL=Grid.js.map