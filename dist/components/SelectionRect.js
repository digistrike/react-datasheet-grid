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
exports.SelectionRect = void 0;
const react_1 = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const buildSquare = (top, right, bottom, left) => {
    return [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
        [left, top],
    ];
};
const buildClipPath = (top, right, bottom, left) => {
    const values = [
        ...buildSquare(0, '100%', '100%', 0),
        ...buildSquare(top, right, bottom, left),
    ];
    return `polygon(evenodd, ${values
        .map((pair) => pair
        .map((value) => typeof value === 'number' && value !== 0 ? value + 'px' : value)
        .join(' '))
        .join(',')})`;
};
exports.SelectionRect = react_1.default.memo(({ columnWidths, columnRights, headerRowHeight, selection, rowHeight, activeCell, hasStickyRightColumn, dataLength, viewWidth, viewHeight, contentWidth, edges, isCellDisabled, editing, expandSelection, }) => {
    var _a, _b, _c, _d;
    const activeCellIsDisabled = activeCell ? isCellDisabled(activeCell) : false;
    const selectionIsDisabled = (0, react_1.useMemo)(() => {
        if (!selection) {
            return activeCellIsDisabled;
        }
        for (let col = selection.min.col; col <= selection.max.col; ++col) {
            for (let row = selection.min.row; row <= selection.max.row; ++row) {
                if (!isCellDisabled({ col, row })) {
                    return false;
                }
            }
        }
        return true;
    }, [activeCellIsDisabled, isCellDisabled, selection]);
    if (!columnWidths || !columnRights) {
        return null;
    }
    const extraPixelV = (rowI) => {
        return rowI < dataLength - 1 ? 1 : 0;
    };
    const extraPixelH = (colI) => {
        return colI < columnWidths.length - (hasStickyRightColumn ? 3 : 2) ? 1 : 0;
    };
    const activeCellRect = activeCell && {
        width: columnWidths[activeCell.col + 1] + extraPixelH(activeCell.col),
        height: rowHeight(activeCell.row).height + extraPixelV(activeCell.row),
        left: columnRights[activeCell.col],
        top: rowHeight(activeCell.row).top + headerRowHeight,
    };
    const selectionRect = selection && {
        width: columnWidths
            .slice(selection.min.col + 1, selection.max.col + 2)
            .reduce((a, b) => a + b) + extraPixelH(selection.max.col),
        height: rowHeight(selection.max.row).top +
            rowHeight(selection.max.row).height -
            rowHeight(selection.min.row).top +
            extraPixelV(selection.max.row),
        left: columnRights[selection.min.col],
        top: rowHeight(selection.min.row).top + headerRowHeight,
    };
    const minSelection = (selection === null || selection === void 0 ? void 0 : selection.min) || activeCell;
    const maxSelection = (selection === null || selection === void 0 ? void 0 : selection.max) || activeCell;
    const expandRowsIndicator = maxSelection &&
        expandSelection !== null && {
        left: columnRights[maxSelection.col] + columnWidths[maxSelection.col + 1],
        top: rowHeight(maxSelection.row).top +
            rowHeight(maxSelection.row).height +
            headerRowHeight,
        transform: `translate(-${maxSelection.col <
            columnWidths.length - (hasStickyRightColumn ? 3 : 2)
            ? 50
            : 100}%, -${maxSelection.row < dataLength - 1 ? 50 : 100}%)`,
    };
    const expandRowsRect = minSelection &&
        maxSelection &&
        expandSelection !== null && {
        width: columnWidths
            .slice(minSelection.col + 1, maxSelection.col + 2)
            .reduce((a, b) => a + b) + extraPixelH(maxSelection.col),
        height: rowHeight(maxSelection.row + expandSelection).top +
            rowHeight(maxSelection.row + expandSelection).height -
            rowHeight(maxSelection.row + 1).top +
            extraPixelV(maxSelection.row + expandSelection) -
            1,
        left: columnRights[minSelection.col],
        top: rowHeight(maxSelection.row).top +
            rowHeight(maxSelection.row).height +
            headerRowHeight +
            1,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "dsg-scrollable-view-container", style: {
                height: rowHeight(dataLength - 1).top +
                    rowHeight(dataLength - 1).height +
                    headerRowHeight,
                width: contentWidth ? contentWidth : '100%',
            } },
            react_1.default.createElement("div", { className: (0, classnames_1.default)({
                    'dsg-scrollable-view': true,
                    'dsg-scrollable-view-t': !edges.top,
                    'dsg-scrollable-view-r': !edges.right,
                    'dsg-scrollable-view-b': !edges.bottom,
                    'dsg-scrollable-view-l': !edges.left,
                }), style: {
                    top: headerRowHeight,
                    left: columnWidths[0],
                    height: viewHeight ? viewHeight - headerRowHeight : 0,
                    width: contentWidth && viewWidth
                        ? viewWidth -
                            columnWidths[0] -
                            (hasStickyRightColumn
                                ? columnWidths[columnWidths.length - 1]
                                : 0)
                        : `calc(100% - ${columnWidths[0] +
                            (hasStickyRightColumn
                                ? columnWidths[columnWidths.length - 1]
                                : 0)}px)`,
                } })),
        (selectionRect || activeCellRect) && (react_1.default.createElement("div", { className: "dsg-selection-col-marker-container", style: {
                left: (_a = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.left) !== null && _a !== void 0 ? _a : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.left,
                width: (_b = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.width) !== null && _b !== void 0 ? _b : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.width,
                height: rowHeight(dataLength - 1).top +
                    rowHeight(dataLength - 1).height +
                    headerRowHeight,
            } },
            react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-selection-col-marker', selectionIsDisabled && 'dsg-selection-col-marker-disabled'), style: { top: headerRowHeight } }))),
        (selectionRect || activeCellRect) && (react_1.default.createElement("div", { className: "dsg-selection-row-marker-container", style: {
                top: (_c = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.top) !== null && _c !== void 0 ? _c : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.top,
                height: (_d = selectionRect === null || selectionRect === void 0 ? void 0 : selectionRect.height) !== null && _d !== void 0 ? _d : activeCellRect === null || activeCellRect === void 0 ? void 0 : activeCellRect.height,
                width: contentWidth ? contentWidth : '100%',
            } },
            react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-selection-row-marker', selectionIsDisabled && 'dsg-selection-row-marker-disabled'), style: { left: columnWidths[0] } }))),
        activeCellRect && activeCell && (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-active-cell', {
                'dsg-active-cell-focus': editing,
                'dsg-active-cell-disabled': activeCellIsDisabled,
            }), style: activeCellRect })),
        selectionRect && activeCellRect && (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-selection-rect', selectionIsDisabled && 'dsg-selection-rect-disabled'), style: Object.assign(Object.assign({}, selectionRect), { clipPath: buildClipPath(activeCellRect.top - selectionRect.top, activeCellRect.left - selectionRect.left, activeCellRect.top + activeCellRect.height - selectionRect.top, activeCellRect.left + activeCellRect.width - selectionRect.left) }) })),
        expandRowsRect && (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-expand-rows-rect'), style: expandRowsRect })),
        expandRowsIndicator && (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-expand-rows-indicator', selectionIsDisabled && 'dsg-expand-rows-indicator-disabled'), style: expandRowsIndicator }))));
});
exports.SelectionRect.displayName = 'SelectionRect';
//# sourceMappingURL=SelectionRect.js.map