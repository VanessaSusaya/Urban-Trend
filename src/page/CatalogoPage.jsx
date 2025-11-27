import { useState } from "react";
import ProductCard from "../components/ProductCard";

function CatalogoPage({ userRole, onGoToAdmin, onLogout }) {
  // Datos de productos
  const [products] = useState([
    { 
      id: 1, 
      nombre: "Zapatillas Urban Street", 
      precio: 89.99,
      imagen: "https://cdn.dummyjson.com/products/images/sports/Running%20Shoes/1.jpg" 
    },
    { 
      id: 2, 
      nombre: "Mochila Urban Black", 
      precio: 59.99,
      imagen: "https://cdn.dummyjson.com/products/images/bags/Backpack/1.jpg" 
    },
    { 
      id: 3, 
      nombre: "Gafas de Sol Trendy", 
      precio: 129.99,
      imagen: "https://cdn.dummyjson.com/products/images/beauty/Eyebrow%20Pencil/1.jpg" 
    },
    { 
      id: 4, 
      nombre: "Cinturón Premium Cuero", 
      precio: 49.99,
      imagen: "https://cdn.dummyjson.com/products/images/womens-shoes/Blue%20Band%20Aid%20Shoes/1.jpg" 
    },
    { 
      id: 5, 
      nombre: "Polera Urban Classic", 
      precio: 34.99,
      imagen: "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20Band%20Collar%20Shirt/1.jpg" 
    },
    { 
      id: 6, 
      nombre: "Pantalón Denim Premium", 
      precio: 79.99,
      imagen: "https://cdn.dummyjson.com/products/images/mens-shoes/Blue%20Casual%20Shoes/1.jpg" 
    },
    { 
      id: 7, 
      nombre: "Chaqueta Urban Style", 
      precio: 119.99,
      imagen: "https://cdn.dummyjson.com/products/images/mens-clothing/Black%20Leather%20Jacket/1.jpg" 
    },
    { 
      id: 8, 
      nombre: "Gorro Beanie Negro", 
      precio: 24.99,
      imagen: "https://cdn.dummyjson.com/products/images/womens-clothing/Black%20Beanie/1.jpg" 
    },
    { 
      id: 9, 
      nombre: "Sudadera Hoodie Gris", 
      precio: 64.99,
      imagen: "https://cdn.dummyjson.com/products/images/mens-clothing/Casual%20Long%20Sleeve/1.jpg" 
    },
    { 
      id: 10, 
      nombre: "Reloj Urban Watch", 
      precio: 149.99,
      imagen: "https://cdn.dummyjson.com/products/images/beauty/Nail%20Polish/1.jpg" 
    },
  ]);

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "0.7em", letterSpacing: "2px", color: "#ff6b6b", fontWeight: "bold" }}>
              URBAN
            </div>
            <div style={{ fontSize: "1em", fontWeight: "900", letterSpacing: "1px", margin: "0" }}>
              TREND
            </div>
          </div>
        </div>
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

      {/* Contenido */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Nuestros Productos</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No hay productos disponibles.
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
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogoPage;