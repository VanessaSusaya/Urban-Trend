import React, { useEffect, useState } from "react";
import { initialProducts } from "../data/products";
import { mockSalesData } from "../data/sales";

export default function PaginaAdministrativo({
  onBackToCatalog,
  userRole,
  products: productsProp,
  onAgregar,
  onEditar,
  onEliminar,
}) {
  // Si no eres admin redirige (manteniendo UX original)
  useEffect(() => {
    if (userRole !== "admin") {
      alert("No tienes permiso para acceder al panel administrativo.");
      onBackToCatalog();
    }
  }, [userRole, onBackToCatalog]);

  // control de sección y notificaciones
  const [activeSection, setActiveSection] = useState("ventas");
  const [notification, setNotification] = useState(null);

  // editing
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  // nuevo producto (form)
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    price: "",
    sku: "",
    categoria: "",
    size: "",
    color: "",
    stock: "",
    imagen: "",
  });

  // fuente de productos: si viene por props (controlado) lo usamos; si no, mantenemos estado local
  const [localProducts, setLocalProducts] = useState(initialProducts);
  const products = Array.isArray(productsProp) ? productsProp : localProducts;

  const notify = (msg, ms = 2200) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), ms);
  };

  // ---------- AGREGAR PRODUCTO ----------
  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProductForm.name || !newProductForm.price || !newProductForm.sku) {
      notify("Por favor completa los campos requeridos");
      return;
    }

    const newProduct = {
      id: Date.now(),
      ...newProductForm,
      price: Number(newProductForm.price),
      stock: Number(newProductForm.stock || 0),
    };

    // 1) si existe callback, avisamos al padre (App.jsx) para que actualice su estado global
    if (typeof onAgregar === "function") {
      try {
        onAgregar(newProduct);
      } catch (err) {
        // no fallamos si el padre lanza algo, seguimos con fallback
        console.warn("onAgregar threw:", err);
      }
    }

    // 2) fallback: actualizamos nuestro estado local (por si no nos pasaron callback)
    if (!Array.isArray(productsProp)) {
      setLocalProducts((prev) => [...prev, newProduct]);
    }

    notify(`Producto "${newProduct.name}" agregado exitosamente`);
    setNewProductForm({
      name: "",
      price: "",
      sku: "",
      categoria: "",
      size: "",
      color: "",
      stock: "",
      imagen: "",
    });
  };

  // ---------- ELIMINAR PRODUCTO ----------
  const handleDeleteProduct = (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;

    if (typeof onEliminar === "function") {
      try {
        onEliminar(id);
      } catch (err) {
        console.warn("onEliminar threw:", err);
      }
    }

    if (!Array.isArray(productsProp)) {
      setLocalProducts((prev) => prev.filter((x) => x.id !== id));
    }

    notify(`Producto "${p.name}" eliminado`);
  };

  // ---------- EDITAR PRECIO ----------
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

    const updated = { ...editingProduct, price: Number(newPrice) };

    if (typeof onEditar === "function") {
      try {
        onEditar(updated);
      } catch (err) {
        console.warn("onEditar threw:", err);
      }
    }

    if (!Array.isArray(productsProp)) {
      setLocalProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }

    notify(`Precio actualizado: ${updated.name} → S/. ${Number(updated.price).toFixed(2)}`);
    closeEditModal();
  };

  // ---------- UI helpers ----------
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
            <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700 }}>{d.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const TablaPrecios = () => {
    if (!products || products.length === 0) return <p>No hay productos registrados.</p>;

    return (
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" }}>
        <thead style={{ background: "#f6f6f6" }}>
          <tr>
            <th style={{ textAlign: "left", padding: 10 }}>Producto</th>
            <th style={{ textAlign: "left", padding: 10 }}>SKU</th>
            <th style={{ textAlign: "left", padding: 10 }}>Precio</th>
            <th style={{ textAlign: "left", padding: 10 }}>Stock</th>
            <th style={{ padding: 10 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #fafafa" }}>
              <td style={{ padding: 10 }}>{p.name}</td>
              <td style={{ padding: 10 }}>{p.sku ?? "-"}</td>
              <td style={{ padding: 10 }}>S/. {Number(p.price).toFixed(2)}</td>
              <td style={{ padding: 10 }}>{p.stock}</td>

              <td style={{ padding: 10, textAlign: "center" }}>
                <button onClick={() => openEditModal(p)} style={{ padding: "6px 10px", background: "#222", color: "#fff", borderRadius: 6 }}>
                  Editar Precio
                </button>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  style={{ padding: "6px 10px", background: "#ff6b6b", color: "#fff", marginLeft: 8, borderRadius: 6 }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------- RENDER ----------
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7" }}>
      {/* Sidebar (estilos conservados) */}
      <aside style={{ width: 240, background: "#222", color: "#fff", padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "0.7em", letterSpacing: "2px", color: "#ff6b6b", fontWeight: "bold" }}>URBAN</div>
          <div style={{ fontSize: "1em", fontWeight: "900", letterSpacing: "1px" }}>TREND</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setActiveSection("ventas")}
            style={{ padding: 10, borderRadius: 8, background: activeSection === "ventas" ? "#444" : "transparent", color: "#fff" }}
          >
            📊 Reportes de Ventas
          </button>

          <button
            onClick={() => setActiveSection("precios")}
            style={{ padding: 10, borderRadius: 8, background: activeSection === "precios" ? "#444" : "transparent", color: "#fff" }}
          >
            💰 Gestión de Precios
          </button>

          <button
            onClick={() => setActiveSection("productos")}
            style={{ padding: 10, borderRadius: 8, background: activeSection === "productos" ? "#444" : "transparent", color: "#fff" }}
          >
            📦 Registrar Productos
          </button>

          <button onClick={onBackToCatalog} style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "#666", color: "#fff" }}>
            🔙 Volver al Catálogo
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        {notification && (
          <div style={{ background: "#e6ffea", border: "1px solid #b6f0c7", padding: 10, borderRadius: 8, marginBottom: 12 }}>{notification}</div>
        )}

        {activeSection === "ventas" && (
          <>
            <h2>📊 Reportes de Ventas</h2>
            <SummaryCards />

            <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
              <div style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 10 }}>
                <h4>Total de Ventas - Última Semana</h4>
                <p style={{ fontSize: 18, fontWeight: 700 }}>S/. {mockSalesData.weeklyTotal.toFixed(2)}</p>

                <h5 style={{ marginTop: 14 }}>Productos más vendidos</h5>
                <ol>
                  {mockSalesData.topProducts.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}

        {activeSection === "precios" && (
          <>
            <h2>💰 Gestión de Precios</h2>
            <TablaPrecios />
          </>
        )}

        {activeSection === "productos" && (
          <>
            <h2>📦 Registrar Productos</h2>

            <form onSubmit={handleAddProduct} style={{ background: "#fff", padding: 20, borderRadius: 10, marginTop: 12 }}>
              <h4>Agregar nuevo producto</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <input placeholder="Nombre" value={newProductForm.name} onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })} />
                <input placeholder="Precio" value={newProductForm.price} onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })} />
                <input placeholder="SKU" value={newProductForm.sku} onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })} />
                <input placeholder="Categoría" value={newProductForm.categoria} onChange={(e) => setNewProductForm({ ...newProductForm, categoria: e.target.value })} />
                <input placeholder="Talla" value={newProductForm.size} onChange={(e) => setNewProductForm({ ...newProductForm, size: e.target.value })} />
                <input placeholder="Color" value={newProductForm.color} onChange={(e) => setNewProductForm({ ...newProductForm, color: e.target.value })} />
                <input placeholder="Stock" value={newProductForm.stock} onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })} />
                <input placeholder="URL imagen (opcional)" value={newProductForm.imagen} onChange={(e) => setNewProductForm({ ...newProductForm, imagen: e.target.value })} />
              </div>

              <button style={{ marginTop: 15, background: "#222", color: "#fff", padding: "8px 16px", borderRadius: 8 }}>
                Agregar Producto
              </button>
            </form>
          </>
        )}

        {/* Edit price modal (simple inline) */}
        {editingProduct && (
          <div style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 420, background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
              <h4>Editar precio — {editingProduct.name}</h4>
              <div style={{ marginTop: 12 }}>
                <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6 }} />
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={closeEditModal} style={{ padding: "8px 12px", background: "#eee", borderRadius: 6 }}>Cancelar</button>
                <button onClick={updatePrice} style={{ padding: "8px 12px", background: "#222", color: "#fff", borderRadius: 6 }}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
