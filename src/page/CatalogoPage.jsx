import { useState } from "react";
import ProductCard from "../components/ProductCard";

function CatalogoPage({ userRole, onGoToPanel, onLogout, products }) {

  // Filtros
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tallaFiltro, setTallaFiltro] = useState("");

  // FILTRADO usando productos recibidos desde App.jsx
  const productosFiltrados = products.filter(p => {
    const categoriaMatch = categoriaFiltro === ""
      || p.categoria.toLowerCase() === categoriaFiltro.toLowerCase();

    const tallaMatch = tallaFiltro === ""
      || p.size.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
      tallaFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    return categoriaMatch && tallaMatch;
  });


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Encabezado */}
      <header
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ marginRight: "20px" }}>Rol: {userRole}</span>

          <button
            onClick={onGoToPanel}
            style={{
              padding: "8px 15px",
              marginRight: "10px",
              backgroundColor: "#ff6b6b",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {userRole === "admin" ? "Panel Admin" : 
             userRole === "cajero" ? "Panel Cajero" : 
             userRole === "almacenero" ? "Panel Almacenero" : 
             userRole === "supervisor" ? "Panel Supervisor" : "Mi Panel"}
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: "8px 15px",
              backgroundColor: "#666",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div style={{ padding: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="">Todas las categorías</option>
          <option value="Ropa">Ropa</option>
          <option value="Calzados">Calzados</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <select
          value={tallaFiltro}
          onChange={(e) => setTallaFiltro(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="">Todas las tallas</option>
          <option value="Única">Única</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="32">32</option>
          <option value="42">42</option>
        </select>
      </div>

      {/* CATÁLOGO */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Nuestros Productos</h2>

        {productosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No hay productos que coincidan con el filtro.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {productosFiltrados.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogoPage;
