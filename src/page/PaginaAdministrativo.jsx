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
  { id: 1, name: "Polera Urban Classic", price: 89.9, sku: "PUC-001" },
  { id: 2, name: "Zapatillas StreetWave", price: 159.0, sku: "ZSW-002" },
  { id: 3, name: "Casaca WinterPro", price: 220.0, sku: "CWP-003" },
];

export default function PaginaAdministrativo({ onLogout, userRole }) {
  const [activeSection, setActiveSection] = useState("ventas"); // ventas | precios
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ startDate: "", endDate: "", category: "Todos" });
  const [notification, setNotification] = useState(null);

  // Modal estado
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  // Carga de datos
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProducts(initialProducts);
      setLoading(false);
    }, 600); // simulación
    return () => clearTimeout(t);
  }, []);

  // Funciones
  const applyFilters = () => {
    // Placeholder: aquí iría la lógica real para filtrar reportes
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

  // UI subcomponent: FiltrosReportes
  const FiltrosReportes = () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18, alignItems: "flex-end" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontSize: 12, color: "#555" }}>Fecha Inicio</label>
        <input type="date" value={filter.startDate} onChange={(e) => setFilter(f => ({...f, startDate: e.target.value}))} style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontSize: 12, color: "#555" }}>Fecha Fin</label>
        <input type="date" value={filter.endDate} onChange={(e) => setFilter(f => ({...f, endDate: e.target.value}))} style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontSize: 12, color: "#555" }}>Categoría</label>
        <select value={filter.category} onChange={(e) => setFilter(f => ({...f, category: e.target.value}))} style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}>
          <option>Todos</option>
          <option>Ropa</option>
          <option>Calzados</option>
          <option>Accesorios</option>
        </select>
      </div>

      <button onClick={applyFilters} style={{ padding: "10px 14px", background: "#222", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>Aplicar</button>
    </div>
  );

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
            <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>Precio Actual</th>
            <th style={{ padding: 10, borderBottom: "1px solid #eee" }}>Acción</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #fafafa" }}>
              <td style={{ padding: 10 }}>{p.name}</td>
              <td style={{ padding: 10 }}>{p.sku}</td>
              <td style={{ padding: 10 }}>S/. {Number(p.price).toFixed(2)}</td>
              <td style={{ padding: 10, textAlign: "center" }}>
                <button onClick={() => openEditModal(p)} style={{ padding: "8px 12px", background: "#222", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  Editar
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
        <h3 style={{ textAlign: "center", marginBottom: 18 }}>Admin Panel</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setActiveSection("ventas")} style={{ padding: 10, borderRadius: 8, background: activeSection === "ventas" ? "#444" : "transparent", color: "#fff", border: "none", textAlign: "left", cursor: "pointer" }}>
            📊 Reportes de Ventas
          </button>

          <button onClick={() => setActiveSection("precios")} style={{ padding: 10, borderRadius: 8, background: activeSection === "precios" ? "#444" : "transparent", color: "#fff", border: "none", textAlign: "left", cursor: "pointer" }}>
            💰 Gestión de Precios
          </button>

          <button onClick={onLogout} style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#666", color: "#fff", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}>
            🔙 Salir
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
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>📊 Reportes de Ventas</h2>
            </header>

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

              <div style={{ width: 360, background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h4>Filtros</h4>
                <FiltrosReportes />
              </div>
            </div>
          </>
        )}

        {activeSection === "precios" && (
          <>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>💰 Gestión de Precios</h2>
            </header>

            <div style={{ marginTop: 12 }}>
              <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <h4>Modificar precios de productos</h4>

                <TablaPrecios />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal: Edit Price (simple) */}
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
