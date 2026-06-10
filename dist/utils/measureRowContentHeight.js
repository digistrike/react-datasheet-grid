"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureRowContentHeight = void 0;
const measureWrappedElement = (content, maxWidth) => {
    var _a;
    const styles = window.getComputedStyle(content);
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.pointerEvents = 'none';
    measureDiv.style.left = '-9999px';
    measureDiv.style.top = '0';
    measureDiv.style.width = `${Math.max(0, maxWidth)}px`;
    measureDiv.style.whiteSpace = styles.whiteSpace || 'pre-wrap';
    measureDiv.style.wordBreak = styles.wordBreak || 'break-word';
    measureDiv.style.overflowWrap = styles.overflowWrap || 'anywhere';
    measureDiv.style.lineHeight = styles.lineHeight;
    measureDiv.style.fontSize = styles.fontSize;
    measureDiv.style.fontFamily = styles.fontFamily;
    measureDiv.style.padding = styles.padding;
    measureDiv.style.boxSizing = 'border-box';
    measureDiv.textContent = (_a = content.textContent) !== null && _a !== void 0 ? _a : '';
    document.body.appendChild(measureDiv);
    const height = Math.ceil(measureDiv.getBoundingClientRect().height);
    document.body.removeChild(measureDiv);
    return height;
};
const measureContentHeight = (cell) => {
    const content = cell.querySelector('.dsg-text-wrap-display, .dsg-textarea, .dsg-input');
    if (!content) {
        return 0;
    }
    const cellWidth = cell.clientWidth;
    if (content.classList.contains('dsg-text-wrap-display')) {
        return measureWrappedElement(content, cellWidth);
    }
    const styles = window.getComputedStyle(content);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    if (content instanceof HTMLTextAreaElement) {
        const previousHeight = content.style.height;
        content.style.height = 'auto';
        const height = Math.ceil(content.scrollHeight + paddingTop + paddingBottom);
        content.style.height = previousHeight;
        return height;
    }
    return Math.ceil(content.scrollHeight + paddingTop + paddingBottom);
};
const measureRowContentHeight = (rowElement, baseRowHeight) => {
    let maxHeight = baseRowHeight;
    rowElement.querySelectorAll('.dsg-cell-wrap').forEach((cell) => {
        const contentHeight = measureContentHeight(cell);
        if (contentHeight > 0) {
            maxHeight = Math.max(maxHeight, contentHeight);
        }
    });
    return maxHeight;
};
exports.measureRowContentHeight = measureRowContentHeight;
//# sourceMappingURL=measureRowContentHeight.js.map