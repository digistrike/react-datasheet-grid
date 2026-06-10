import { DataSheetGridProps, DataSheetGridRef } from '../types'
import { useState } from 'react'
import { DataSheetGrid } from './DataSheetGrid'
import React from 'react'

export const StaticDataSheetGrid = React.forwardRef<
  DataSheetGridRef,
  DataSheetGridProps<any>
>(
  <T extends any>(
    {
      columns,
      gutterColumn,
      stickyRightColumn,
      addRowsComponent,
      createRow,
      duplicateRow,
      style,
      rowKey,
      onFocus,
      onBlur,
      onActiveCellChange,
      onSelectionChange,
      rowClassName,
      rowHeight,
      wordWrap,
      resizableColumns,
      resizableRows,
      onColumnResize,
      onRowResize,
      ...rest
    }: DataSheetGridProps<T>,
    ref: React.ForwardedRef<DataSheetGridRef>
  ) => {
    const [staticProps] = useState({
      columns,
      gutterColumn,
      stickyRightColumn,
      addRowsComponent,
      createRow,
      duplicateRow,
      style,
      rowKey,
      onFocus,
      onBlur,
      onActiveCellChange,
      onSelectionChange,
      rowClassName,
      rowHeight,
      wordWrap,
      resizableColumns,
      resizableRows,
      onColumnResize,
      onRowResize,
    })

    return (
      <DataSheetGrid
        {...staticProps}
        {...rest}
        rowHeight={
          typeof rowHeight === 'number' ? rowHeight : staticProps.rowHeight
        }
        wordWrap={wordWrap ?? staticProps.wordWrap}
        resizableColumns={resizableColumns ?? staticProps.resizableColumns}
        resizableRows={resizableRows ?? staticProps.resizableRows}
        onColumnResize={onColumnResize ?? staticProps.onColumnResize}
        onRowResize={onRowResize ?? staticProps.onRowResize}
        ref={ref}
      />
    )
  }
) as <T extends any>(
  props: DataSheetGridProps<T> & { ref?: React.ForwardedRef<DataSheetGridRef> }
) => JSX.Element
