import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createMovement, fetchUsers, fetchWines } from '../lib/api.js'

export default function Movimientos() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialType = (location.state && location.state.type) || 'COMPRA'

  const [type, setType] = useState(initialType)
  const [wines, setWines] = useState([])
  const [users, setUsers] = useState([])
  const [wineId, setWineId] = useState('')
  const [clientId, setClientId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [winesData, usersData] = await Promise.all([
          fetchWines({ signal: abortController.signal }),
          fetchUsers({ signal: abortController.signal }),
        ])
        setWines(Array.isArray(winesData) ? winesData : winesData?.items ?? [])
        setUsers(Array.isArray(usersData) ? usersData : usersData?.items ?? [])
      } catch (e) {
        // Ignore abort errors (e.g., React StrictMode triggers effect cleanup)
        if (e && (e.name === 'AbortError' || e.code === 20)) return
        setError(e?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => abortController.abort()
  }, [])

  const canSubmit = useMemo(() => {
    return !submitting && wineId && Number(quantity) > 0 && type
  }, [submitting, wineId, quantity, type])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const normalizedComment = (comment || '').trim() === '' ? null : comment
      const payload = {
        wine_id: Number(wineId),
        type,
        quantity: Number(quantity),
        comment: normalizedComment,
        client_id: clientId ? Number(clientId) : null,
      }
      await createMovement(payload)
      setSuccess('Movimiento creado correctamente')
      // Optional: navigate back home or clear form
      setWineId('')
      setClientId('')
      setQuantity(1)
      setComment('')
    } catch (e) {
      setError(e.message || 'Error creating movement')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Nuevo Movimiento</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded ${type === 'COMPRA' ? 'bg-blend-pink text-white' : 'bg-gray-200'}`}
            onClick={() => setType('COMPRA')}
          >
            COMPRA
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${type === 'VENTA' ? 'bg-blend-pink text-white' : 'bg-gray-200'}`}
            onClick={() => setType('VENTA')}
          >
            VENTA
          </button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-700 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1">Vino</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={wineId}
            onChange={(e) => setWineId(e.target.value)}
            required
          >
            <option value="">Selecciona un vino</option>
            {wines.map(w => (
              <option key={w.id} value={w.id}>{w.name || w.nombre || `#${w.id}`}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Cantidad</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Comentario</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentario opcional"
          />
        </div>

        <div>
          <label className="block mb-1">Cliente (opcional)</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Sin cliente</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name || u.username || u.email || `#${u.id}`}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Guardar Movimiento
          </button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}


