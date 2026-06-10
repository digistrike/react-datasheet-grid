import { Column } from '../types';
/** Per-column override, otherwise falls back to the grid-level default. */
export declare const getColumnWordWrap: (column: Pick<Column<any, any, any>, 'wordWrap'>, gridWordWrap: boolean) => boolean;
/** Per-column override, otherwise falls back to the grid-level default. */
export declare const getColumnResizable: (column: Pick<Column<any, any, any>, 'resizable'>, gridResizableColumns: boolean) => boolean;
export declare const hasAnyWordWrap: (columns: Pick<Column<any, any, any>, 'wordWrap'>[], gridWordWrap: boolean) => boolean;
export declare const hasAnyResizableColumns: (columns: Pick<Column<any, any, any>, 'resizable'>[], gridResizableColumns: boolean) => boolean;
//# sourceMappingURL=columnFeatures.d.ts.map