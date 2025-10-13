import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = searchTerm.trim()
    if (query.length === 0) {
      navigate('/inventario')
    } else {
      navigate(`/inventario?q=${encodeURIComponent(query)}`)
    }
    setMenuOpen(false)
  }

  return (
    <nav className="mb-6 border-b border-gray-200 pb-3">
      <div className="flex items-center justify-between">
        <button
          className="md:hidden inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link to="/" className="text-blue-600 font-semibold">Blend Vinos</Link>
      </div>
      <div className={`mt-3 flex-col gap-3 md:mt-3 md:flex md:flex-row md:items-center md:gap-4 ${menuOpen ? 'flex' : 'hidden'}`}>
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en inventario..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none md:w-64"
            aria-label="Search"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="Search"
          >
            Buscar
          </button>
        </form>
        <Link to="/" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/inventario" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Inventario</Link>
        <Link to="/historial" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Historial</Link>
        <Link to="/usuarios" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Usuarios</Link>
        <Link to="/configuraciones" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Configuraciones</Link>
        <Link to="/checkout" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Cerrar sesión</Link>
      </div>
    </nav>
  )
}
