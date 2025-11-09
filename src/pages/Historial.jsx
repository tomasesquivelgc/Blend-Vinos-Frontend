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
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' })
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
}, [year, month])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded text-blend-purple hover:cursor-pointer" onClick={goPrevMonth} aria-label="Mes anterior">←</button>
          <span className="min-w-[180px] text-center capitalize">{monthLabel}</span>
          {(() => {
            const today = new Date()
            const currentYear = today.getFullYear()
            const currentMonth = today.getMonth() + 1
            const isCurrent = year === currentYear && month === currentMonth
            return (
              <button
                className={`px-3 py-1 border rounded ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'text-blend-purple hover:cursor-pointer'}`}
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
        <div className="">
          {data.length === 0 && <p>No hay movimientos para este mes.</p>}
          {console.log(data)}
          {data.map((item) => (
            <div
              key={item.id}
              className="border p-3 bg-white grid grid-cols-1 md:grid-cols-7 items-center"
            >
              {/* Fecha */}
              <div className="text-sm text-gray-600">
                {item.fecha ? new Date(item.fecha).toLocaleString() : 'Sin fecha'}
              </div>

              {/* Vino */}
              <div className="font-medium">
                {item.vino_nombre || (item.vino_id ? `Vino #${item.vino_id}` : 'Sin vino')}
              </div>

              {/* Tipo */}
              <div className="text-sm">
                {item.accion ? `Tipo: ${item.accion}` : 'Sin tipo'}
              </div>

              {/* Comentario */}
              <div className="text-sm text-gray-700 truncate">
                {item.comentario && item.comentario.trim().length > 0 ? item.comentario : 'Sin comentario'}
              </div>

              {/* Cliente */}
              <div className="text-sm text-gray-700">
                {item.nombre_de_cliente != null ? `Cliente: ${item.nombre_de_cliente}` : 'Sin cliente'}
              </div>

              {/* Cantidad */}
              <div
                className={`text-lg font-semibold text-right md:text-left ${
                  item.accion === 'VENTA' ? 'text-green-700' : item.accion ? 'text-blue-700' : 'text-gray-700'
                }`}
              >
                {item.cantidad ?? '—'}
              </div>

              {/* Precio */}
              <div className="text-sm text-gray-700">
                {item.costo ? `$${item.costo}` : 'Sin precio'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


