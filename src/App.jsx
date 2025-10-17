import { useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Inventario from "./pages/Inventario.jsx";
import Historial from "./pages/Historial.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import Configuraciones from "./pages/Configuraciones.jsx";
import NotFound from "./pages/NotFound.jsx";
import Movimientos from "./pages/Movimientos.jsx";
import WineForm from "./pages/WineForm.jsx";
import UserForm from "./pages/UserForm.jsx";
import Login from "./pages/Login.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // If user is NOT admin (rol_id !== 1), redirect to /inventario
      if (user.rol_id !== 1 && window.location.pathname === '/') {
        navigate('/inventario', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  } 

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="p-2 bg-blend-yellow-gradient min-h-screen">
      <Navbar />

      <Routes>
        {/* ✅ Automatically redirect non-admins away from "/" */}
        <Route
          path="/"
          element={
            user?.rol_id === 1 ? <Home /> : <Navigate to="/inventario" replace />
          }
        />
        {/* Admin-only routes */}
        <Route
          path="/"
          element={
            <AdminRoute>
              <Home />
            </AdminRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <AdminRoute>
              <Historial />
            </AdminRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <AdminRoute>
              <Usuarios />
            </AdminRoute>
          }
        />

        {/* Authenticated routes */}
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/inventario/:id" element={<ProductDetail />} />
        <Route path="/inventario/nuevo" element={<WineForm mode="create" />} />
        <Route path="/inventario/editar/:id" element={<WineForm mode="edit" />} />
        <Route path="/usuarios/nuevo" element={<UserForm />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
