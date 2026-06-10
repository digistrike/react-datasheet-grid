import React, { useState } from 'react'
import {
  checkboxColumn,
  Column,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from '../../src'
import '../../src/style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
  notes: string | null
}

function App() {
  const [data, setData] = useState<Row[]>([
    {
      active: true,
      firstName: 'Elon',
      lastName: 'Musk',
      notes:
        'CEO of Tesla and SpaceX.\nLong notes wrap automatically when wordWrap is enabled.',
    },
    {
      active: false,
      firstName: 'Jeff',
      lastName: 'Bezos',
      notes: 'Founder of Amazon.',
    },
  ])
  const [wordWrap, setWordWrap] = useState(false)
  const [resizableColumns, setResizableColumns] = useState(false)

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
      grow: 0.5,
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
      // resizable: true,
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
      grow: 2,
      resizable: true,
    },
    {
      ...keyColumn<Row, 'notes'>('notes', textColumn),
      title: 'Notes',
      grow: 2,
      wordWrap: true,
    },
  ]

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '16px',
          color: '#555',
        }}
      >
        <p style={{ margin: 0 }}>
          Global toggles apply to all columns. Per-column flags on First name,
          Last name, and Notes work even when globals are off.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={wordWrap}
              onChange={(e) => setWordWrap(e.target.checked)}
            />
            Global word wrap
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={resizableColumns}
              onChange={(e) => setResizableColumns(e.target.checked)}
            />
            Global resizable columns
          </label>
        </div>
      </div>
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={columns}
        // wordWrap={wordWrap} 
        // resizableColumns={resizableColumns}
        height={500}
      />
    </div>
  )
}

export default App
