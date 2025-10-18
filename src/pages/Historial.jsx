import { useEffect, useMemo, useState } from 'react'
import { fetchMovementsByMonth } from '../lib/api.js'

export default function Historial() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1) // JS months are 0-11
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const result = await fetchMovementsByMonth({ year, month, signal: abortController.signal })
        setData(Array.isArray(result) ? result : result?.items ?? [])
      } catch (e) {
        if (e && (e.name === 'AbortError' || e.code === 20)) return
        setError(e?.message || 'Failed to load movements')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => abortController.abort()
  }, [year, month])

  function goPrevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  function goNextMonth() {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1
    if (year === currentYear && month === currentMonth) return
    if (month === 12) {
      setMonth(1)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  const monthLabel = useMemo(() => {
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
  }, [year, month])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Historial</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" onClick={goPrevMonth} aria-label="Mes anterior">←</button>
          <span className="min-w-[180px] text-center capitalize">{monthLabel}</span>
          {(() => {
            const today = new Date()
            const currentYear = today.getFullYear()
            const currentMonth = today.getMonth() + 1
            const isCurrent = year === currentYear && month === currentMonth
            return (
              <button
                className={`px-3 py-1 border rounded ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={goNextMonth}
                aria-label="Mes siguiente"
                disabled={isCurrent}
              >
                →
              </button>
            )
          })()}
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2">
          {data.length === 0 && <p>No hay movimientos para este mes.</p>}
          {data.map(item => (
            <div key={item.id} className="border rounded p-3 flex items-center justify-between bg-white">
              <div className="space-y-1">
                <div className="text-sm text-gray-600">{item.fecha ? new Date(item.fecha).toLocaleString() : ''}</div>
                <div className="font-medium">{item.vino_nombre || `Vino #${item.vino_id}`}</div>
                <div className="text-sm">Tipo: {item.accion}</div>
                {item.comentario ? <div className="text-sm text-gray-700">{item.comentario}</div> : null}
                {item.cliente_id != null ? (
                  <div className="text-sm text-gray-700">Cliente: #{item.cliente_id}</div>
                ) : null}
              </div>
              <div className={`text-lg font-semibold ${item.accion === 'VENTA' ? 'text-green-700' : 'text-blue-700'}`}>
                {item.cantidad}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


