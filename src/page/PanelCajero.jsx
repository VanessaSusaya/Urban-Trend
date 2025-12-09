import { useState } from "react";

export default function PanelCajero({ onBackToCatalog, userRole, products, setProducts }) {
  const [activeTab, setActiveTab] = useState("ventas");
  const [carrito, setCarrito] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [ventas, setVentas] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [ticketActual, setTicketActual] = useState(null);

  // Usar productos globales compartidos con validación
  const productosDisponibles = products || [];
  
  // Validación de seguridad
  if (!products || !setProducts) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Error: No se pudieron cargar los productos</p>
        <button onClick={onBackToCatalog}>Volver al Catálogo</button>
      </div>
    );
  }

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert("Producto sin stock disponible");
      return;
    }
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1, nombre: producto.name, precio: producto.price }]);
    }
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter(item => item.id !== id));
    } else {
      setCarrito(carrito.map(item => 
        item.id === id ? {...item, cantidad: nuevaCantidad} : item
      ));
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((sum, item) => sum + ((item.precio || item.price) * item.cantidad), 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    return subtotal - (subtotal * descuento / 100);
  };

  const calcularVuelto = () => {
    const total = calcularTotal();
    const recibido = parseFloat(montoRecibido) || 0;
    return recibido - total;
  };

  const procesarVenta = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (metodoPago === "Efectivo" && calcularVuelto() < 0) {
      alert("El monto recibido es insuficiente");
      return;
    }

    // Actualizar stock global de productos
    const productosActualizados = products.map(prod => {
      const itemCarrito = carrito.find(item => item.id === prod.id);
      if (itemCarrito) {
        return { ...prod, stock: Math.max(0, prod.stock - itemCarrito.cantidad) };
      }
      return prod;
    });
    setProducts(productosActualizados);

    const nuevaVenta = {
      id: Date.now(),
      numeroTicket: `T${Date.now().toString().slice(-6)}`,
      fecha: new Date().toLocaleString(),
      cliente: clienteNombre || "Cliente General",
      documento: clienteDocumento || "---",
      items: [...carrito],
      subtotal: calcularSubtotal(),
      descuento: descuento,
      total: calcularTotal(),
      metodoPago: metodoPago,
      montoRecibido: metodoPago === "Efectivo" ? parseFloat(montoRecibido) : calcularTotal(),
      vuelto: metodoPago === "Efectivo" ? calcularVuelto() : 0
    };

    setVentas([nuevaVenta, ...ventas]);
    setTicketActual(nuevaVenta);
    setMostrarTicket(true);
    setCarrito([]);
    setDescuento(0);
    setClienteNombre("");
    setClienteDocumento("");
    setMontoRecibido("");
  };

  // Filtrado de productos con validación segura
  const productosFiltrados = productosDisponibles.filter(p => {
    if (!p || !p.name || !p.codigo) return false;
    return p.name.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
           p.codigo.toLowerCase().includes(busquedaProducto.toLowerCase());
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Header */}
      <header style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", color: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5em", fontWeight: "700", letterSpacing: "0.5px" }}>💰 Panel Cajero</h2>
          <small style={{ opacity: 0.8, fontSize: "0.9em" }}>Usuario: {userRole} | Fecha: {new Date().toLocaleDateString()}</small>
        </div>
        <button onClick={onBackToCatalog} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s" }} onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.3)"} onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}>
          🔙 Volver
        </button>
      </header>

      {/* Tabs */}
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "15px 30px", borderBottom: "3px solid #667eea", display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("ventas")} style={{ padding: "12px 24px", background: activeTab === "ventas" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(102, 126, 234, 0.1)", color: activeTab === "ventas" ? "#fff" : "#667eea", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "ventas" ? "0 4px 15px rgba(102,126,234,0.4)" : "none" }}>
          💰 Nueva Venta
        </button>
        <button onClick={() => setActiveTab("historial")} style={{ padding: "12px 24px", background: activeTab === "historial" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(102, 126, 234, 0.1)", color: activeTab === "historial" ? "#fff" : "#667eea", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "historial" ? "0 4px 15px rgba(102,126,234,0.4)" : "none" }}>
          📋 Historial ({ventas.length})
        </button>
        <button onClick={() => setActiveTab("productos")} style={{ padding: "12px 24px", background: activeTab === "productos" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(102, 126, 234, 0.1)", color: activeTab === "productos" ? "#fff" : "#667eea", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "productos" ? "0 4px 15px rgba(102,126,234,0.4)" : "none" }}>
          🔍 Productos
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "30px" }}>
        {activeTab === "ventas" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Productos */}
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                🛍️ Productos Disponibles
              </h3>
              
              {/* Buscador */}
              <div style={{ marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por nombre o código..." 
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                {productosFiltrados.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>No se encontraron productos</p>
                ) : (
                  productosFiltrados.map(prod => (
                    <div key={prod.id} style={{ padding: "16px", border: "2px solid #f0f0f0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: prod.stock < 10 ? "rgba(255,107,107,0.05)" : "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", fontSize: "1em", color: "#333", marginBottom: "4px" }}>{prod.nombre}</div>
                        <div style={{ fontSize: "0.85em", color: "#999", marginBottom: "6px" }}>Código: {prod.codigo} | {prod.categoria}</div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{ color: "#667eea", fontWeight: "bold", fontSize: "1.1em" }}>S/. {prod.precio.toFixed(2)}</span>
                          <span style={{ fontSize: "0.85em", color: prod.stock < 10 ? "#ff6b6b" : "#4CAF50", fontWeight: "600" }}>
                            {prod.stock < 10 ? "⚠️" : "✓"} Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => agregarAlCarrito(prod)} 
                        disabled={prod.stock === 0}
                        style={{ padding: "10px 20px", background: prod.stock === 0 ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", border: "none", borderRadius: "10px", cursor: prod.stock === 0 ? "not-allowed" : "pointer", fontWeight: "600", boxShadow: prod.stock === 0 ? "none" : "0 4px 15px rgba(102,126,234,0.3)", transition: "all 0.3s" }}
                      >
                        {prod.stock === 0 ? "Agotado" : "+ Agregar"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Carrito */}
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                🛒 Carrito de Compras {carrito.length > 0 && <span style={{ fontSize: "0.8em", background: "#667eea", color: "#fff", padding: "4px 12px", borderRadius: "20px" }}>({carrito.length})</span>}
              </h3>
              
              {carrito.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                  <div style={{ fontSize: "3em", marginBottom: "10px" }}>🛒</div>
                  <p>El carrito está vacío</p>
                  <p style={{ fontSize: "0.9em" }}>Agrega productos para comenzar</p>
                </div>
              ) : (
                <>
                  {/* Información del Cliente */}
                  <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(102,126,234,0.05)", borderRadius: "12px", border: "2px solid rgba(102,126,234,0.2)" }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "1em", color: "#667eea" }}>👤 Datos del Cliente</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                      <input 
                        type="text" 
                        placeholder="Nombre del cliente (opcional)" 
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9em" }}
                      />
                      <input 
                        type="text" 
                        placeholder="DNI/RUC" 
                        value={clienteDocumento}
                        onChange={(e) => setClienteDocumento(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "0.9em" }}
                      />
                    </div>
                  </div>

                  {/* Items del Carrito */}
                  <div style={{ marginBottom: "20px", maxHeight: "250px", overflowY: "auto" }}>
                    {carrito.map(item => (
                      <div key={item.id} style={{ padding: "14px", borderBottom: "2px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(102,126,234,0.03)"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold", fontSize: "0.95em", marginBottom: "4px" }}>{item.nombre}</div>
                          <div style={{ color: "#999", fontSize: "0.85em" }}>S/. {item.precio.toFixed(2)} c/u</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} style={{ padding: "6px 12px", background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s" }}>−</button>
                          <span style={{ fontWeight: "bold", fontSize: "1.1em", minWidth: "30px", textAlign: "center" }}>{item.cantidad}</span>
                          <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} style={{ padding: "6px 12px", background: "rgba(102,126,234,0.1)", color: "#667eea", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "all 0.3s" }}>+</button>
                          <span style={{ marginLeft: "10px", fontWeight: "bold", fontSize: "1em", color: "#667eea" }}>S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Configuración de Venta */}
                  <div style={{ borderTop: "3px solid #f0f0f0", paddingTop: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>💸 Descuento (%)</label>
                        <input type="number" value={descuento} onChange={(e) => setDescuento(Math.max(0, Math.min(100, Number(e.target.value))))} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#667eea"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"} />
                      </div>

                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#555" }}>💳 Método de Pago</label>
                        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "2px solid #e0e0e0", fontSize: "0.95em", cursor: "pointer", transition: "all 0.3s" }} onFocus={(e) => e.target.style.borderColor = "#667eea"} onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}>
                          <option>Efectivo</option>
                          <option>Tarjeta Débito</option>
                          <option>Tarjeta Crédito</option>
                          <option>Yape/Plin</option>
                          <option>Transferencia</option>
                        </select>
                      </div>
                    </div>

                    {/* Monto Recibido y Vuelto (solo para efectivo) */}
                    {metodoPago === "Efectivo" && (
                      <div style={{ marginBottom: "15px", padding: "16px", background: "rgba(76,175,80,0.05)", borderRadius: "12px", border: "2px solid rgba(76,175,80,0.2)" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9em", color: "#4CAF50" }}>💵 Monto Recibido</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={montoRecibido} 
                          onChange={(e) => setMontoRecibido(e.target.value)}
                          placeholder="0.00"
                          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #4CAF50", fontSize: "1.1em", fontWeight: "bold" }}
                        />
                        {montoRecibido > 0 && (
                          <div style={{ marginTop: "12px", padding: "12px", background: "#fff", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: "600", color: "#555" }}>💰 Vuelto:</span>
                            <span style={{ fontSize: "1.3em", fontWeight: "bold", color: calcularVuelto() >= 0 ? "#4CAF50" : "#ff6b6b" }}>
                              S/. {calcularVuelto().toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resumen de Totales */}
                    <div style={{ fontSize: "1em", marginBottom: "20px", padding: "16px", background: "rgba(102,126,234,0.05)", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#666" }}>
                        <span>Subtotal:</span>
                        <span style={{ fontWeight: "600" }}>S/. {calcularSubtotal().toFixed(2)}</span>
                      </div>
                      {descuento > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#ff6b6b" }}>
                          <span>Descuento ({descuento}%):</span>
                          <span style={{ fontWeight: "600" }}>− S/. {(calcularSubtotal() * descuento / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.4em", borderTop: "2px solid rgba(102,126,234,0.3)", paddingTop: "12px", marginTop: "8px" }}>
                        <span style={{ color: "#667eea" }}>Total:</span>
                        <span style={{ color: "#667eea" }}>S/. {calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button onClick={procesarVenta} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1em", boxShadow: "0 6px 20px rgba(76,175,80,0.4)", transition: "all 0.3s" }} onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.target.style.transform = "translateY(0)"}>
                      ✓ Procesar Venta
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal de Ticket */}
        {mostrarTicket && ticketActual && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setMostrarTicket(false)}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: "center", borderBottom: "2px dashed #ccc", paddingBottom: "20px", marginBottom: "20px" }}>
                <h2 style={{ margin: "0 0 10px 0", color: "#667eea" }}>🧾 TICKET DE VENTA</h2>
                <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#666" }}>Urban Trend - Fashion Store</p>
                <p style={{ margin: "5px 0", fontSize: "0.85em", color: "#999" }}>Ticket: {ticketActual.numeroTicket}</p>
                <p style={{ margin: "5px 0", fontSize: "0.85em", color: "#999" }}>{ticketActual.fecha}</p>
              </div>

              {ticketActual.cliente && (
                <div style={{ marginBottom: "15px", padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>
                  <p style={{ margin: "5px 0", fontSize: "0.9em" }}><strong>Cliente:</strong> {ticketActual.cliente}</p>
                  {ticketActual.documento && <p style={{ margin: "5px 0", fontSize: "0.9em" }}><strong>Documento:</strong> {ticketActual.documento}</p>}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "1em", color: "#333" }}>Productos:</h4>
                {ticketActual.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.9em", fontWeight: "600" }}>{item.nombre}</div>
                      <div style={{ fontSize: "0.8em", color: "#666" }}>{item.cantidad} x S/. {item.precio.toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "0.95em" }}>S/. {(item.cantidad * item.precio).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "2px dashed #ccc", paddingTop: "15px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9em" }}>
                  <span>Subtotal:</span>
                  <span>S/. {ticketActual.subtotal.toFixed(2)}</span>
                </div>
                {ticketActual.descuento > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9em", color: "#ff6b6b" }}>
                    <span>Descuento ({ticketActual.descuento}%):</span>
                    <span>− S/. {(ticketActual.subtotal * ticketActual.descuento / 100).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.2em", marginTop: "10px", color: "#667eea" }}>
                  <span>TOTAL:</span>
                  <span>S/. {ticketActual.total.toFixed(2)}</span>
                </div>
                
                {ticketActual.metodoPago === "Efectivo" && ticketActual.montoRecibido && (
                  <div style={{ marginTop: "15px", padding: "10px", background: "#f0f9ff", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em", marginBottom: "5px" }}>
                      <span>Efectivo recibido:</span>
                      <span>S/. {ticketActual.montoRecibido.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#4CAF50" }}>
                      <span>Vuelto:</span>
                      <span>S/. {ticketActual.vuelto.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <p style={{ textAlign: "center", margin: "15px 0 5px 0", fontSize: "0.85em", color: "#666" }}>
                  <strong>Método de pago:</strong> {ticketActual.metodoPago}
                </p>
              </div>

              <div style={{ textAlign: "center", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                <p style={{ margin: "5px 0", fontSize: "0.8em", color: "#999" }}>¡Gracias por su compra!</p>
                <button onClick={() => setMostrarTicket(false)} style={{ marginTop: "15px", padding: "12px 30px", background: "#667eea", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "1em" }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
              📋 Historial de Ventas
              {ventas.length > 0 && <span style={{ fontSize: "0.75em", background: "#4CAF50", color: "#fff", padding: "4px 12px", borderRadius: "20px" }}>{ventas.length} ventas</span>}
            </h3>
            {ventas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                <div style={{ fontSize: "3em", marginBottom: "10px" }}>📋</div>
                <p>No hay ventas registradas</p>
                <p style={{ fontSize: "0.9em" }}>Las ventas aparecerán aquí</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {ventas.map(venta => (
                  <div key={venta.id} style={{ padding: "20px", border: "2px solid #f0f0f0", borderRadius: "12px", background: "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateX(5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateX(0)"}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: "1.1em", color: "#667eea" }}>🧾 {venta.numeroTicket || `Venta #${venta.id}`}</strong>
                        <div style={{ fontSize: "0.85em", color: "#999", marginTop: "4px" }}>{venta.fecha}</div>
                        {venta.cliente && <div style={{ fontSize: "0.9em", color: "#555", marginTop: "4px" }}>👤 {venta.cliente}</div>}
                      </div>
                      <span style={{ fontSize: "1.5em", fontWeight: "bold", color: "#4CAF50" }}>S/. {venta.total.toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: "0.9em", color: "#666", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                      <div style={{ marginBottom: "6px", display: "flex", gap: "20px" }}>
                        <span>💳 <strong>Método:</strong> {venta.metodoPago}</span>
                        {venta.descuento > 0 && <span style={{ color: "#ff6b6b" }}>🎫 <strong>Descuento:</strong> {venta.descuento}%</span>}
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <strong>Productos:</strong> {venta.items.map(i => `${i.nombre} (x${i.cantidad})`).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "productos" && (
          <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
              🔍 Consultar Productos
            </h3>
            
            {/* Buscador */}
            <div style={{ marginBottom: "20px" }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar por nombre o código..." 
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff" }}>
                    <th style={{ padding: "14px", textAlign: "left", borderRadius: "10px 0 0 0" }}>Código</th>
                    <th style={{ padding: "14px", textAlign: "left" }}>Producto</th>
                    <th style={{ padding: "14px", textAlign: "left" }}>Categoría</th>
                    <th style={{ padding: "14px", textAlign: "center" }}>Stock</th>
                    <th style={{ padding: "14px", textAlign: "right", borderRadius: "0 10px 0 0" }}>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                        No se encontraron productos
                      </td>
                    </tr>
                  ) : (
                    productosFiltrados.map(prod => (
                      <tr key={prod.id} style={{ background: "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(102,126,234,0.05)"} onMouseOut={(e) => e.currentTarget.style.background = "#fff"}>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", color: "#999", fontSize: "0.9em" }}>{prod.codigo}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontWeight: "600" }}>{prod.nombre}</td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0" }}>
                          <span style={{ padding: "4px 10px", background: "rgba(102,126,234,0.1)", color: "#667eea", borderRadius: "6px", fontSize: "0.85em" }}>
                            {prod.categoria}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                          <span style={{ padding: "4px 12px", background: prod.stock < 10 ? "rgba(255,107,107,0.1)" : "rgba(76,175,80,0.1)", color: prod.stock < 10 ? "#ff6b6b" : "#4CAF50", borderRadius: "6px", fontSize: "0.9em", fontWeight: "600" }}>
                            {prod.stock < 10 ? "⚠️" : "✓"} {prod.stock}
                          </span>
                        </td>
                        <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: "bold", color: "#667eea", fontSize: "1.05em" }}>
                          S/. {prod.precio.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "20px", padding: "15px", background: "rgba(102,126,234,0.05)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                📊 Total de productos: <strong>{productosFiltrados.length}</strong>
              </span>
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                ⚠️ Productos con stock bajo: <strong style={{ color: "#ff6b6b" }}>{productosFiltrados.filter(p => p.stock < 10).length}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
