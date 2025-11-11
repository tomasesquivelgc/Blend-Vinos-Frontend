import { useState, useRef } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { fetchWineByCode } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searching, setSearching] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()  // ✅ get user here

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    const query = searchTerm.trim()
    if (query.length === 0) {
      navigate('/inventario')
      setMenuOpen(false)
      return
    }

    try {
      setSearching(true)
      const results = await fetchWineByCode(query) // always an array

      if (Array.isArray(results) && results.length === 1) {
        const wine = results[0]
        navigate(`/inventario/${wine.id || wine._id}`, { state: { wine, code: query } })
      } else if (Array.isArray(results) && results.length > 1) {
        navigate('/inventario', { state: { searchResults: results, query } })
      } else {
        alert('No se encontraron resultados para la búsqueda.')
      }
    } catch (error) {
      alert('No se encontraron resultados para la búsqueda.')
    } finally {
      setSearching(false)
      setMenuOpen(false)
    }
  }

  return (
    <nav className="mb-2 border-b border-gray-200 p-6">
      <div className="flex items-center justify-center relative">
        <button
          className="absolute left-0 md:hidden inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Link to="/" className="block">
          <img
            src="/blend-logo.png"
            alt="blend logo"
            className="h-32 w-auto max-w-[240px] object-contain mx-auto"
          />
        </Link>
      </div>

      <div
        className={`
          ${menuOpen ? 'mt-3' : 'mt-0'}
          flex flex-col gap-3
          overflow-hidden transition-all duration-300 ease-out
          ${menuOpen ? 'max-h-[600px] opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}
          md:mt-3 md:flex md:flex-row md:items-center md:gap-3 items-start md:max-h-none md:opacity-100 md:translate-y-0 md:overflow-visible md:pointer-events-auto
        `}
      >
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-48 lg:w-64">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en inventario..."
              className="w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-blend-purple focus:outline-none bg-white"
              aria-label="Search"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full w-8 h-8 text-lg text-gray-600 hover:bg-gray-100"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-blend-purple px-3 py-2 text-sm font-medium text-white hover:bg-blend-purple-dark disabled:opacity-60 hover:cursor-pointer"
            disabled={searching}
            aria-label="Search"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        {/* Only show admin routes if user is admin */}
        {user?.rol_id === 1 && (
          <>
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${isActive ? 'text-blend-pink' : 'text-blend-text-purple'} hover:underline font-medium`} end>Inicio</NavLink>
            <NavLink to="/historial" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${isActive ? 'text-blend-pink' : 'text-blend-text-purple'} hover:underline font-medium`}>Historial</NavLink>
            <NavLink to="/usuarios" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${isActive ? 'text-blend-pink' : 'text-blend-text-purple'} hover:underline font-medium`}>Usuarios</NavLink>
          </>
        )}
        <NavLink to="/inventario" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${isActive ? 'text-blend-pink' : 'text-blend-text-purple'} hover:underline font-medium`}>Inventario</NavLink>
        <NavLink to="/configuraciones" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${isActive ? 'text-blend-pink' : 'text-blend-text-purple'} hover:underline font-medium`}>Configuraciones</NavLink>
        <button
          className="text-blend-text-purple hover:underline font-medium hover:cursor-pointer"
          onClick={() => {
            logout()
            setMenuOpen(false)
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
