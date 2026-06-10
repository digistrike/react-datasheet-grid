import { Column, SimpleColumn } from '../types';
export declare const parseFlexValue: (value: string | number) => {
    basis: number;
    grow: number;
    shrink: number;
};
export declare const useColumns: <T extends unknown>(columns: Partial<Column<T, any, any>>[], gutterColumn?: false | Partial<Pick<Column<T, any, string>, "title" | "maxWidth" | "minWidth" | "basis" | "grow" | "shrink" | "wordWrap" | "resizable" | "component" | "columnData">> | undefined, stickyRightColumn?: Partial<Pick<Column<T, any, string>, "title" | "maxWidth" | "minWidth" | "basis" | "grow" | "shrink" | "wordWrap" | "resizable" | "component" | "columnData">> | undefined) => Column<T, any, any>[];
//# sourceMappingURL=useColumns.d.ts.map