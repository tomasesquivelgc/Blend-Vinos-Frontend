import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createMovement, fetchUsers } from '../lib/api.js'

export default function Movimientos() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialType = (location.state && location.state.type) || 'COMPRA'

  const [type, setType] = useState(initialType)
  const [users, setUsers] = useState([])

  // inputs temporales
  const [wineCode, setWineCode] = useState('')
  const [quantity, setQuantity] = useState(1)

  // lista real
  const [items, setItems] = useState([]) 
  // [{ wineCode: string, quantity: number }]

  const [clientId, setClientId] = useState('')
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
        const usersData = await fetchUsers({ signal: abortController.signal })
        setUsers(Array.isArray(usersData) ? usersData : usersData?.items ?? [])
      } catch (e) {
        if (e?.name === 'AbortError' || e?.code === 20) return
        setError(e?.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => abortController.abort()
  }, [])

  // --- agregar item (con control de duplicados) ---
  function addItem() {
    if (!wineCode.trim() || Number(quantity) <= 0) return

    setItems(prev => {
      const existing = prev.find(
        i => i.wineCode.toLowerCase() === wineCode.trim().toLowerCase()
      )

      if (existing) {
        return prev.map(i =>
          i.wineCode.toLowerCase() === wineCode.trim().toLowerCase()
            ? { ...i, quantity: i.quantity + Number(quantity) }
            : i
        )
      }

      return [
        ...prev,
        { wineCode: wineCode.trim(), quantity: Number(quantity) }
      ]
    })

    setWineCode('')
    setQuantity(1)
  }

  const canSubmit = useMemo(() => {
    return !submitting && items.length > 0 && type
  }, [submitting, items, type])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const normalizedComment =
        comment.trim() === '' ? null : comment.trim()

      const selectedClient = users.find(
        u => String(u.id) === String(clientId)
      )

      const clientName = selectedClient
        ? selectedClient.name || selectedClient.username || selectedClient.email
        : null

      const payload = {
        wine_id: items.map(i => i.wineCode),
        quantity: items.map(i => i.quantity),
        type,
        comment: normalizedComment,
        client_id: clientId ? Number(clientId) : null,
        nombre_de_cliente: clientName,
      }
      console.log('Payload movimiento:', payload)
      await createMovement(payload)

      setSuccess('Movimiento creado correctamente')

      // reset
      setItems([])
      setWineCode('')
      setQuantity(1)
      setClientId('')
      setComment('')
    } catch (e) {
      setError(e?.message || 'Error creating movement')
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
            className={`px-4 py-2 rounded ${
              type === 'COMPRA'
                ? 'bg-blend-pink text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setType('COMPRA')}
          >
            COMPRA
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded ${
              type === 'VENTA'
                ? 'bg-blend-pink text-white'
                : 'bg-gray-200'
            }`}
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
        {/* INPUTS */}
        <div>
          <label className="block mb-1">Código de vino</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-white"
            value={wineCode}
            onChange={e => setWineCode(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem()
              }
            }}
          />
        </div>

        <div>
          <label className="block mb-1">Cantidad</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2 bg-white"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem()
              }
            }}
          />
        </div>

        {/* LISTA */}
        {items.length > 0 && (
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold mb-2">Vinos agregados</p>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white p-2 rounded border"
                >
                  <span>
                    <strong>{item.wineCode}</strong> × {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="text-red-600 text-sm"
                    onClick={() =>
                      setItems(prev =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="block mb-1">Comentario</label>
          <textarea
            className="w-full border rounded px-3 py-2 bg-white"
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Cliente (opcional)</label>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
          >
            <option value="">Sin cliente</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.username || u.email || `#${u.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-blend-purple text-white rounded disabled:opacity-50"
          >
            Guardar Movimiento
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
