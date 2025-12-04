import { useState } from "react";
import { initialProducts } from "./data/products";

// Páginas
import LoginPage from "./page/LoginPage";
import CatalogoPage from "./page/CatalogoPage";
import PaginaAdministrativo from "./page/PaginaAdministrativo";

function App() {
  const [screen, setScreen] = useState("login");
  const [userRole, setUserRole] = useState(null);

  // Productos globales compartidos entre catálogo y admin
  const [products, setProducts] = useState(initialProducts);

  const agregarProducto = (nuevo) => {
    setProducts([...products, { ...nuevo, id: Date.now() }]);
  };

  const editarProducto = (editado) => {
    setProducts(products.map(p => p.id === editado.id ? editado : p));
  };

  const eliminarProducto = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setScreen("catalogo");
  };

  const handleGoToAdmin = () => {
    if (userRole === "admin") setScreen("admin");
    else alert("No tienes permisos.");
  };

  const handleBackToCatalog = () => setScreen("catalogo");
  const handleLogout = () => {
    setUserRole(null);
    setScreen("login");
  };

  return (
    <>
      {screen === "login" && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === "catalogo" && (
        <CatalogoPage
          userRole={userRole}
          onGoToAdmin={handleGoToAdmin}
          onLogout={handleLogout}
          products={products}     // Catálogo recibe productos reales
        />
      )}

      {screen === "admin" && (
        <PaginaAdministrativo
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
          products={products}     // Admin usa productos reales
          onAgregar={agregarProducto}
          onEditar={editarProducto}
          onEliminar={eliminarProducto}
        />
      )}
    </>
  );
}

export default App;
