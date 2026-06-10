import React from 'react';
export type GridContextValue = {
    wordWrap: boolean;
    reportRowHeight?: (rowIndex: number, height: number) => void;
};
export declare const GridContext: React.Context<GridContextValue>;
export declare const useGridContext: () => GridContextValue;
//# sourceMappingURL=GridContext.d.ts.map