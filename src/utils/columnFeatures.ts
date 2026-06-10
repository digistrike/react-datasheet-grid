import { Column } from '../types'

/** Per-column override, otherwise falls back to the grid-level default. */
export const getColumnWordWrap = (
  column: Pick<Column<any, any, any>, 'wordWrap'>,
  gridWordWrap: boolean
): boolean => {
  if (column.wordWrap === true) {
    return true
  }

  if (column.wordWrap === false) {
    return false
  }

  return gridWordWrap
}

/** Per-column override, otherwise falls back to the grid-level default. */
export const getColumnResizable = (
  column: Pick<Column<any, any, any>, 'resizable'>,
  gridResizableColumns: boolean
): boolean => {
  if (column.resizable === true) {
    return true
  }

  if (column.resizable === false) {
    return false
  }

  return gridResizableColumns
}

export const hasAnyWordWrap = (
  columns: Pick<Column<any, any, any>, 'wordWrap'>[],
  gridWordWrap: boolean
): boolean => columns.some((column) => getColumnWordWrap(column, gridWordWrap))

export const hasAnyResizableColumns = (
  columns: Pick<Column<any, any, any>, 'resizable'>[],
  gridResizableColumns: boolean
): boolean =>
  columns.some((column) => getColumnResizable(column, gridResizableColumns))
