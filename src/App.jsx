import { useState } from "react";
import { initialProducts } from "./data/products";

// Páginas
import LoginPage from "./page/LoginPage";
import CatalogoPage from "./page/CatalogoPage";
import PaginaAdministrativo from "./page/PaginaAdministrativo";
import PanelCajero from "./page/PanelCajero";
import PanelAlmacenero from "./page/PanelAlmacenero";
import PanelSupervisor from "./page/PanelSupervisor";

function App() {
  const [screen, setScreen] = useState("login");
  const [userRole, setUserRole] = useState(null);

  // Productos globales compartidos entre TODOS los paneles (catálogo, admin, cajero, almacenero, supervisor)
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

  const handleGoToPanel = () => {
    setScreen("panel");
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
          onGoToPanel={handleGoToPanel}
          onLogout={handleLogout}
          products={products}     // Catálogo recibe productos reales
        />
      )}

      {screen === "panel" && userRole === "admin" && (
        <PaginaAdministrativo
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
          products={products}     // Admin usa productos reales
          onAgregar={agregarProducto}
          onEditar={editarProducto}
          onEliminar={eliminarProducto}
        />
      )}

      {screen === "panel" && userRole === "cajero" && (
        <PanelCajero
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
          products={products}
          setProducts={setProducts}
        />
      )}

      {screen === "panel" && userRole === "almacenero" && (
        <PanelAlmacenero
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
          products={products}
          setProducts={setProducts}
        />
      )}

      {screen === "panel" && userRole === "supervisor" && (
        <PanelSupervisor
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
          products={products}
        />
      )}
    </>
  );
}

export default App;
