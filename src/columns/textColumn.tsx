import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'
import cx from 'classnames'
import { useFirstRender } from '../hooks/useFirstRender'
import { useGridContext } from '../context/GridContext'

type TextColumnOptions<T> = {
  placeholder?: string
  alignRight?: boolean
  wordWrap?: boolean
  // When true, data is updated as the user types, otherwise it is only updated on blur. Default to true
  continuousUpdates?: boolean
  // Value to use when deleting the cell
  deletedValue?: T
  // Parse what the user types
  parseUserInput?: (value: string) => T
  // Format the value of the input when it is blurred
  formatBlurredInput?: (value: T) => string
  // Format the value of the input when it gets focused
  formatInputOnFocus?: (value: T) => string
  // Format the value when copy
  formatForCopy?: (value: T) => string
  // Parse the pasted value
  parsePastedValue?: (value: string) => T
}

type TextColumnData<T> = {
  placeholder?: string
  alignRight: boolean
  wordWrap: boolean
  continuousUpdates: boolean
  parseUserInput: (value: string) => T
  formatBlurredInput: (value: T) => string
  formatInputOnFocus: (value: T) => string
}

const TextComponent = React.memo<
  CellProps<string | null, TextColumnData<string | null>>
>(
  ({
    active,
    focus,
    rowData,
    rowIndex,
    setRowData,
    columnData: {
      placeholder,
      alignRight,
      wordWrap: columnWordWrap,
      formatInputOnFocus,
      formatBlurredInput,
      parseUserInput,
      continuousUpdates,
    },
  }) => {
    const { wordWrap: gridWordWrap, reportRowHeight } = useGridContext()
    const wordWrap = columnWordWrap || gridWordWrap
    const inputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const ref = wordWrap ? textareaRef : inputRef
    const firstRender = useFirstRender()

    const asyncRef = useRef({
      rowData,
      formatInputOnFocus,
      formatBlurredInput,
      setRowData,
      parseUserInput,
      continuousUpdates,
      firstRender,
      focusedAt: 0,
      changedAt: 0,
      escPressed: false,
    })
    asyncRef.current = {
      rowData,
      formatInputOnFocus,
      formatBlurredInput,
      setRowData,
      parseUserInput,
      continuousUpdates,
      firstRender,
      focusedAt: asyncRef.current.focusedAt,
      changedAt: asyncRef.current.changedAt,
      escPressed: asyncRef.current.escPressed,
    }

    const lastReportedHeightRef = useRef(0)

    const reportTextareaHeight = (force = false) => {
      const textarea = textareaRef.current

      if (!wordWrap || !textarea) {
        return
      }

      const previousHeight = textarea.style.height
      textarea.style.height = '0px'
      const nextHeight = textarea.scrollHeight
      textarea.style.height = previousHeight

      if (
        !force &&
        Math.abs(nextHeight - lastReportedHeightRef.current) < 8
      ) {
        return
      }

      lastReportedHeightRef.current = nextHeight
      textarea.style.height = `${nextHeight}px`
      reportRowHeight?.(rowIndex, nextHeight)
    }

    useLayoutEffect(() => {
      if (focus) {
        if (ref.current) {
          ref.current.value = asyncRef.current.formatInputOnFocus(
            asyncRef.current.rowData
          )
          ref.current.focus()

          if (!wordWrap) {
            ;(ref.current as HTMLInputElement).select()
          } else {
            const textarea = ref.current as HTMLTextAreaElement
            textarea.selectionStart = textarea.value.length
            textarea.selectionEnd = textarea.value.length
            lastReportedHeightRef.current = 0
            reportTextareaHeight(true)
          }
        }

        asyncRef.current.escPressed = false
        asyncRef.current.focusedAt = Date.now()
      } else if (ref.current) {
        if (
          !asyncRef.current.escPressed &&
          !asyncRef.current.continuousUpdates &&
          !asyncRef.current.firstRender &&
          asyncRef.current.changedAt >= asyncRef.current.focusedAt
        ) {
          asyncRef.current.setRowData(
            asyncRef.current.parseUserInput(ref.current.value)
          )
        }
        ref.current.blur()
      }
    }, [focus, wordWrap])

    useEffect(() => {
      if (!focus && ref.current && !wordWrap) {
        ref.current.value = asyncRef.current.formatBlurredInput(rowData)
      }
    }, [focus, rowData, wordWrap])

    const displayValue = formatBlurredInput(rowData)

    if (wordWrap && !focus) {
      return (
        <div
          className={cx(
            'dsg-input',
            'dsg-text-wrap-display',
            alignRight && 'dsg-input-align-right'
          )}
        >
          {displayValue}
        </div>
      )
    }

    const sharedProps = {
      placeholder: active ? placeholder : undefined,
      tabIndex: -1 as const,
      style: { pointerEvents: focus ? ('auto' as const) : ('none' as const) },
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        asyncRef.current.changedAt = Date.now()

        if (continuousUpdates) {
          setRowData(parseUserInput(e.target.value))
        }

        if (wordWrap) {
          reportTextareaHeight()
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          asyncRef.current.escPressed = true
        }

        if (wordWrap && e.key === 'Enter' && !e.altKey && !e.shiftKey) {
          e.preventDefault()
        }
      },
    }

    if (wordWrap) {
      return (
        <textarea
          {...sharedProps}
          ref={textareaRef}
          defaultValue={displayValue}
          className={cx(
            'dsg-input',
            'dsg-textarea',
            alignRight && 'dsg-input-align-right'
          )}
          rows={1}
        />
      )
    }

    return (
      <input
        {...sharedProps}
        ref={inputRef}
        defaultValue={displayValue}
        className={cx('dsg-input', alignRight && 'dsg-input-align-right')}
      />
    )
  }
)

TextComponent.displayName = 'TextComponent'

export const textColumn = createTextColumn<string | null>()

export function createTextColumn<T = string | null>({
  placeholder,
  alignRight = false,
  wordWrap = false,
  continuousUpdates = true,
  deletedValue = null as unknown as T,
  parseUserInput = (value) => (value.trim() || null) as unknown as T,
  formatBlurredInput = wordWrap
    ? (value) => String(value ?? '')
    : (value) => String(value ?? '').replace(/\n/g, ' '),
  formatInputOnFocus = (value) => String(value ?? ''),
  formatForCopy = (value) => String(value ?? ''),
  parsePastedValue = (value) =>
    (value.replace(/\r/g, '').trim() || (null as unknown)) as T,
}: TextColumnOptions<T> = {}): Partial<Column<T, TextColumnData<T>, string>> {
  return {
    component: TextComponent as unknown as CellComponent<T, TextColumnData<T>>,
    columnData: {
      placeholder,
      alignRight,
      wordWrap,
      continuousUpdates,
      formatInputOnFocus,
      formatBlurredInput,
      parseUserInput,
    },
    deleteValue: () => deletedValue,
    copyValue: ({ rowData }) => formatForCopy(rowData),
    pasteValue: ({ value }) => parsePastedValue(value),
    isCellEmpty: ({ rowData }) => rowData === null || rowData === undefined,
  }
}
