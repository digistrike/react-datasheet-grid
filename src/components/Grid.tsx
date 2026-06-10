import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual'
import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import {
  Cell,
  Column,
  ContextMenuItem,
  DataSheetGridProps,
  Selection,
} from '../types'
import cx from 'classnames'
import { Cell as CellComponent } from './Cell'
import { useMemoizedIndexCallback } from '../hooks/useMemoizedIndexCallback'
import { measureRowContentHeight } from '../utils/measureRowContentHeight'
import {
  getColumnResizable,
  getColumnWordWrap,
} from '../utils/columnFeatures'

export const Grid = <T extends any>({
  data,
  columns,
  outerRef,
  innerRef,
  columnWidths,
  hasStickyRightColumn,
  displayHeight,
  headerRowHeight,
  rowHeight,
  baseRowHeight,
  rowKey,
  fullWidth,
  selection,
  activeCell,
  rowClassName,
  cellClassName,
  children,
  editing,
  getContextMenuItems,
  setRowData,
  deleteRows,
  duplicateRows,
  insertRowAfter,
  stopEditing,
  onScroll,
  wordWrap = false,
  hasWordWrap = false,
  resizableColumns = false,
  hasResizableColumns = false,
  resizableRows = false,
  onColumnResizeStart,
  onRowResizeStart,
  onRowHeightsChange,
}: {
  data: T[]
  columns: Column<T, any, any>[]
  outerRef: RefObject<HTMLDivElement>
  innerRef: RefObject<HTMLDivElement>
  columnWidths?: number[]
  hasStickyRightColumn: boolean
  displayHeight: number
  headerRowHeight: number
  rowHeight: (index: number) => { height: number }
  baseRowHeight: number
  rowKey: DataSheetGridProps<T>['rowKey']
  rowClassName: DataSheetGridProps<T>['rowClassName']
  cellClassName: DataSheetGridProps<T>['cellClassName']
  fullWidth: boolean
  selection: Selection | null
  activeCell: Cell | null
  children: ReactNode
  editing: boolean
  getContextMenuItems: () => ContextMenuItem[]
  setRowData: (rowIndex: number, item: T) => void
  deleteRows: (rowMin: number, rowMax?: number) => void
  duplicateRows: (rowMin: number, rowMax?: number) => void
  insertRowAfter: (row: number, count?: number) => void
  stopEditing: (opts?: { nextRow?: boolean }) => void
  onScroll?: React.UIEventHandler<HTMLDivElement>
  wordWrap?: boolean
  hasWordWrap?: boolean
  resizableColumns?: boolean
  hasResizableColumns?: boolean
  resizableRows?: boolean
  onColumnResizeStart?: (
    columnIndex: number,
    startX: number,
    startWidth: number
  ) => void
  onRowResizeStart?: (
    rowIndex: number,
    startY: number,
    startHeight: number
  ) => void
  onRowHeightsChange?: (heights: Record<number, number>) => void
}) => {
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => outerRef.current,
    paddingStart: headerRowHeight,
    estimateSize: (index) => rowHeight(index).height,
    getItemKey: (index: number): React.Key => {
      if (rowKey && index > 0) {
        const row = data[index - 1]
        if (typeof rowKey === 'function') {
          return rowKey({ rowData: row, rowIndex: index })
        } else if (
          typeof rowKey === 'string' &&
          row instanceof Object &&
          rowKey in row
        ) {
          const key = row[rowKey as keyof T]
          if (typeof key === 'string' || typeof key === 'number') {
            return key
          }
        }
      }
      return index
    },
    overscan: 5,
  })

  const colVirtualizer = useVirtualizer({
    count: columns.length,
    getScrollElement: () => outerRef.current,
    estimateSize: (index) => columnWidths?.[index] ?? 100,
    horizontal: true,
    getItemKey: (index: number): React.Key => columns[index].id ?? index,
    overscan: 1,
    rangeExtractor: (range) => {
      const result = defaultRangeExtractor(range)
      if (result[0] !== 0) {
        result.unshift(0)
      }
      if (
        hasStickyRightColumn &&
        result[result.length - 1] !== columns.length - 1
      ) {
        result.push(columns.length - 1)
      }
      return result
    },
  })

  useEffect(() => {
    colVirtualizer.measure()
  }, [colVirtualizer, columnWidths])

  useEffect(() => {
    rowVirtualizer.measure()
  }, [rowVirtualizer, hasWordWrap, columnWidths, data.length, rowHeight])

  const onRowHeightsChangeRef = useRef(onRowHeightsChange)
  onRowHeightsChangeRef.current = onRowHeightsChange

  const columnWidthsKey = columnWidths?.join(',') ?? ''
  const prevEditingRef = useRef(editing)
  const editingRef = useRef(editing)
  const activeCellRef = useRef(activeCell)
  editingRef.current = editing
  activeCellRef.current = activeCell

  const measureVisibleRows = useCallback(() => {
    if (!hasWordWrap || !onRowHeightsChangeRef.current || !innerRef.current) {
      return
    }

    const heights: Record<number, number> = {}
    const editingRow = editingRef.current
      ? activeCellRef.current?.row
      : undefined

    innerRef.current.querySelectorAll<HTMLElement>('.dsg-row-wrap').forEach(
      (rowElement) => {
        const index = Number(rowElement.dataset.index)

        if (Number.isNaN(index)) {
          return
        }

        if (editingRow === index) {
          return
        }

        heights[index] = measureRowContentHeight(rowElement, baseRowHeight)
      }
    )

    if (Object.keys(heights).length > 0) {
      onRowHeightsChangeRef.current(heights)
    }
  }, [hasWordWrap, baseRowHeight, innerRef])

  useLayoutEffect(() => {
    if (editing) {
      return
    }

    measureVisibleRows()
  }, [
    hasWordWrap,
    columnWidthsKey,
    data,
    baseRowHeight,
    editing,
    measureVisibleRows,
  ])

  useLayoutEffect(() => {
    if (prevEditingRef.current && !editing) {
      measureVisibleRows()
    }

    prevEditingRef.current = editing
  }, [editing, measureVisibleRows])

  const setGivenRowData = useMemoizedIndexCallback(setRowData, 1)
  const deleteGivenRow = useMemoizedIndexCallback(deleteRows, 0)
  const duplicateGivenRow = useMemoizedIndexCallback(duplicateRows, 0)
  const insertAfterGivenRow = useMemoizedIndexCallback(insertRowAfter, 0)

  const selectionColMin = selection?.min.col ?? activeCell?.col
  const selectionColMax = selection?.max.col ?? activeCell?.col
  const selectionMinRow = selection?.min.row ?? activeCell?.row
  const selectionMaxRow = selection?.max.row ?? activeCell?.row

  const lastStickyColumnIndex = hasStickyRightColumn
    ? columns.length - 1
    : columns.length

  return (
    <div
      ref={outerRef}
      className="dsg-container"
      onScroll={onScroll}
      style={{ height: displayHeight }}
    >
      <div
        ref={innerRef}
        style={{
          width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
          height: rowVirtualizer.getTotalSize(),
        }}
      >
        {headerRowHeight > 0 && (
          <div
            className={cx('dsg-row', 'dsg-row-header')}
            style={{
              width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
              height: headerRowHeight,
            }}
          >
            {colVirtualizer.getVirtualItems().map((col) => (
              <CellComponent
                key={col.key}
                gutter={col.index === 0}
                stickyRight={
                  hasStickyRightColumn && col.index === columns.length - 1
                }
                width={col.size}
                left={col.start}
                className={cx(
                  'dsg-cell-header',
                  selectionColMin !== undefined &&
                    selectionColMax !== undefined &&
                    selectionColMin <= col.index - 1 &&
                    selectionColMax >= col.index - 1 &&
                    'dsg-cell-header-active',
                  columns[col.index].headerClassName
                )}
              >
                <div className="dsg-cell-header-container">
                  {columns[col.index].title}
                </div>
              </CellComponent>
            ))}
            {hasResizableColumns && (
              <div className="dsg-column-resize-layer">
                {colVirtualizer.getVirtualItems().map((col) => {
                  if (
                    col.index === 0 ||
                    col.index >= lastStickyColumnIndex ||
                    !getColumnResizable(columns[col.index], resizableColumns)
                  ) {
                    return null
                  }

                  return (
                    <div
                      key={`resize-${col.key}`}
                      className="dsg-column-resize-handle"
                      style={{ left: col.start + col.size - 3 }}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onColumnResizeStart?.(
                          col.index,
                          event.clientX,
                          col.size
                        )
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}
        {rowVirtualizer.getVirtualItems().map((row) => {
          const rowActive = Boolean(
            row.index >= (selectionMinRow ?? Infinity) &&
              row.index <= (selectionMaxRow ?? -Infinity)
          )
          return (
            <div
              key={row.key}
              data-index={row.index}
              className={cx(
                'dsg-row',
                hasWordWrap && 'dsg-row-wrap',
                typeof rowClassName === 'string' ? rowClassName : null,
                typeof rowClassName === 'function'
                  ? rowClassName({
                      rowData: data[row.index],
                      rowIndex: row.index,
                    })
                  : null
              )}
              style={{
                height: row.size,
                top: row.start,
                width: fullWidth ? '100%' : colVirtualizer.getTotalSize(),
              }}
            >
              {colVirtualizer.getVirtualItems().map((col) => {
                const colCellClassName = columns[col.index].cellClassName
                const disabled = columns[col.index].disabled
                const Component = columns[col.index].component
                const cellDisabled =
                  disabled === true ||
                  (typeof disabled === 'function' &&
                    disabled({
                      rowData: data[row.index],
                      rowIndex: row.index,
                    }))
                const cellIsActive =
                  activeCell?.row === row.index &&
                  activeCell.col === col.index - 1

                return (
                  <CellComponent
                    key={col.key}
                    gutter={col.index === 0}
                    stickyRight={
                      hasStickyRightColumn && col.index === columns.length - 1
                    }
                    active={col.index === 0 && rowActive}
                    disabled={cellDisabled}
                    wordWrap={getColumnWordWrap(columns[col.index], wordWrap)}
                    className={cx(
                      typeof colCellClassName === 'function'
                        ? colCellClassName({
                            rowData: data[row.index],
                            rowIndex: row.index,
                            columnId: columns[col.index].id,
                          })
                        : colCellClassName,
                      typeof cellClassName === 'function'
                        ? cellClassName({
                            rowData: data[row.index],
                            rowIndex: row.index,
                            columnId: columns[col.index].id,
                          })
                        : cellClassName
                    )}
                    width={col.size}
                    left={col.start}
                  >
                    <Component
                      rowData={data[row.index]}
                      getContextMenuItems={getContextMenuItems}
                      disabled={cellDisabled}
                      active={cellIsActive}
                      columnIndex={col.index - 1}
                      rowIndex={row.index}
                      focus={cellIsActive && editing}
                      deleteRow={deleteGivenRow(row.index)}
                      duplicateRow={duplicateGivenRow(row.index)}
                      stopEditing={stopEditing}
                      insertRowBelow={insertAfterGivenRow(row.index)}
                      setRowData={setGivenRowData(row.index)}
                      columnData={columns[col.index].columnData}
                    />
                  </CellComponent>
                )
              })}
            </div>
          )
        })}
        {children}
      </div>
    </div>
  )
}
