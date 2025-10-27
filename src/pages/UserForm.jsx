import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../lib/api.js'

export default function UserForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    roleId: 2,
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Socio' },
    { id: 3, name: 'Revendedor' },
  ]

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validateForm() {
    if (!form.name.trim()) return 'El nombre es requerido'
    if (!form.email.trim()) return 'El email es requerido'
    if (!form.username.trim()) return 'El username es requerido'
    if (!form.password) return 'La contraseña es requerida'
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      await createUser(payload)
      setSuccess('Usuario creado correctamente')
      navigate('/usuarios')
    } catch (e) {
      setError(e.message || 'Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Crear Nuevo Usuario</h2>
      </div>

      {error && <div className="mb-2 text-red-600">{error}</div>}
      {success && <div className="mb-2 text-green-700">{success}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2 max-w-4xl">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Nombre</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="name" 
            value={form.name} 
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Email</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Username</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="username" 
            value={form.username} 
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Teléfono</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="phone" 
            value={form.phone} 
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Rol</span>
          <select 
            className="border rounded px-3 py-2 bg-white" 
            name="roleId" 
            value={form.roleId} 
            onChange={handleChange}
            required
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>

        <div></div>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Contraseña</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="password" 
            type="password"
            value={form.password} 
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Repita su contraseña</span>
          <input 
            className="border rounded px-3 py-2 bg-white" 
            name="confirmPassword" 
            type="password"
            value={form.confirmPassword} 
            onChange={handleChange}
            required
          />
        </label>

        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blend-purple text-white rounded" 
            disabled={loading}
          >
            Crear Usuario
          </button>
          <button 
            type="button" 
            className="px-4 py-2 border rounded" 
            onClick={() => navigate(-1)} 
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
