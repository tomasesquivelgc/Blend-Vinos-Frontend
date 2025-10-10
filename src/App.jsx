import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Inventario from './pages/Inventario.jsx'
import Historial from './pages/Historial.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Configuraciones from './pages/Configuraciones.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="p-6">
      <nav className="flex gap-4 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
        <Link to="/inventario" className="text-blue-600 hover:underline">Inventario</Link>
        <Link to="/historial" className="text-blue-600 hover:underline">Historial</Link>
        <Link to="/usuarios" className="text-blue-600 hover:underline">Usuarios</Link>
        <Link to="/configuraciones" className="text-blue-600 hover:underline">Configuraciones</Link>
        <Link to="/checkout" className="text-blue-600 hover:underline">Cerrar sesión</Link>
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
