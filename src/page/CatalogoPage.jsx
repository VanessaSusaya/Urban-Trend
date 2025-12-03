import { useState } from "react";
import ProductCard from "../components/ProductCard";

function CatalogoPage({ userRole, onGoToAdmin, onLogout }) {
  // Datos de productos con categoría, talla y stock
  const [products] = useState([
    { 
      id: 1, 
      nombre: "Zapatillas Urban Street", 
      precio: 89.99,
      categoria: "Calzado",
      talla: "42",
      stock: 3,
      imagen: "https://cdn.dummyjson.com/products/images/sports/Running%20Shoes/1.jpg" 
    },
    { 
      id: 2, 
      nombre: "Mochila Urban Black", 
      precio: 59.99,
      categoria: "Accesorios",
      talla: "Única",
      stock: 12,
      imagen: "https://cdn.dummyjson.com/products/images/bags/Backpack/1.jpg" 
    },
    { 
      id: 3, 
      nombre: "Gafas de Sol Trendy", 
      precio: 129.99,
      categoria: "Accesorios",
      talla: "Única",
      stock: 2,
      imagen: "https://cdn.dummyjson.com/products/images/beauty/Eyebrow%20Pencil/1.jpg" 
    },
    { 
      id: 4, 
      nombre: "Cinturón Premium Cuero", 
      precio: 49.99,
      categoria: "Accesorios",
      talla: "Única",
      stock: 8,
      imagen: "https://cdn.dummyjson.com/products/images/womens-shoes/Blue%20Band%20Aid%20Shoes/1.jpg" 
    },
    { 
      id: 5, 
      nombre: "Polera Urban Classic", 
      precio: 34.99,
      categoria: "Ropa",
      talla: "M",
      stock: 4,
      imagen: "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20Band%20Collar%20Shirt/1.jpg" 
    },
    { 
      id: 6, 
      nombre: "Pantalón Denim Premium", 
      precio: 79.99,
      categoria: "Ropa",
      talla: "32",
      stock: 10,
      imagen: "https://cdn.dummyjson.com/products/images/mens-shoes/Blue%20Casual%20Shoes/1.jpg" 
    },
    { 
      id: 7, 
      nombre: "Chaqueta Urban Style", 
      precio: 119.99,
      categoria: "Ropa",
      talla: "L",
      stock: 1,
      imagen: "https://cdn.dummyjson.com/products/images/mens-clothing/Black%20Leather%20Jacket/1.jpg" 
    },
    { 
      id: 8, 
      nombre: "Gorro Beanie Negro", 
      precio: 24.99,
      categoria: "Accesorios",
      talla: "Única",
      stock: 15,
      imagen: "https://cdn.dummyjson.com/products/images/womens-clothing/Black%20Beanie/1.jpg" 
    },
  ]);

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tallaFiltro, setTallaFiltro] = useState("");

  const productosFiltrados = products.filter(p => {
    return (
      (categoriaFiltro === "" || p.categoria === categoriaFiltro) &&
      (tallaFiltro === "" || p.talla === tallaFiltro)
    );
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
          {userRole === "admin" && (
            <button
              onClick={onGoToAdmin}
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
              Panel Admin
            </button>
          )}
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
          <option value="Calzado">Calzado</option>
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

      {/* Catálogo */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Nuestros Productos</h2>

        {productosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No hay productos que coincidan con el filtro.</p>
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
