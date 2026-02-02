import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchMovementDetails } from '../lib/api.js'

export default function DetallesHistorial() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [detalles, setDetalles] = useState([])
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

        if (res && typeof res === 'object') {
          const raw = res.detalles
          if (Array.isArray(raw)) setDetalles(raw)
          else if (raw) setDetalles([raw])
          else setDetalles([])
          setHistorial(res.historial ?? null)
        }
      } catch (e) {
        if (e?.name === 'AbortError') return
        setError(e?.message || 'Error cargando detalles')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => ac.abort()
  }, [id])

  const total = detalles.reduce(
    (acc, d) => acc + Number(d.precio_unitario ?? 0) * Number(d.cantidad ?? 0),
    0
  )

  return (
    <div className="p-6 min-h-screen">
      <button
        className="mb-4 text-purple-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {historial && (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-md border">

          {/* ENCABEZADO */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold uppercase text-center">
              {historial.accion ?? 'Movimiento'}
            </h1>

            <div className="mt-2 space-y-1 text-md">
              <div>
                <strong>Fecha:</strong>{' '}
                {historial.fecha
                  ? new Date(historial.fecha).toLocaleDateString()
                  : '—'}
              </div>
              <div>
                <strong>Cliente:</strong>{' '}
                {historial.nombre_de_cliente ?? '—'}
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* TABLA */}
          <table className="w-full border-collapse text-md">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Cantidad</th>
                <th className="text-left py-2">Código</th>
                <th className="text-left py-2">Nombre</th>
                <th className="text-right py-2">Importe</th>
              </tr>
            </thead>

            <tbody>
              {detalles.map((d) => {
                const importe =
                  Number(d.cantidad ?? 0) * Number(d.precio_unitario ?? 0)

                return (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="py-2">{d.cantidad}</td>
                    <td className="py-2">{d.vino_codigo ?? '—'}</td>
                    <td className="py-2">{d.vino_nombre ?? '—'}</td>
                    <td className="py-2 text-right">
                      ${importe.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <hr className="my-6" />

          {/* TOTAL */}
          <div className="flex justify-end text-lg font-bold">
            <span className="mr-4">TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <hr className="my-6" />

          {/* COMENTARIO */}
          <div className="text-sm">
            <strong>Comentario:</strong>{' '}
            {historial.comentario ?? '—'}
          </div>
        </div>
      )}
    </div>
  )
}
