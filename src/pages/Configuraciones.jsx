import { useState, useEffect } from "react"
import { fetchCurrentUser, getAuthToken } from "../lib/api"

export default function Configuraciones() {
  const [user, setUser] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({ contrasena: "", confirmContrasena: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Load current user data
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser()
        setUser(data)
        setFormData(data)
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }
    loadUser()
  }, [])

  const handleEditClick = (field) => {
    setEditingField(field)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSave = async (field) => {
    try {
      setLoading(true)
      setMessage("")
      const token = getAuthToken()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: formData[field] }),
        }
      )

      if (!response.ok) throw new Error("Error al actualizar el usuario")

      const updatedUser = await response.json()
      setUser(updatedUser)
      setEditingField(null)
      setMessage("Datos actualizados correctamente.")
    } catch (err) {
      console.error(err)
      setMessage("Error al guardar los cambios.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.contrasena !== passwordData.confirmContrasena) {
      setMessage("Las contraseñas no coinciden.")
      return
    }

    try {
      setLoading(true)
      setMessage("")
      const token = getAuthToken()

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ contrasena: passwordData.contrasena }),
        }
      )

      if (!response.ok) throw new Error("Error al cambiar la contraseña")

      setPasswordData({ contrasena: "", confirmContrasena: "" })
      setMessage("Contraseña actualizada correctamente.")
    } catch (err) {
      console.error(err)
      setMessage("Error al cambiar la contraseña.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-6">Cargando datos del usuario...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {["nombre", "email", "nombredeusuario", "telefono"].map((field) => (
          <div
            key={field}
            className="flex items-center justify-between border-b border-gray-200 pb-2"
          >
            <div>
              <p className="capitalize text-gray-600">{field}</p>
              {editingField === field ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="mt-1 border rounded px-2 py-1 w-64"
                />
              ) : (
                <p className="font-medium">{user[field]}</p>
              )}
            </div>

            {editingField === field ? (
              <button
                onClick={() => handleSave(field)}
                disabled={loading}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            ) : (
              <button
                onClick={() => handleEditClick(field)}
                className="text-sm bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer text-white px-3 py-1 rounded"
              >
                Editar
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Cambiar contraseña</h3>
        <div className="flex flex-col gap-3 w-72">
          <input
            type="password"
            name="contrasena"
            placeholder="Nueva contraseña"
            value={passwordData.contrasena}
            onChange={handlePasswordChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="password"
            name="confirmContrasena"
            placeholder="Confirmar contraseña"
            value={passwordData.confirmContrasena}
            onChange={handlePasswordChange}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="bg-blend-purple hover:bg-blend-purple-dark hover:cursor-pointer text-white px-4 py-2 rounded"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
    </div>
  )
}
