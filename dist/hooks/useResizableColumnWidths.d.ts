import { Column } from '../types';
import { getColumnWidths } from './useColumnWidths';
export declare const useResizableColumnWidths: (columns: Column<any, any, any>[], width?: number, resizableColumns?: boolean) => {
    setColumnWidth: (index: number, nextWidth: number) => void;
    resizableColumns: boolean;
    fullWidth: boolean;
    columnWidths: undefined;
    columnRights: undefined;
    totalWidth: undefined;
} | {
    setColumnWidth: (index: number, nextWidth: number) => void;
    resizableColumns: boolean;
    fullWidth: boolean;
    columnWidths: number[];
    columnRights: number[];
    totalWidth: number;
};
export { getColumnWidths };
//# sourceMappingURL=useResizableColumnWidths.d.ts.map