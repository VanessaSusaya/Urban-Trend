import { useState } from "react";

// Páginas
import LoginPage from "./page/LoginPage";
import CatalogoPage from "./page/CatalogoPage";
import PaginaAdministrativo from "./page/PaginaAdministrativo";

function App() {
  // Estado global de navegación
  const [screen, setScreen] = useState("login"); // login → catalogo → admin
  const [userRole, setUserRole] = useState(null); // admin / user

  // Cuando el usuario se logea correctamente
  const handleLoginSuccess = (role) => {
    setUserRole(role);

    // Después de login → ir al catálogo
    setScreen("catalogo");
  };

  //Cuando en el catálogo se presiona "ir al panel admin"
  const handleGoToAdmin = () => {
    if (userRole === "admin") {
      setScreen("admin");
    } else {
      alert("No tienes permisos para acceder al panel administrativo.");
    }
  };

  // Volver al catálogo desde admin
  const handleBackToCatalog = () => {
    setScreen("catalogo");
  };

  // Permite salir en cualquier página
  const handleLogout = () => {
    setUserRole(null);
    setScreen("login");
  };

  // Control de pantallas
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
        />
      )}

      {screen === "admin" && (
        <PaginaAdministrativo 
          onBackToCatalog={handleBackToCatalog}
          userRole={userRole}
        />
      )}
    </>
  );
}

export default App;

