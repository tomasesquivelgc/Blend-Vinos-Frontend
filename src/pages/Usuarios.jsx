import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers } from '../lib/api.js'

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchUsers({ signal: abortController.signal })
        setUsers(Array.isArray(data) ? data : data?.items ?? [])
      } catch (e) {
        if (e && (e.name === 'AbortError' || e.code === 20)) return
        setError(e?.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => abortController.abort()
  }, [])

  const handleCreate = () => {
    navigate('/usuarios/nuevo')
  }

  const getRoleName = (roleId) => {
    const roles = { 1: 'Admin', 2: 'Socio', 3: 'Revendedor' }
    return roles[roleId] || 'Desconocido'
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        <button 
          className="rounded bg-blue-600 px-3 py-2 text-white" 
          onClick={handleCreate}
        >
          Crear nuevo usuario
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2">
          {users.length === 0 && <p>No hay usuarios.</p>}
          {users.map(user => (
            <div key={user.id} className="border rounded p-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">{user.name || user.username || 'Sin nombre'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-600">Rol: {getRoleName(user.roleid || user.role_id)}</div>
                {user.phone && <div className="text-sm text-gray-600">Tel: {user.phone}</div>}
              </div>
              <div className="text-sm text-gray-500">
                ID: {user.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


