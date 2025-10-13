import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchPaginatedWines } from '../lib/api.js'

export default function Inventario() {
  const location = useLocation()
  const navigate = useNavigate()
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page] = useState(0)
  const [limit] = useState(50)
  const [orderBy, setOrderBy] = useState('total')
  const [order, setOrder] = useState('DESC')

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const q = queryParams.get('q')?.trim() || ''

  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    setError(null)

    fetchPaginatedWines({ page, limit, order, orderBy, signal: abortController.signal })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setWines(list)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load wines')
      })
      .finally(() => setLoading(false))

    return () => abortController.abort()
  }, [location.key, page, limit, order, orderBy])

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
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="text-2xl font-semibold">Inventario</h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Ordenar por</span>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="nombre">nombre</option>
              <option value="cepa">cepa</option>
              <option value="anejamiento">anejamiento</option>
              <option value="bodega">bodega</option>
              <option value="distribuidor">distribuidor</option>
              <option value="estilo">estilo</option>
              <option value="costo">costo</option>
              <option value="total">total</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Orden</span>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </label>
        </div>
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


