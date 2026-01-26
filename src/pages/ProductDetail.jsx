import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { fetchWineByCode, deleteWine } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const initialWine = location.state?.wine
  const initialCode = location.state?.code
  const [wine, setWine] = useState(initialWine || null)
  const [loading, setLoading] = useState(!initialWine)
  const [error, setError] = useState(null)

  const display = useMemo(() => wine || {}, [wine])

  useEffect(() => {
    if (location.state?.wine) {
      // If wine is passed via state, update the wine and skip fetching
      setWine(location.state.wine)
      setLoading(false)
      setError(null)
      return
    }

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
  }, [id, initialCode, location.state])

  const { user } = useAuth()

  const handleEdit = (id) => navigate(`/inventario/editar/${id}`)

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar este vino? Esta acción no se puede deshacer.')
    if (!confirmed) return
    try {
      await deleteWine(id)
      navigate('/inventario')
    } catch (e) {
      alert(e.message || 'Error eliminando el vino')
    }
  }

  const handleCreate = () => navigate('/inventario/nuevo')

  return (
    <div className="p-6">
      {loading && <div className="text-gray-600">Cargando vino...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {user?.rol_id === 1 && (
          <div className='flex justify-end mb-4'>
            <button className="rounded bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer px-3 py-2 text-white" onClick={handleCreate}>Crear nuevo vino</button>
          </div>
        )}
      {!loading && !error && (
        <div key={wine.id || wine._id} className="rounded border border-gray-200 p-4 shadow-sm bg-white">
                <div className="mb-1 flex items-start justify-between flex-col gap-2 md:flex-row">
                  <div className='md:w-3/4'>
                    <div className="text-lg font-medium">{wine.nombre || 'Sin nombre'}</div>
                    <div className="text-sm text-gray-700">{wine.codigo || 'Codigo desconocido'}</div>
                    <div className="text-sm text-gray-700">{wine.cepa || 'Cepa desconocida'}</div>
                    <div className="text-sm text-gray-700">Costo: <span className="font-semibold">${wine.costo}</span></div>
                    <div className="text-sm text-gray-700">Stock: <span className="font-semibold">{wine.total ?? wine.total}</span></div>
                    {user?.rol_id === 1 &&
                    <>
                    <div className='text-sm text-gray-700'>Precio Socios: <span className='font-semibold'>${wine.precioSocio}</span></div>
                    <div className='text-sm text-gray-700'>Precio Distribuidor: <span className='font-semibold'>${wine.precioDistribuidor}</span></div>
                    <div className='text-sm text-gray-700'>Precio Revendedor: <span className='font-semibold'>${wine.precioRevendedor}</span></div>
                    <div className='text-sm text-gray-700'>Precio Revendedor Socio: <span className='font-semibold'>${wine.precioRevendedorSocio}</span></div>
                    </>
                    }
                    <div className="text-sm text-gray-700">Precio Recomendado de venta: <span className="font-semibold">${wine.precioRecomendado ?? '-'}</span></div>
                    <div className="text-sm text-gray-700">Precio de Oferta: <span className="font-semibold">${wine.precioOferta ?? '-'}</span></div>
                  </div>
                  {user?.rol_id === 1 && (
                    <div className="flex gap-2 w-full md:flex-col md:w-1/4">
                      <button className="rounded border px-2 py-1 text-sm text-blend-purple hover:cursor-pointer w-1/2 md:w-full" onClick={() => handleEdit(wine.id || wine._id)}>Editar</button>
                      <button className="rounded border px-2 py-1 text-sm text-red-700 hover:cursor-pointer w-1/2 md:w-full" onClick={() => handleDelete(wine.id || wine._id)}>Eliminar</button>
                    </div>
                  )}
                </div>
              </div>
      )}
    </div>
  )
}


