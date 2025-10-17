import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPaginatedWines } from '../lib/api.js'

export default function AcumuladoList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    setError(null)
    fetchPaginatedWines({ page: 0, limit: 5, order: 'DESC', orderBy: 'total', signal: abortController.signal })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setItems(list)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load list')
      })
      .finally(() => setLoading(false))

    return () => abortController.abort()
  }, [])

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1 text-center">
          <h3 className="text-xl font-semibold">Acumulado</h3>
        </div>
        <Link
          to="/inventario"
          className="text-sm text-blend-purple hover:underline"
        >
          Ver inventario
        </Link>
      </div>
      {loading && <div className="text-gray-600">Cargando lista...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && !error && (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {items.map((w) => (
            <li key={w.id || w._id || w.codigo} className="p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{w.nombre || w.name || 'Sin nombre'}</div>
                  <div className="text-sm text-gray-600">{w.cepa || w.varietal || ''}</div>
                </div>
                <div className="text-sm text-gray-700">Total: {w.total ?? '-'}</div>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-3 text-gray-600">Sin resultados</li>
          )}
        </ul>
      )}
    </section>
  )
}


