import { useState } from "react";

export default function PanelAlmacenero({ onBackToCatalog, userRole, products, setProducts }) {
  const [activeTab, setActiveTab] = useState("inventario");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  
  // Usar productos globales compartidos
  const productos = products;

  const [movimientos, setMovimientos] = useState([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    productoId: "",
    tipo: "Entrada",
    cantidad: 0,
    motivo: ""
  });

  const actualizarStock = (id, cantidad) => {
    setProducts(products.map(p => 
      p.id === id ? {...p, stock: Math.max(0, p.stock + cantidad)} : p
    ));
  };

  const registrarMovimiento = () => {
    if (!nuevoMovimiento.productoId || nuevoMovimiento.cantidad <= 0) {
      alert("Completa todos los campos");
      return;
    }

    const producto = productos.find(p => p.id === parseInt(nuevoMovimiento.productoId));
    const cantidad = nuevoMovimiento.tipo === "Entrada" ? nuevoMovimiento.cantidad : -nuevoMovimiento.cantidad;
    
    actualizarStock(parseInt(nuevoMovimiento.productoId), cantidad);
    
    setMovimientos([{
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      producto: producto.nombre,
      tipo: nuevoMovimiento.tipo,
      cantidad: nuevoMovimiento.cantidad,
      motivo: nuevoMovimiento.motivo,
      stockResultante: producto.stock + cantidad
    }, ...movimientos]);

    setNuevoMovimiento({ productoId: "", tipo: "Entrada", cantidad: 0, motivo: "" });
    alert("Movimiento registrado exitosamente");
  };

  const productosConAlerta = productos.filter(p => p.stock <= p.stockMin);
  const productosFiltrados = productos.filter(p => 
    p.name.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.sku.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.ubicacion.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);
  const valorInventario = productos.reduce((acc, p) => acc + (p.stock * 50), 0); // Estimado S/.50 por unidad

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
      {/* Header */}
      <header style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", color: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5em", fontWeight: "700", letterSpacing: "0.5px" }}>📦 Panel Almacenero</h2>
          <small style={{ opacity: 0.8, fontSize: "0.9em" }}>Usuario: {userRole} | Fecha: {new Date().toLocaleDateString()}</small>
        </div>
        <button onClick={onBackToCatalog} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s" }} onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.3)"} onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}>
          🔙 Volver
        </button>
      </header>

      {/* Tabs */}
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "15px 30px", borderBottom: "3px solid #f5576c", display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("inventario")} style={{ padding: "12px 24px", background: activeTab === "inventario" ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" : "rgba(240, 147, 251, 0.1)", color: activeTab === "inventario" ? "#fff" : "#f5576c", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "inventario" ? "0 4px 15px rgba(245,87,108,0.4)" : "none" }}>
          📦 Inventario ({productos.length})
        </button>
        <button onClick={() => setActiveTab("movimientos")} style={{ padding: "12px 24px", background: activeTab === "movimientos" ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" : "rgba(240, 147, 251, 0.1)", color: activeTab === "movimientos" ? "#fff" : "#f5576c", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "movimientos" ? "0 4px 15px rgba(245,87,108,0.4)" : "none" }}>
          📝 Movimientos ({movimientos.length})
        </button>
        <button onClick={() => setActiveTab("alertas")} style={{ padding: "12px 24px", background: activeTab === "alertas" ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" : "rgba(240, 147, 251, 0.1)", color: activeTab === "alertas" ? "#fff" : "#f5576c", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "alertas" ? "0 4px 15px rgba(245,87,108,0.4)" : "none" }}>
          ⚠️ Alertas ({productosConAlerta.length})
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "30px" }}>
        {activeTab === "inventario" && (
          <div>
            {/* Estadísticas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "25px" }}>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(240,147,251,0.3)" }}>
                <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "8px" }}>📦 Total Productos</div>
                <div style={{ fontSize: "2em", fontWeight: "bold", color: "#f5576c" }}>{productos.length}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(76,175,80,0.3)" }}>
                <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "8px" }}>📊 Stock Total</div>
                <div style={{ fontSize: "2em", fontWeight: "bold", color: "#4CAF50" }}>{stockTotal}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(255,107,107,0.3)" }}>
                <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "8px" }}>⚠️ Alertas de Stock</div>
                <div style={{ fontSize: "2em", fontWeight: "bold", color: "#ff6b6b" }}>{productosConAlerta.length}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(102,126,234,0.3)" }}>
                <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "8px" }}>💰 Valor Estimado</div>
                <div style={{ fontSize: "1.5em", fontWeight: "bold", color: "#667eea" }}>S/. {valorInventario.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                📦 Inventario Actual
              </h3>

              {/* Buscador */}
              <div style={{ marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por producto, SKU o ubicación..." 
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }}
                  onFocus={(e) => e.target.style.borderColor = "#f5576c"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "#fff" }}>
                      <th style={{ padding: "14px", textAlign: "left", borderRadius: "10px 0 0 0" }}>SKU</th>
                      <th style={{ padding: "14px", textAlign: "left" }}>Producto</th>
                      <th style={{ padding: "14px", textAlign: "left" }}>Categoría</th>
                      <th style={{ padding: "14px", textAlign: "left" }}>Ubicación</th>
                      <th style={{ padding: "14px", textAlign: "center" }}>Stock</th>
                      <th style={{ padding: "14px", textAlign: "center" }}>Stock Mín</th>
                      <th style={{ padding: "14px", textAlign: "center", borderRadius: "0 10px 0 0" }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                          No se encontraron productos
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map(prod => (
                        <tr key={prod.id} style={{ background: "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(240,147,251,0.05)"} onMouseOut={(e) => e.currentTarget.style.background = "#fff"}>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", color: "#999", fontSize: "0.9em", fontWeight: "600" }}>{prod.sku}</td>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontWeight: "600" }}>{prod.nombre}</td>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0" }}>
                            <span style={{ padding: "4px 10px", background: "rgba(240,147,251,0.1)", color: "#f5576c", borderRadius: "6px", fontSize: "0.85em" }}>
                              {prod.categoria}
                            </span>
                          </td>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9em", color: "#666" }}>📍 {prod.ubicacion}</td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0", fontWeight: "bold", fontSize: "1.1em", color: "#f5576c" }}>{prod.stock}</td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0", color: "#999" }}>{prod.stockMin}</td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                            {prod.stock <= prod.stockMin ? (
                              <span style={{ padding: "6px 14px", background: "rgba(255,107,107,0.15)", color: "#ff6b6b", borderRadius: "10px", fontSize: "0.85em", fontWeight: "bold", border: "2px solid rgba(255,107,107,0.3)" }}>
                                ⚠️ Bajo
                              </span>
                            ) : (
                              <span style={{ padding: "6px 14px", background: "rgba(76,175,80,0.15)", color: "#4CAF50", borderRadius: "10px", fontSize: "0.85em", fontWeight: "bold", border: "2px solid rgba(76,175,80,0.3)" }}>
                                ✓ OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "movimientos" && (
          <div>
            {/* Formulario */}
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", marginBottom: "25px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(240,147,251,0.2)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                ➕ Registrar Movimiento
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>📦 Producto</label>
                  <select value={nuevoMovimiento.productoId} onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, productoId: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", cursor: "pointer", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#f5576c"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}>
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>🔄 Tipo de Movimiento</label>
                  <select value={nuevoMovimiento.tipo} onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, tipo: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", cursor: "pointer", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#f5576c"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}>
                    <option>Entrada</option>
                    <option>Salida</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>🔢 Cantidad</label>
                  <input type="number" min="1" value={nuevoMovimiento.cantidad} onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, cantidad: parseInt(e.target.value) || 0})} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#f5576c"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"} />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>📝 Motivo</label>
                  <input type="text" value={nuevoMovimiento.motivo} onChange={(e) => setNuevoMovimiento({...nuevoMovimiento, motivo: e.target.value})} placeholder="Ej: Compra proveedor, Venta cliente, Devolución" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#f5576c"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"} />
                </div>
              </div>
              
              {nuevoMovimiento.productoId && (
                <div style={{ marginTop: "15px", padding: "12px", background: "rgba(240,147,251,0.1)", borderRadius: "10px", border: "2px solid rgba(240,147,251,0.3)" }}>
                  <span style={{ fontSize: "0.9em", color: "#666" }}>
                    Stock actual: <strong style={{ color: "#f5576c", fontSize: "1.1em" }}>
                      {productos.find(p => p.id === parseInt(nuevoMovimiento.productoId))?.stock || 0}
                    </strong> unidades
                  </span>
                </div>
              )}

              <button onClick={registrarMovimiento} style={{ marginTop: "20px", width: "100%", padding: "14px", background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "1.05em", boxShadow: "0 6px 20px rgba(76,175,80,0.4)", transition: "all 0.3s" }} onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.target.style.transform = "translateY(0)"}>
                ✓ Registrar Movimiento
              </button>
            </div>

            {/* Historial */}
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                📋 Historial de Movimientos
                {movimientos.length > 0 && <span style={{ fontSize: "0.75em", background: "#f5576c", color: "#fff", padding: "4px 12px", borderRadius: "20px" }}>{movimientos.length}</span>}
              </h3>
              {movimientos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                  <div style={{ fontSize: "3em", marginBottom: "10px" }}>📋</div>
                  <p>No hay movimientos registrados</p>
                  <p style={{ fontSize: "0.9em" }}>Los movimientos aparecerán aquí</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "#fff" }}>
                        <th style={{ padding: "14px", textAlign: "left", borderRadius: "10px 0 0 0" }}>Fecha y Hora</th>
                        <th style={{ padding: "14px", textAlign: "left" }}>Producto</th>
                        <th style={{ padding: "14px", textAlign: "center" }}>Tipo</th>
                        <th style={{ padding: "14px", textAlign: "center" }}>Cantidad</th>
                        <th style={{ padding: "14px", textAlign: "center" }}>Stock Resultante</th>
                        <th style={{ padding: "14px", textAlign: "left", borderRadius: "0 10px 0 0" }}>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.map(mov => (
                        <tr key={mov.id} style={{ background: "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(240,147,251,0.05)"} onMouseOut={(e) => e.currentTarget.style.background = "#fff"}>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.85em", color: "#666" }}>{mov.fecha}</td>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontWeight: "600" }}>{mov.producto}</td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                            <span style={{ padding: "6px 14px", background: mov.tipo === "Entrada" ? "rgba(76,175,80,0.15)" : "rgba(255,107,107,0.15)", color: mov.tipo === "Entrada" ? "#4CAF50" : "#ff6b6b", borderRadius: "10px", fontSize: "0.85em", fontWeight: "bold", border: mov.tipo === "Entrada" ? "2px solid rgba(76,175,80,0.3)" : "2px solid rgba(255,107,107,0.3)" }}>
                              {mov.tipo === "Entrada" ? "⬆️ Entrada" : "⬇️ Salida"}
                            </span>
                          </td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0", fontWeight: "bold", fontSize: "1.1em", color: mov.tipo === "Entrada" ? "#4CAF50" : "#ff6b6b" }}>
                            {mov.tipo === "Entrada" ? "+" : "-"}{mov.cantidad}
                          </td>
                          <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0", fontWeight: "bold", color: "#f5576c" }}>{mov.stockResultante}</td>
                          <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9em", color: "#666" }}>{mov.motivo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "alertas" && (
          <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
              ⚠️ Productos con Stock Bajo
              {productosConAlerta.length > 0 && <span style={{ fontSize: "0.75em", background: "#ff6b6b", color: "#fff", padding: "4px 12px", borderRadius: "20px", animation: "pulse 2s infinite" }}>{productosConAlerta.length} alertas</span>}
            </h3>
            {productosConAlerta.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "4em", marginBottom: "15px" }}>✓</div>
                <p style={{ color: "#4CAF50", fontSize: "1.2em", fontWeight: "bold", marginBottom: "10px" }}>¡Excelente!</p>
                <p style={{ color: "#666" }}>Todos los productos tienen stock suficiente</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {productosConAlerta.map(prod => (
                  <div key={prod.id} style={{ padding: "20px", border: "3px solid rgba(255,107,107,0.4)", background: "linear-gradient(135deg, rgba(255,245,245,0.9) 0%, rgba(255,235,235,0.9) 100%)", borderRadius: "12px", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateX(5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateX(0)"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#333", marginBottom: "8px" }}>{prod.nombre}</div>
                        <div style={{ display: "flex", gap: "15px", fontSize: "0.9em", color: "#666" }}>
                          <span>📦 SKU: <strong>{prod.sku}</strong></span>
                          <span>📍 {prod.ubicacion}</span>
                        </div>
                        <div style={{ marginTop: "8px" }}>
                          <span style={{ padding: "4px 10px", background: "rgba(240,147,251,0.2)", color: "#f5576c", borderRadius: "6px", fontSize: "0.85em", fontWeight: "600" }}>
                            {prod.categoria}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", background: "rgba(255,107,107,0.1)", padding: "15px", borderRadius: "10px", border: "2px solid rgba(255,107,107,0.3)" }}>
                        <div style={{ fontSize: "2em", fontWeight: "bold", color: "#ff6b6b", lineHeight: "1" }}>{prod.stock}</div>
                        <div style={{ fontSize: "0.75em", color: "#999", marginTop: "5px" }}>de {prod.stockMin} mínimo</div>
                        <div style={{ marginTop: "8px", fontSize: "0.85em", color: "#ff6b6b", fontWeight: "600" }}>
                          Faltan: {prod.stockMin - prod.stock}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px", background: "rgba(255,107,107,0.15)", borderRadius: "10px", border: "2px solid rgba(255,107,107,0.3)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "1.5em" }}>⚠️</span>
                      <div>
                        <div style={{ fontSize: "0.95em", color: "#d32f2f", fontWeight: "600", marginBottom: "4px" }}>
                          ¡ACCIÓN REQUERIDA!
                        </div>
                        <div style={{ fontSize: "0.85em", color: "#666" }}>
                          Stock por debajo del mínimo. Contactar al proveedor: <strong>{prod.proveedor}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
