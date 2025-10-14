import { Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Inventario from './pages/Inventario.jsx'
import Historial from './pages/Historial.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Configuraciones from './pages/Configuraciones.jsx'
import NotFound from './pages/NotFound.jsx'
import Movimientos from './pages/Movimientos.jsx'
import WineForm from './pages/WineForm.jsx'
import UserForm from './pages/UserForm.jsx'
import Login from './pages/Login.jsx'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="p-6">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/inventario/:id" element={<ProductDetail />} />
        <Route path="/inventario/nuevo" element={<WineForm mode="create" />} />
        <Route path="/inventario/editar/:id" element={<WineForm mode="edit" />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/nuevo" element={<UserForm />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
