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
exports.createTextColumn = exports.textColumn = void 0;
const react_1 = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const useFirstRender_1 = require("../hooks/useFirstRender");
const GridContext_1 = require("../context/GridContext");
const TextComponent = react_1.default.memo(({ active, focus, rowData, rowIndex, setRowData, columnData: { placeholder, alignRight, wordWrap: columnWordWrap, formatInputOnFocus, formatBlurredInput, parseUserInput, continuousUpdates, }, }) => {
    const { wordWrap: gridWordWrap, reportRowHeight } = (0, GridContext_1.useGridContext)();
    const wordWrap = columnWordWrap || gridWordWrap;
    const inputRef = (0, react_1.useRef)(null);
    const textareaRef = (0, react_1.useRef)(null);
    const ref = wordWrap ? textareaRef : inputRef;
    const firstRender = (0, useFirstRender_1.useFirstRender)();
    const asyncRef = (0, react_1.useRef)({
        rowData,
        formatInputOnFocus,
        formatBlurredInput,
        setRowData,
        parseUserInput,
        continuousUpdates,
        firstRender,
        focusedAt: 0,
        changedAt: 0,
        escPressed: false,
    });
    asyncRef.current = {
        rowData,
        formatInputOnFocus,
        formatBlurredInput,
        setRowData,
        parseUserInput,
        continuousUpdates,
        firstRender,
        focusedAt: asyncRef.current.focusedAt,
        changedAt: asyncRef.current.changedAt,
        escPressed: asyncRef.current.escPressed,
    };
    const lastReportedHeightRef = (0, react_1.useRef)(0);
    const reportTextareaHeight = (force = false) => {
        const textarea = textareaRef.current;
        if (!wordWrap || !textarea) {
            return;
        }
        const previousHeight = textarea.style.height;
        textarea.style.height = '0px';
        const nextHeight = textarea.scrollHeight;
        textarea.style.height = previousHeight;
        if (!force &&
            Math.abs(nextHeight - lastReportedHeightRef.current) < 8) {
            return;
        }
        lastReportedHeightRef.current = nextHeight;
        textarea.style.height = `${nextHeight}px`;
        reportRowHeight === null || reportRowHeight === void 0 ? void 0 : reportRowHeight(rowIndex, nextHeight);
    };
    (0, react_1.useLayoutEffect)(() => {
        if (focus) {
            if (ref.current) {
                ref.current.value = asyncRef.current.formatInputOnFocus(asyncRef.current.rowData);
                ref.current.focus();
                if (!wordWrap) {
                    ;
                    ref.current.select();
                }
                else {
                    const textarea = ref.current;
                    textarea.selectionStart = textarea.value.length;
                    textarea.selectionEnd = textarea.value.length;
                    lastReportedHeightRef.current = 0;
                    reportTextareaHeight(true);
                }
            }
            asyncRef.current.escPressed = false;
            asyncRef.current.focusedAt = Date.now();
        }
        else if (ref.current) {
            if (!asyncRef.current.escPressed &&
                !asyncRef.current.continuousUpdates &&
                !asyncRef.current.firstRender &&
                asyncRef.current.changedAt >= asyncRef.current.focusedAt) {
                asyncRef.current.setRowData(asyncRef.current.parseUserInput(ref.current.value));
            }
            ref.current.blur();
        }
    }, [focus, wordWrap]);
    (0, react_1.useEffect)(() => {
        if (!focus && ref.current && !wordWrap) {
            ref.current.value = asyncRef.current.formatBlurredInput(rowData);
        }
    }, [focus, rowData, wordWrap]);
    const displayValue = formatBlurredInput(rowData);
    if (wordWrap && !focus) {
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)('dsg-input', 'dsg-text-wrap-display', alignRight && 'dsg-input-align-right') }, displayValue));
    }
    const sharedProps = {
        placeholder: active ? placeholder : undefined,
        tabIndex: -1,
        style: { pointerEvents: focus ? 'auto' : 'none' },
        onChange: (e) => {
            asyncRef.current.changedAt = Date.now();
            if (continuousUpdates) {
                setRowData(parseUserInput(e.target.value));
            }
            if (wordWrap) {
                reportTextareaHeight();
            }
        },
        onKeyDown: (e) => {
            if (e.key === 'Escape') {
                asyncRef.current.escPressed = true;
            }
            if (wordWrap && e.key === 'Enter' && !e.altKey && !e.shiftKey) {
                e.preventDefault();
            }
        },
    };
    if (wordWrap) {
        return (react_1.default.createElement("textarea", Object.assign({}, sharedProps, { ref: textareaRef, defaultValue: displayValue, className: (0, classnames_1.default)('dsg-input', 'dsg-textarea', alignRight && 'dsg-input-align-right'), rows: 1 })));
    }
    return (react_1.default.createElement("input", Object.assign({}, sharedProps, { ref: inputRef, defaultValue: displayValue, className: (0, classnames_1.default)('dsg-input', alignRight && 'dsg-input-align-right') })));
});
TextComponent.displayName = 'TextComponent';
exports.textColumn = createTextColumn();
function createTextColumn({ placeholder, alignRight = false, wordWrap = false, continuousUpdates = true, deletedValue = null, parseUserInput = (value) => (value.trim() || null), formatBlurredInput = wordWrap
    ? (value) => String(value !== null && value !== void 0 ? value : '')
    : (value) => String(value !== null && value !== void 0 ? value : '').replace(/\n/g, ' '), formatInputOnFocus = (value) => String(value !== null && value !== void 0 ? value : ''), formatForCopy = (value) => String(value !== null && value !== void 0 ? value : ''), parsePastedValue = (value) => (value.replace(/\r/g, '').trim() || null), } = {}) {
    return {
        component: TextComponent,
        columnData: {
            placeholder,
            alignRight,
            wordWrap,
            continuousUpdates,
            formatInputOnFocus,
            formatBlurredInput,
            parseUserInput,
        },
        deleteValue: () => deletedValue,
        copyValue: ({ rowData }) => formatForCopy(rowData),
        pasteValue: ({ value }) => parsePastedValue(value),
        isCellEmpty: ({ rowData }) => rowData === null || rowData === undefined,
    };
}
exports.createTextColumn = createTextColumn;
//# sourceMappingURL=textColumn.js.map