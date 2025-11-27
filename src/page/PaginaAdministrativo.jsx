import React, { useState, useEffect } from "react";

const mockSalesData = {
  weeklyTotal: 12450.0,
  topProducts: [
    "Poleras Urban Classic",
    "Zapatillas StreetWave",
    "Casacas WinterPro",
  ],
};

const initialProducts = [
  { id: 1, name: "Zapatillas Urban Street", price: 89.99, sku: "ZUS-001", categoria: "Calzados", size: "42", color: "Negro", stock: 20 },
  { id: 2, name: "Mochila Urban Black", price: 59.99, sku: "MUB-002", categoria: "Accesorios", size: "Único", color: "Negro", stock: 15 },
  { id: 3, name: "Gafas de Sol Trendy", price: 129.99, sku: "GST-003", categoria: "Accesorios", size: "Único", color: "Negro", stock: 12 },
  { id: 4, name: "Cinturón Premium Cuero", price: 49.99, sku: "CPC-004", categoria: "Accesorios", size: "Único", color: "Marrón", stock: 18 },
  { id: 5, name: "Polera Urban Classic", price: 34.99, sku: "PUC-005", categoria: "Camisetas", size: "M", color: "Negro", stock: 30 },
  { id: 6, name: "Pantalón Denim Premium", price: 79.99, sku: "PDP-006", categoria: "Pantalones", size: "32", color: "Azul", stock: 22 },
  { id: 7, name: "Chaqueta Urban Style", price: 119.99, sku: "CUS-007", categoria: "Chaquetas", size: "L", color: "Gris", stock: 10 },
  { id: 8, name: "Gorro Beanie Negro", price: 24.99, sku: "GBN-008", categoria: "Accesorios", size: "Único", color: "Negro", stock: 25 },
  { id: 9, name: "Sudadera Hoodie Gris", price: 64.99, sku: "SHG-009", categoria: "Sudaderas", size: "L", color: "Gris", stock: 14 },
  { id: 10, name: "Reloj Urban Watch", price: 149.99, sku: "RUW-010", categoria: "Accesorios", size: "Único", color: "Plata", stock: 8 },
];

export default function PaginaAdministrativo({ onBackToCatalog, userRole }) {
  const [activeSection, setActiveSection] = useState("ventas"); // ventas | precios | productos
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ startDate: "", endDate: "", category: "Todos" });
  const [notification, setNotification] = useState(null);

  // Modal estado
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  // Formulario de nuevo producto
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    price: "",
    sku: "",
    categoria: "",
    size: "",
    color: "",
    stock: "",
  });

  // Carga de datos
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProducts(initialProducts);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Funciones
  const applyFilters = () => {
    setNotification("Filtros aplicados");
    setTimeout(() => setNotification(null), 2000);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewPrice(product.price);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setNewPrice("");
  };

  const updatePrice = () => {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, price: Number(newPrice) } : p))
    );
    setNotification(`Precio actualizado: ${editingProduct.name} → S/. ${Number(newPrice).toFixed(2)}`);
    closeEditModal();
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price || !newProductForm.sku) {
      setNotification("Por favor completa los campos requeridos");
      return;
    }
    
    const newProduct = {
      id: products.length + 1,
      name: newProductForm.name,
      price: Number(newProductForm.price),
      sku: newProductForm.sku,
      categoria: newProductForm.categoria,
      size: newProductForm.size,
      color: newProductForm.color,
      stock: Number(newProductForm.stock) || 0,
    };
    
    setProducts([...products, newProduct]);
    setNotification(`Producto "${newProductForm.name}" agregado exitosamente`);
    setNewProductForm({ name: "", price: "", sku: "", categoria: "", size: "", color: "", stock: "" });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleDeleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(p => p.id !== id));
    setNotification(`Producto "${product.name}" eliminado`);
    setTimeout(() => setNotification(null), 2500);
  };

  // UI subcomponent: SummaryCards
  const SummaryCards = () => {
    const data = [
      { title: "Total Ventas - Última Semana", value: `S/. ${mockSalesData.weeklyTotal.toFixed(2)}` },
      { title: "Ingresos del Mes", value: "S/. 18,320.00" },
      { title: "Productos Activos", value: products.length },
    ];

    return (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              minWidth: 180,
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>{d.title}</div>
            <div style={{ marginTop: 8, fontSize: 20, fontWeight: "700" }}>{d.value}</div>
          </div>
        ))}
      </div>
    );
  };

  // UI subcomponent: TablaPrecios
  const TablaPrecios = () => {
    if (loading) return <p>Cargando productos...</p>;
    if (!products.length) return <p>No hay productos registrados.</p>;

    return (
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <thead style={{ background: "#f6f6f6" }}>
          <tr>
            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Producto</th>
            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>SKU</th>
            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Precio</th>
            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Stock</th>
            <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #fafafa" }}>
              <td style={{ padding: 10 }}>{p.name}</td>
              <td style={{ padding: 10 }}>{p.sku}</td>
              <td style={{ padding: 10 }}>S/. {Number(p.price).toFixed(2)}</td>
              <td style={{ padding: 10 }}>{p.stock}</td>
              <td style={{ padding: 10, textAlign: "center" }}>
                <button onClick={() => openEditModal(p)} style={{ padding: "6px 10px", background: "#222", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 5, fontSize: "0.85em" }}>
                  Editar Precio
                </button>
                <button onClick={() => handleDeleteProduct(p.id)} style={{ padding: "6px 10px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.85em" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", background: "#f4f5f7" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#222", color: "#fff", padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "0.7em", letterSpacing: "2px", color: "#ff6b6b", fontWeight: "bold" }}>
            URBAN
          </div>
          <div style={{ fontSize: "1em", fontWeight: "900", letterSpacing: "1px" }}>
            TREND
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setActiveSection("ventas")} style={{ padding: 10, borderRadius: 8, background: activeSection === "ventas" ? "#444" : "transparent", color: "#fff", border: "none", textAlign: "left", cursor: "pointer" }}>
            📊 Reportes de Ventas
          </button>

          <button onClick={() => setActiveSection("precios")} style={{ padding: 10, borderRadius: 8, background: activeSection === "precios" ? "#444" : "transparent", color: "#fff", border: "none", textAlign: "left", cursor: "pointer" }}>
            💰 Gestión de Precios
          </button>

          <button onClick={() => setActiveSection("productos")} style={{ padding: 10, borderRadius: 8, background: activeSection === "productos" ? "#444" : "transparent", color: "#fff", border: "none", textAlign: "left", cursor: "pointer" }}>
            📦 Registrar Productos
          </button>

          <button onClick={onBackToCatalog} style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#666", color: "#fff", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>
            🔙 Volver al Catálogo
          </button>
        </nav>

        <div style={{ marginTop: "auto", fontSize: 12, color: "#bbb", textAlign: "center" }}>
          © 2025 UrbanTrend
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24 }}>
        {/* Notification */}
        {notification && (
          <div style={{ background: "#e6ffea", border: "1px solid #b6f0c7", padding: 10, borderRadius: 8, marginBottom: 12 }}>
            {notification}
          </div>
        )}

        {activeSection === "ventas" && (
          <>
            <h2>📊 Reportes de Ventas</h2>
            <SummaryCards />

            <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
              <div style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h4>Total de Ventas - Última Semana</h4>
                <p style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>S/. {mockSalesData.weeklyTotal.toFixed(2)}</p>

                <h5 style={{ marginTop: 14 }}>Productos más vendidos</h5>
                <ol>
                  {mockSalesData.topProducts.map((t, i) => <li key={i}>{t}</li>)}
                </ol>
              </div>
            </div>
          </>
        )}

        {activeSection === "precios" && (
          <>
            <h2>💰 Gestión de Precios</h2>
            <div style={{ marginTop: 12, background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              <h4>Modificar precios de productos</h4>
              <TablaPrecios />
            </div>
          </>
        )}

        {activeSection === "productos" && (
          <>
            <h2>📦 Registrar Nuevos Productos</h2>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Formulario */}
              <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h4>Formulario de Registro</h4>
                <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Nombre *</label>
                    <input type="text" placeholder="Nombre del producto" value={newProductForm.name} onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Precio *</label>
                    <input type="number" placeholder="0.00" value={newProductForm.price} onChange={(e) => setNewProductForm({...newProductForm, price: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>SKU *</label>
                    <input type="text" placeholder="Ej: PROD-001" value={newProductForm.sku} onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Categoría</label>
                    <select value={newProductForm.categoria} onChange={(e) => setNewProductForm({...newProductForm, categoria: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }}>
                      <option value="">Seleccionar...</option>
                      <option value="Camisetas">Camisetas</option>
                      <option value="Pantalones">Pantalones</option>
                      <option value="Chaquetas">Chaquetas</option>
                      <option value="Calzados">Calzados</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Talla</label>
                    <input type="text" placeholder="S, M, L, XL..." value={newProductForm.size} onChange={(e) => setNewProductForm({...newProductForm, size: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Color</label>
                    <input type="text" placeholder="Ej: Negro, Rojo..." value={newProductForm.color} onChange={(e) => setNewProductForm({...newProductForm, color: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.9em", color: "#555" }}>Stock</label>
                    <input type="number" placeholder="0" value={newProductForm.stock} onChange={(e) => setNewProductForm({...newProductForm, stock: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", marginTop: 4 }} />
                  </div>

                  <button type="submit" style={{ padding: 12, background: "#222", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginTop: 8 }}>
                    ✅ Guardar Producto
                  </button>
                </form>
              </div>

              {/* Listado */}
              <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h4>Inventario ({products.length})</h4>
                {products.length === 0 ? (
                  <p style={{ color: "#999" }}>Sin productos aún...</p>
                ) : (
                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    {products.map((p) => (
                      <div key={p.id} style={{ padding: 12, borderBottom: "1px solid #eee", fontSize: "0.9em" }}>
                        <div style={{ fontWeight: "bold" }}>{p.name}</div>
                        <div style={{ color: "#666", fontSize: "0.85em" }}>SKU: {p.sku} | Stock: {p.stock}</div>
                        <div style={{ color: "#ff6b6b", fontWeight: "bold" }}>S/. {p.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal: Edit Price */}
      {editingProduct && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.4)", zIndex: 9999
        }}>
          <div style={{ width: 420, background: "#fff", borderRadius: 10, padding: 18 }}>
            <h4 style={{ marginTop: 0 }}>Editar precio - {editingProduct.name}</h4>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
              />
              <button onClick={updatePrice} style={{ padding: "10px 14px", background: "#222", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Guardar
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={closeEditModal} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
