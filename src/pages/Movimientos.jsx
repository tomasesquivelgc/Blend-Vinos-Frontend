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
        setError(e?.message || 'Error al cargar usuarios')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => abortController.abort()
  }, [])

  // --- agregar item (con control de duplicados) ---
  function addItem() {
    if (!wineCode.trim()) return

    // limpiar mensajes previos
    setError('')
    setSuccess('')

    setItems(prev => {
      const existing = prev.find(
        i => i.wineCode.toLowerCase() === wineCode.trim().toLowerCase()
      )

      if (existing) {
        // Si ya existe, no incrementar; mostrar mensaje de error
        setError('Ese vino ya fue agregado a la lista')
        return prev
      }

      return [
        ...prev,
        { wineCode: wineCode.trim(), quantity: 1 }
      ]
    })

    setWineCode('')
  }

  // --- actualizar cantidad de un item (permitir campo vacío '') ---
  function updateItemQuantity(index, newQuantity) {
    // permitir que el usuario borre el valor por completo (newQuantity === '')
    if (newQuantity === '') {
      setItems(prev => prev.map((item, i) => (i === index ? { ...item, quantity: '' } : item)))
      return
    }

    const qty = Number(newQuantity)
    if (isNaN(qty) || qty <= 0) return

    setItems(prev => prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item)))
  }

  const canSubmit = useMemo(() => {
    const allQuantitiesValid = items.length > 0 && items.every(i => i.quantity !== '' && Number(i.quantity) > 0)
    return !submitting && allQuantitiesValid && type
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
        quantity: items.map(i => Number(i.quantity)),
        type,
        comment: normalizedComment,
        client_id: clientId ? Number(clientId) : null,
        nombre_de_cliente: clientName,
      }
      await createMovement(payload)

      setSuccess('Movimiento creado correctamente')

      // reset
      setItems([])
      setWineCode('')
      setClientId('')
      setComment('')
    } catch (e) {
      setError(e?.message || 'Error al crear movimiento')
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
                : 'bg-gray-200 hover:bg-gray-300 hover:cursor-pointer'
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
                : 'bg-gray-200 hover:bg-gray-300 hover:cursor-pointer'
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
            placeholder="Ingrese el código y presione Enter"
          />

          <div className="mt-2">
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer text-white rounded"
            >
              Ingresar
            </button>
          </div>
        </div>

        {/* LISTA */}
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold mb-2">Vinos agregados</p>
            {items.length === 0 && (
              <p className="text-sm text-gray-600 mb-2">
                No hay vinos en la lista.
              </p>
            )}
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={item.wineCode}
                  className="flex justify-between items-center bg-white p-2 rounded border gap-2"
                >
                  <span className="font-medium">{item.wineCode}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-20 border rounded px-2 py-1 text-center"
                      value={item.quantity}
                      onChange={e => updateItemQuantity(index, e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-red-600 text-sm px-2"
                      onClick={() =>
                        setItems(prev =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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
            className="px-4 py-2 bg-blend-purple text-white rounded hover:cursor-pointer disabled:cursor-default disabled:opacity-50 hover:bg-blend-purple-dark disabled:hover:bg-blend-purple"
          >
            Guardar Movimiento
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded hover:cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
