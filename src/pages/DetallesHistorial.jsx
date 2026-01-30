import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchMovementDetails } from '../lib/api.js'

export default function DetallesHistorial() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [historial, setHistorial] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const ac = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetchMovementDetails(id, { signal: ac.signal })
        // Backend now returns an object with keys: { detalles, historial }
        if (res && typeof res === 'object') {
          const detallesRaw = res.detalles
          // normalize detalles to array
          let detalles = []
          if (Array.isArray(detallesRaw)) detalles = detallesRaw
          else if (detallesRaw == null) detalles = []
          else detalles = [detallesRaw]
          setData(detalles)
          setHistorial(res.historial ?? null)
        } else {
          // fallback: previous behavior - single object or null
          if (Array.isArray(res)) setData(res)
          else if (res == null) setData([])
          else setData([res])
          setHistorial(null)
        }
      console.log(res)
      } catch (e) {
        if (e && (e.name === 'AbortError' || e.code === 20)) return
        setError(e?.message || 'Error cargando detalles')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => ac.abort()
  }, [id])

  return (
    <div className="p-6">
      <button className="mb-4 text-blend-purple" onClick={() => navigate(-1)}>← Volver</button>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {historial && (
        <div className="border p-4 bg-white mb-4">
          <div className="space-y-1">
            <div><strong>Acción:</strong> {historial.accion ?? '—'}</div>
            <div><strong>Comentario:</strong> {historial.comentario ?? '—'}</div>
            <div><strong>Costo:</strong> {historial.costo != null ? `$${historial.costo}` : '—'}</div>
            <div><strong>Fecha:</strong> {historial.fecha ? new Date(historial.fecha).toLocaleString() : '—'}</div>
            <div><strong>Cliente:</strong> {historial.nombre_de_cliente ?? '—'}</div>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.length === 0 && <p>No hay detalles para este movimiento.</p>}
          {data.map((entry) => (
            <div key={entry.id} className="border p-4 bg-white space-y-2">
              <div><strong>ID:</strong> {entry.id}</div>
              <div><strong>Movimiento ID:</strong> {entry.movimiento_id ?? entry.movement_id ?? '—'}</div>
              <div><strong>Vino ID:</strong> {entry.vino_id ?? entry.wine_id ?? '—'}</div>
              <div><strong>Nombre del vino:</strong> {entry.vino_nombre ?? entry.wine_name ?? '—'}</div>
              <div><strong>Cantidad:</strong> {entry.cantidad ?? '—'}</div>
              <div><strong>Precio unitario:</strong> {entry.precio_unitario != null ? `$${entry.precio_unitario}` : '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
