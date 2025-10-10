import { Link, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import Inventario from './pages/Inventario.jsx'
import Historial from './pages/Historial.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Configuraciones from './pages/Configuraciones.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="p-6">
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
          <Link to="/" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/inventario" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Inventario</Link>
          <Link to="/historial" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Historial</Link>
          <Link to="/usuarios" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Usuarios</Link>
          <Link to="/configuraciones" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Configuraciones</Link>
          <Link to="/checkout" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Cerrar sesión</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
