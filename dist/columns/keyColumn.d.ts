import { Column } from '../types';
type ColumnData = {
    key: string;
    original: Partial<Column<any, any, any>>;
    wordWrap?: boolean;
};
export declare const keyColumn: <T extends Record<string, any>, K extends keyof T = keyof T, PasteValue = string>(key: K, column: Partial<Column<T[K], any, PasteValue>>) => Partial<Column<T, ColumnData, PasteValue>>;
export {};
//# sourceMappingURL=keyColumn.d.ts.map