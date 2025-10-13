import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchWineByCode } from '../lib/api.js'

export default function ProductDetail() {
  const { id } = useParams()
  const location = useLocation()
  const initialWine = location.state?.wine
  const initialCode = location.state?.code
  const [wine, setWine] = useState(initialWine || null)
  const [loading, setLoading] = useState(!initialWine)
  const [error, setError] = useState(null)

  const display = useMemo(() => wine || {}, [wine])

  useEffect(() => {
    if (wine) return
    if (!initialCode && !id) return
    const abort = new AbortController()
    setLoading(true)
    setError(null)
    const codeToUse = initialCode || id
    fetchWineByCode(codeToUse, { signal: abort.signal })
      .then(setWine)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'No se pudo cargar el vino')
      })
      .finally(() => setLoading(false))
    return () => abort.abort()
  }, [id, initialCode])

  return (
    <div className="p-6">
      {loading && <div className="text-gray-600">Cargando vino...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {!loading && !error && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{display.nombre || display.name || 'Sin nombre'}</h2>
          <div className="text-gray-700">
            <div><span className="font-medium">Código:</span> {display.codigo || display.code || id}</div>
            <div><span className="font-medium">Cepa:</span> {display.cepa || display.varietal || 'Desconocida'}</div>
            <div><span className="font-medium">Región:</span> {display.region || 'Desconocida'}</div>
            <div><span className="font-medium">Costo:</span> {display.costo ?? display.cost ?? '-'}</div>
            <div><span className="font-medium">Stock:</span> {display.stockreal ?? display.stock ?? '-'}</div>
          </div>
        </div>
      )}
    </div>
  )
}


