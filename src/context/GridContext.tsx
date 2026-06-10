import React, { createContext, useContext } from 'react'

export type GridContextValue = {
  wordWrap: boolean
  reportRowHeight?: (rowIndex: number, height: number) => void
}

export const GridContext = createContext<GridContextValue>({
  wordWrap: false,
})

export const useGridContext = (): GridContextValue => useContext(GridContext)
