import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchWines } from '../lib/api.js'

export default function Inventario() {
  const location = useLocation()
  const navigate = useNavigate()
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const q = queryParams.get('q')?.trim() || ''

  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    setError(null)

    fetchWines({ signal: abortController.signal })
      .then((data) => {
        setWines(Array.isArray(data) ? data : data?.wines ?? [])
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load wines')
      })
      .finally(() => setLoading(false))

    return () => abortController.abort()
  }, [location.key])

  const filteredWines = useMemo(() => {
    if (!q) return wines
    const lower = q.toLowerCase()
    return wines.filter((w) =>
      String(w.name || '').toLowerCase().includes(lower) ||
      String(w.varietal || '').toLowerCase().includes(lower) ||
      String(w.region || '').toLowerCase().includes(lower)
    )
  }, [wines, q])

  const handleClearSearch = () => {
    queryParams.delete('q')
    navigate({ pathname: '/inventario', search: queryParams.toString() ? `?${queryParams}` : '' }, { replace: true })
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Inventario</h2>
        {q && (
          <div className="text-sm text-gray-600">
            Mostrando resultados para: <span className="font-medium">{q}</span>
            <button className="ml-2 text-blue-600 hover:underline" onClick={handleClearSearch}>Limpiar</button>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-gray-600">Cargando vinos...</div>
      )}
      {error && (
        <div className="text-red-600">Error: {error}</div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWines.map((wine) => (
            <div key={wine.id || wine._id} className="rounded border border-gray-200 p-4 shadow-sm">
              <div className="mb-1 text-lg font-medium">{wine.nombre || 'Sin nombre'}</div>
              <div className="text-sm text-gray-600">{wine.cepa || 'Cepa desconocida'}</div>
              <div className="text-sm text-gray-600">{wine.costo}</div>
              <div className="mt-2 flex justify-end">{wine.stockreal}</div>
            </div>
          ))}
          {filteredWines.length === 0 && (
            <div className="text-gray-600">No se encontraron vinos.</div>
          )}
        </div>
      )}
    </div>
  )
}


