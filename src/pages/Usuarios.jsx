import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers, deleteUser, resetUserPassword } from '../lib/api.js'

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.')
    if (!confirmed) return
    try {
      await deleteUser(id)
      // Refresh list
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e) {
      alert(e.message || 'Error eliminando el usuario')
    }
  }

  const handleResetPassword = async (id) => {
    const confirmed = window.confirm('¿Seguro que deseas restablecer la contraseña de este usuario a "Contraseña123"?')
    if (!confirmed) return
    try {
      await resetUserPassword(id)
      alert('Contraseña restablecida exitosamente.')
    } catch (e) {
      alert(e.message || 'Error al restablecer la contraseña')
    }
  }  

  const getRoleName = (roleId) => {
    const roles = { 1: 'Admin', 2: 'Socio', 3: 'Revendedor' }
    return roles[roleId] || 'Desconocido'
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <button 
          className="rounded bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer px-3 py-2 text-white" 
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
            <div key={user.id} className="border rounded p-4 flex items-center justify-between bg-white">
              <div className="space-y-1">
                <div className="font-semibold text-lg">{user.name || user.username || 'Sin nombre'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-600">Rol: {getRoleName(user.roleid || user.role_id)}</div>
                <div className="text-sm text-gray-600">Username: {user.username}</div>
                {user.phone && <div className="text-sm text-gray-600">Tel: {user.phone}</div>}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">
                  ID: {user.id}
                </div>
                <button 
                  className="rounded border px-2 py-1 text-sm text-blend-purple" 
                  onClick={() => handleResetPassword(user.id)}
                >
                  Resetear contraseña
                </button>
                <button 
                  className="rounded border px-2 py-1 text-sm text-red-700" 
                  onClick={() => handleDelete(user.id)}
                >
                  Borrar usuario
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


