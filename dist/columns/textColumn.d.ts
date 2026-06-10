import { Column } from '../types';
type TextColumnOptions<T> = {
    placeholder?: string;
    alignRight?: boolean;
    wordWrap?: boolean;
    continuousUpdates?: boolean;
    deletedValue?: T;
    parseUserInput?: (value: string) => T;
    formatBlurredInput?: (value: T) => string;
    formatInputOnFocus?: (value: T) => string;
    formatForCopy?: (value: T) => string;
    parsePastedValue?: (value: string) => T;
};
type TextColumnData<T> = {
    placeholder?: string;
    alignRight: boolean;
    wordWrap: boolean;
    continuousUpdates: boolean;
    parseUserInput: (value: string) => T;
    formatBlurredInput: (value: T) => string;
    formatInputOnFocus: (value: T) => string;
};
export declare const textColumn: Partial<Column<string | null, TextColumnData<string | null>, string>>;
export declare function createTextColumn<T = string | null>({ placeholder, alignRight, wordWrap, continuousUpdates, deletedValue, parseUserInput, formatBlurredInput, formatInputOnFocus, formatForCopy, parsePastedValue, }?: TextColumnOptions<T>): Partial<Column<T, TextColumnData<T>, string>>;
export {};
//# sourceMappingURL=textColumn.d.ts.map