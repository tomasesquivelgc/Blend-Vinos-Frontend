import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchPaginatedWines, deleteWine } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Inventario() {
  const location = useLocation()
  const navigate = useNavigate()
  const [wines, setWines] = useState(location.state?.searchResults || [])
  const [loading, setLoading] = useState(!location.state?.searchResults)
  const [error, setError] = useState(null)
  const [noResultsMessage, setNoResultsMessage] = useState('')
  const [page, setPage] = useState(0)
  const [limit] = useState(12)
  const [orderBy, setOrderBy] = useState('total')
  const [order, setOrder] = useState('DESC')
  const { user } = useAuth()

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const q = queryParams.get('q')?.trim() || ''

  useEffect(() => {
    if (location.state?.searchResults) {
      // If search results are passed via state, update wines and skip fetching
      setWines(location.state.searchResults)
      setLoading(false)
      setError(null)
      setNoResultsMessage('')
      return
    }

    const abortController = new AbortController()
    setLoading(true)
    setError(null)
    setNoResultsMessage('')

    async function load() {
      try {
        const data = await fetchPaginatedWines({ page, limit, order, orderBy, q, signal: abortController.signal })
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? []
        setWines(list)
        if (q && list.length === 0) {
          setNoResultsMessage('ningun vino encontrado con ese nombre')
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          const msg = String(err?.message || '').toLowerCase()
          if (q && (msg.includes('404') || msg.includes('not found') || msg.includes('no se encontro') || msg.includes('notfound'))) {
            setWines([])
            setNoResultsMessage('ningun vino encontrado con ese nombre')
          } else {
            setError(err.message || 'Failed to load wines')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => abortController.abort()
  }, [location.key, page, limit, order, orderBy, q, location.state])

  // Reset to first page when the search query changes
  useEffect(() => {
    setPage(0)
  }, [q])

  // We no longer filter client-side — the API returns matching wines when `q` is set.
  const filteredWines = useMemo(() => wines, [wines])

  const handleClearSearch = () => {
    queryParams.delete('q')
    navigate({ pathname: '/inventario', search: queryParams.toString() ? `?${queryParams}` : '' }, { replace: true, state: null })
  }

  const handleCreate = () => navigate('/inventario/nuevo')
  const handleEdit = (id) => navigate(`/inventario/editar/${id}`)

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar este vino? Esta acción no se puede deshacer.')
    if (!confirmed) return
    try {
      await deleteWine(id)
      setWines(prev => prev.filter(w => (w.id || w._id) !== id))
    } catch (e) {
      alert(e.message || 'Error eliminando el vino')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Ordenar por</span>
            <select
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blend-purple focus:outline-none  bg-white"
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
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blend-purple focus:outline-none bg-white"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </label>
        </div>
        {user?.rol_id === 1 && (
          <div>
            <button className="rounded bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer px-3 py-2 text-white" onClick={handleCreate}>Crear nuevo vino</button>
          </div>
        )}
      </div>
      

      {loading && <div className="text-gray-600">Cargando vinos...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWines.map((wine) => (
              <div key={wine.id || wine._id} className="rounded border border-gray-200 p-4 shadow-sm bg-white">
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <div className="text-lg font-medium">{wine.nombre || 'Sin nombre'}</div>
                    <div className="text-sm text-gray-700">{wine.codigo || 'Codigo desconocido'}</div>
                    <div className="text-sm text-gray-700">{wine.cepa || 'Cepa desconocida'}</div>
                    <div className="text-sm text-gray-700">Costo: <span className="font-semibold">${wine.costo}</span></div>
                    <div className="text-sm text-gray-700">Stock: <span className="font-semibold">{wine.total ?? wine.total}</span></div>
                    <div className="text-sm text-gray-700">Precio Recomendado de venta: <span className="font-semibold">${wine.precioRecomendado ?? '-'}</span></div>
                  </div>
                  {user?.rol_id === 1 && (
                    <div className="flex gap-2">
                      <button className="rounded border px-2 py-1 text-sm text-blend-purple hover:cursor-pointer" onClick={() => handleEdit(wine.id || wine._id)}>Editar</button>
                      <button className="rounded border px-2 py-1 text-sm text-red-700 hover:cursor-pointer" onClick={() => handleDelete(wine.id || wine._id)}>Eliminar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredWines.length === 0 && <div className="text-gray-600">{noResultsMessage || 'No se encontraron vinos.'}</div>}
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              className={`px-3 py-1 rounded border ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 border-blend-purple hover:cursor-pointer'}`}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Anterior
            </button>

            <span className="text-sm text-gray-700">Página {page + 1}</span>

            <button
              type="button"
              className={`px-3 py-1 rounded border ${(wines.length < limit) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 border-blend-purple hover:cursor-pointer'}`}
              onClick={() => setPage((p) => p + 1)}
              disabled={wines.length < limit}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
