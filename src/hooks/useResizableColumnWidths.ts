import { Column } from '../types'
import { useCallback, useMemo, useState } from 'react'
import { getColumnWidths, useColumnWidths } from './useColumnWidths'

const buildColumnRights = (columnWidths: number[]) => {
  let totalWidth = 0

  return columnWidths.map((w, i) => {
    totalWidth += w
    return i === columnWidths.length - 1 ? Infinity : totalWidth
  })
}

export const useResizableColumnWidths = (
  columns: Column<any, any, any>[],
  width?: number,
  resizableColumns = false
) => {
  const [overrides, setOverrides] = useState<Record<number, number>>({})

  const flexResult = useColumnWidths(columns, width)

  const setColumnWidth = useCallback(
    (index: number, nextWidth: number) => {
      const minWidth = columns[index]?.minWidth ?? 0
      const maxWidth = columns[index]?.maxWidth

      let width = Math.max(minWidth, nextWidth)

      if (maxWidth !== undefined) {
        width = Math.min(maxWidth, width)
      }

      setOverrides((prev) => ({ ...prev, [index]: width }))
    },
    [columns]
  )

  return useMemo(() => {
    if (!flexResult.columnWidths || width === undefined) {
      return {
        ...flexResult,
        setColumnWidth,
        resizableColumns,
      }
    }

    const hasOverrides = Object.keys(overrides).length > 0

    if (!hasOverrides) {
      return {
        ...flexResult,
        setColumnWidth,
        resizableColumns,
      }
    }

    const columnWidths = flexResult.columnWidths.map(
      (columnWidth, index) => overrides[index] ?? columnWidth
    )

    const totalWidth = columnWidths.reduce((acc, cur) => acc + cur, 0)
    const columnRights = buildColumnRights(columnWidths)

    return {
      fullWidth: Math.abs(width - totalWidth) < 0.1,
      columnWidths,
      columnRights,
      totalWidth,
      setColumnWidth,
      resizableColumns,
    }
  }, [flexResult, overrides, resizableColumns, setColumnWidth, width])
}

export { getColumnWidths }
