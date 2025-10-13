import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
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
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/inventario/:id" element={<ProductDetail />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
