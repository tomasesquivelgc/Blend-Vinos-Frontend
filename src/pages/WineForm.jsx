import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createWine, updateWine, fetchWineById } from '../lib/api.js'

export default function WineForm({ mode = 'create' }) {
  const navigate = useNavigate()
  const params = useParams()
  const wineId = params.id

  const [form, setForm] = useState({
    codigoDeBarras: '',
    codigo: '',
    nombre: '',
    cepa: '',
    anejamiento: '',
    bodega: '',
    distribuidor: '',
    estilo: '',
    total: '',
    stockReal: '',
    costo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const title = useMemo(() => mode === 'edit' ? 'Editar Vino' : 'Crear Nuevo Vino', [mode])

  const [original, setOriginal] = useState(null)

  // Load existing wine in edit mode
  useEffect(() => {
    if (mode !== 'edit' || !wineId) return
    const abortController = new AbortController()
    async function load() {
      try {
        const data = await fetchWineById(wineId, { signal: abortController.signal })
        // Normalize into our form shape (handle backend naming variations if any)
        const normalized = {
          codigoDeBarras: data.codigoDeBarras ?? data.codigodebarras ?? data.codigo_barras ?? '',
          codigo: data.codigo ?? '',
          nombre: data.nombre ?? '',
          cepa: data.cepa ?? '',
          anejamiento: data.anejamiento ?? '',
          bodega: data.bodega ?? '',
          distribuidor: data.distribuidor ?? '',
          estilo: data.estilo ?? '',
          total: data.total ?? '',
          stockReal: data.total ?? '',
          costo: data.costo ?? '',
        }
        setOriginal(normalized)
        setForm(Object.fromEntries(Object.entries(normalized).map(([k, v]) => [k, v === null ? '' : String(v)])))
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'No se pudo cargar el vino')
      }
    }
    load()
    return () => abortController.abort()
  }, [wineId, mode])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'create') {
        const payload = {}
        Object.entries(form).forEach(([k, v]) => {
          if (v === '' || v === null || v === undefined) return
          if (['codigoDeBarras', 'total', 'stockReal', 'costo'].includes(k)) payload[k] = Number(v)
          else payload[k] = v
        })
        await createWine(payload)
        setSuccess('Vino creado correctamente')
        navigate('/inventario')
      } else {
        if (!original) throw new Error('Datos originales no disponibles para editar')
        // Start from original values to ensure required fields (e.g., codigo) are present
        const payload = { ...original }
        Object.entries(form).forEach(([k, v]) => {
          const originalValue = original ? String(original[k] ?? '') : ''
          if (String(v) !== originalValue) {
            if (v === '' || v === null || v === undefined) return
            if (['codigoDeBarras', 'total', 'stockReal', 'costo'].includes(k)) payload[k] = Number(v)
            else payload[k] = v
          }
        })
        await updateWine(wineId, payload)
        setSuccess('Vino actualizado correctamente')
        navigate('/inventario')
      }
    } catch (e) {
      setError(e.message || 'Error al guardar el vino')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2 max-w-4xl">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Código de Barras</span>
          <input className="border rounded px-3 py-2 bg-white" name="codigoDeBarras" value={form.codigoDeBarras} onChange={handleChange} type="number" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Código</span>
          <input className="border rounded px-3 py-2 bg-white" name="codigo" value={form.codigo} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Nombre</span>
          <input className="border rounded px-3 py-2 bg-white" name="nombre" value={form.nombre} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Cepa</span>
          <input className="border rounded px-3 py-2 bg-white" name="cepa" value={form.cepa} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Añejamiento</span>
          <input className="border rounded px-3 py-2 bg-white" name="anejamiento" value={form.anejamiento} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Bodega</span>
          <input className="border rounded px-3 py-2 bg-white" name="bodega" value={form.bodega} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Distribuidor</span>
          <input className="border rounded px-3 py-2 bg-white" name="distribuidor" value={form.distribuidor} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Estilo</span>
          <input className="border rounded px-3 py-2 bg-white" name="estilo" value={form.estilo} onChange={handleChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Total</span>
          <input className="border rounded px-3 py-2 bg-white" name="total" value={form.total} onChange={handleChange} type="number" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Costo</span>
          <input className="border rounded px-3 py-2 bg-white" name="costo" value={form.costo} onChange={handleChange} type="number" step="0.01" />
        </label>

        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-blend-purple text-white rounded" disabled={loading}>
            {mode === 'create' ? 'Crear' : 'Guardar cambios'}
          </button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate(-1)} disabled={loading}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}


