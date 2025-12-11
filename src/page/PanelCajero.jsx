import { useState } from "react";

export default function PanelCajero({ onBackToCatalog, userRole, products = [], setProducts }) {
  const [activeTab, setActiveTab] = useState("ventas");
  const [carrito, setCarrito] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [ventas, setVentas] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert("Producto sin stock disponible");
      return;
    }
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert("No hay más stock disponible");
        return;
      }
      setCarrito(carrito.map(item => 
        item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item
      ));
    } else {
      setCarrito([...carrito, { 
        id: producto.id,
        nombre: producto.name, 
        precio: producto.price,
        cantidad: 1 
      }]);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      setCarrito(carrito.map(item => 
        item.id === id ? {...item, cantidad: Number(nuevaCantidad)} : item
      ));
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    return subtotal - (subtotal * descuento / 100);
  };

  const calcularVuelto = () => {
    const recibido = parseFloat(montoRecibido) || 0;
    const total = calcularTotal();
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

    // Actualizar stock
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
    
    // Limpiar formulario
    setCarrito([]);
    setDescuento(0);
    setClienteNombre("");
    setClienteDocumento("");
    setMontoRecibido("");
    
    alert(`✅ Venta procesada exitosamente\nTicket: ${nuevaVenta.numeroTicket}\nTotal: S/ ${nuevaVenta.total.toFixed(2)}`);
  };

  const productosFiltrados = products.filter(p => 
    p.name?.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Header */}
      <header style={{ 
        background: "rgba(0,0,0,0.8)", 
        backdropFilter: "blur(10px)", 
        color: "#fff", 
        padding: "15px 30px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)" 
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5em", fontWeight: "700" }}>💰 Panel Cajero</h2>
          <small style={{ opacity: 0.8 }}>Usuario: {userRole} | {new Date().toLocaleDateString()}</small>
        </div>
        <button 
          onClick={onBackToCatalog} 
          style={{ 
            padding: "10px 20px", 
            background: "rgba(255,255,255,0.2)", 
            color: "#fff", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: "8px", 
            cursor: "pointer", 
            fontWeight: "600" 
          }}
        >
          🔙 Volver
        </button>
      </header>

      {/* Tabs */}
      <div style={{ 
        background: "rgba(255,255,255,0.95)", 
        padding: "15px 30px", 
        display: "flex", 
        gap: "10px",
        borderBottom: "3px solid #667eea"
      }}>
        <button 
          onClick={() => setActiveTab("ventas")} 
          style={{ 
            padding: "12px 24px", 
            background: activeTab === "ventas" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(102, 126, 234, 0.1)", 
            color: activeTab === "ventas" ? "#fff" : "#667eea", 
            border: "none", 
            borderRadius: "10px", 
            cursor: "pointer", 
            fontWeight: "600" 
          }}
        >
          💰 Nueva Venta
        </button>
        <button 
          onClick={() => setActiveTab("historial")} 
          style={{ 
            padding: "12px 24px", 
            background: activeTab === "historial" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(102, 126, 234, 0.1)", 
            color: activeTab === "historial" ? "#fff" : "#667eea", 
            border: "none", 
            borderRadius: "10px", 
            cursor: "pointer", 
            fontWeight: "600" 
          }}
        >
          📋 Historial ({ventas.length})
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "30px" }}>
        {activeTab === "ventas" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
            {/* Lista de productos */}
            <div style={{ 
              background: "rgba(255,255,255,0.95)", 
              backdropFilter: "blur(10px)", 
              padding: "20px", 
              borderRadius: "15px", 
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)" 
            }}>
              <h3 style={{ marginTop: 0, color: "#667eea" }}>🛍️ Productos Disponibles</h3>
              
              <input
                type="text"
                placeholder="🔍 Buscar por nombre o código..."
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                  border: "2px solid #667eea",
                  borderRadius: "10px",
                  fontSize: "1em"
                }}
              />

              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {productosFiltrados.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999" }}>No se encontraron productos</p>
                ) : (
                  productosFiltrados.map(prod => (
                    <div 
                      key={prod.id} 
                      style={{ 
                        padding: "15px", 
                        marginBottom: "10px", 
                        background: prod.stock > 0 ? "#fff" : "#f5f5f5",
                        border: "1px solid #e0e0e0", 
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "1.1em", color: "#333" }}>{prod.name}</strong>
                        <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9em" }}>
                          Código: {prod.codigo} | Stock: {prod.stock} unidades
                        </p>
                        <p style={{ margin: 0, fontSize: "1.2em", color: "#667eea", fontWeight: "700" }}>
                          S/ {prod.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => agregarAlCarrito(prod)}
                        disabled={prod.stock <= 0}
                        style={{
                          padding: "10px 20px",
                          background: prod.stock > 0 ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#ccc",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: prod.stock > 0 ? "pointer" : "not-allowed",
                          fontWeight: "600"
                        }}
                      >
                        {prod.stock > 0 ? "+ Agregar" : "Sin Stock"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Carrito y Pago */}
            <div>
              {/* Datos del Cliente */}
              <div style={{ 
                background: "rgba(255,255,255,0.95)", 
                padding: "20px", 
                borderRadius: "15px", 
                marginBottom: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ marginTop: 0, color: "#667eea" }}>👤 Datos del Cliente</h3>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                  }}
                />
                <input
                  type="text"
                  placeholder="DNI / RUC"
                  value={clienteDocumento}
                  onChange={(e) => setClienteDocumento(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                  }}
                />
              </div>

              {/* Carrito */}
              <div style={{ 
                background: "rgba(255,255,255,0.95)", 
                padding: "20px", 
                borderRadius: "15px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ marginTop: 0, color: "#667eea" }}>🛒 Carrito ({carrito.length})</h3>
                
                {carrito.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                    Carrito vacío
                  </p>
                ) : (
                  <>
                    <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px" }}>
                      {carrito.map(item => (
                        <div 
                          key={item.id} 
                          style={{ 
                            padding: "10px", 
                            marginBottom: "10px", 
                            background: "#f9f9f9", 
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <strong>{item.nombre}</strong>
                            <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#666" }}>
                              S/ {item.precio.toFixed(2)} x {item.cantidad}
                            </p>
                            <input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) => cambiarCantidad(item.id, e.target.value)}
                              style={{
                                width: "60px",
                                padding: "5px",
                                border: "1px solid #ddd",
                                borderRadius: "5px"
                              }}
                            />
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <strong style={{ color: "#667eea" }}>
                              S/ {(item.precio * item.cantidad).toFixed(2)}
                            </strong>
                            <br />
                            <button
                              onClick={() => eliminarDelCarrito(item.id)}
                              style={{
                                marginTop: "5px",
                                padding: "5px 10px",
                                background: "#ff6b6b",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "0.8em"
                              }}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totales */}
                    <div style={{ borderTop: "2px solid #ddd", paddingTop: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span>Subtotal:</span>
                        <strong>S/ {calcularSubtotal().toFixed(2)}</strong>
                      </div>
                      
                      <div style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Descuento (%):</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={descuento}
                          onChange={(e) => setDescuento(Number(e.target.value))}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "1.3em", color: "#667eea" }}>
                        <strong>TOTAL:</strong>
                        <strong>S/ {calcularTotal().toFixed(2)}</strong>
                      </div>

                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>Método de Pago:</label>
                        <select
                          value={metodoPago}
                          onChange={(e) => setMetodoPago(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            fontSize: "1em"
                          }}
                        >
                          <option value="Efectivo">💵 Efectivo</option>
                          <option value="Tarjeta">💳 Tarjeta</option>
                          <option value="Yape">📱 Yape</option>
                          <option value="Plin">📱 Plin</option>
                        </select>
                      </div>

                      {metodoPago === "Efectivo" && (
                        <div style={{ marginBottom: "15px" }}>
                          <label style={{ display: "block", marginBottom: "5px" }}>Monto Recibido:</label>
                          <input
                            type="number"
                            step="0.01"
                            value={montoRecibido}
                            onChange={(e) => setMontoRecibido(e.target.value)}
                            placeholder="0.00"
                            style={{
                              width: "100%",
                              padding: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              fontSize: "1em"
                            }}
                          />
                          {montoRecibido && (
                            <p style={{ 
                              marginTop: "5px", 
                              color: calcularVuelto() >= 0 ? "#51cf66" : "#ff6b6b",
                              fontWeight: "600"
                            }}>
                              Vuelto: S/ {calcularVuelto().toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={procesarVenta}
                        style={{
                          width: "100%",
                          padding: "15px",
                          background: "linear-gradient(135deg, #51cf66 0%, #37b24d 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "1.1em",
                          fontWeight: "700",
                          boxShadow: "0 4px 15px rgba(81,207,102,0.4)"
                        }}
                      >
                        ✅ PROCESAR VENTA
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div style={{ 
            background: "rgba(255,255,255,0.95)", 
            padding: "30px", 
            borderRadius: "15px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0, color: "#667eea" }}>📋 Historial de Ventas</h3>
            
            {ventas.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
                No hay ventas registradas
              </p>
            ) : (
              <div>
                {ventas.map(venta => (
                  <div 
                    key={venta.id} 
                    style={{ 
                      padding: "20px", 
                      marginBottom: "15px", 
                      background: "#fff", 
                      border: "2px solid #667eea",
                      borderRadius: "10px" 
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div>
                        <strong style={{ fontSize: "1.2em", color: "#667eea" }}>
                          Ticket: {venta.numeroTicket}
                        </strong>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                          📅 {venta.fecha}
                        </p>
                        <p style={{ margin: "5px 0", color: "#666" }}>
                          👤 {venta.cliente} {venta.documento !== "---" && `(${venta.documento})`}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "5px 0", fontSize: "1.3em", color: "#667eea", fontWeight: "700" }}>
                          S/ {venta.total.toFixed(2)}
                        </p>
                        <span style={{ 
                          display: "inline-block",
                          padding: "5px 10px",
                          background: "#667eea",
                          color: "#fff",
                          borderRadius: "5px",
                          fontSize: "0.9em"
                        }}>
                          {venta.metodoPago}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "10px" }}>
                      <strong>Productos:</strong>
                      {venta.items.map((item, idx) => (
                        <p key={idx} style={{ margin: "5px 0", color: "#666" }}>
                          • {item.nombre} x{item.cantidad} - S/ {(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      ))}
                      {venta.descuento > 0 && (
                        <p style={{ margin: "5px 0", color: "#ff6b6b" }}>
                          Descuento: {venta.descuento}%
                        </p>
                      )}
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
