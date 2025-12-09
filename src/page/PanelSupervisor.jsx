import { useState } from "react";

export default function PanelSupervisor({ onBackToCatalog, userRole, products }) {
  const [activeTab, setActiveTab] = useState("reportes");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");

  const [empleados] = useState([
    { id: 1, nombre: "Juan Pérez", rol: "Cajero", turno: "Mañana (8:00 - 14:00)", ventas: 15, desempeño: 92, email: "juan.perez@urbantrend.com", telefono: "987654321", fechaIngreso: "2023-01-15" },
    { id: 2, nombre: "María García", rol: "Almacenero", turno: "Tarde (14:00 - 20:00)", ventas: 0, desempeño: 88, email: "maria.garcia@urbantrend.com", telefono: "987654322", fechaIngreso: "2023-03-20" },
    { id: 3, nombre: "Carlos López", rol: "Cajero", turno: "Tarde (14:00 - 20:00)", ventas: 18, desempeño: 95, email: "carlos.lopez@urbantrend.com", telefono: "987654323", fechaIngreso: "2022-11-10" },
    { id: 4, nombre: "Ana Martínez", rol: "Cajero", turno: "Mañana (8:00 - 14:00)", ventas: 12, desempeño: 85, email: "ana.martinez@urbantrend.com", telefono: "987654324", fechaIngreso: "2024-02-01" },
    { id: 5, nombre: "Luis Ramírez", rol: "Supervisor", turno: "Completo (8:00 - 18:00)", ventas: 0, desempeño: 90, email: "luis.ramirez@urbantrend.com", telefono: "987654325", fechaIngreso: "2022-06-15" },
  ]);

  const [incidencias, setIncidencias] = useState([
    { id: 1, fecha: "2025-12-08", empleado: "Juan Pérez", tipo: "Retraso", descripcion: "15 minutos de retraso", estado: "Revisado" },
    { id: 2, fecha: "2025-12-07", empleado: "María García", tipo: "Reconocimiento", descripcion: "Excelente organización del inventario", estado: "Registrado" },
  ]);

  const [nuevaIncidencia, setNuevaIncidencia] = useState({
    empleado: "",
    tipo: "Retraso",
    descripcion: ""
  });

  const registrarIncidencia = () => {
    if (!nuevaIncidencia.empleado || !nuevaIncidencia.descripcion) {
      alert("Completa todos los campos");
      return;
    }

    setIncidencias([{
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      empleado: nuevaIncidencia.empleado,
      tipo: nuevaIncidencia.tipo,
      descripcion: nuevaIncidencia.descripcion,
      estado: "Registrado"
    }, ...incidencias]);

    setNuevaIncidencia({ empleado: "", tipo: "Retraso", descripcion: "" });
    alert("Incidencia registrada exitosamente");
  };

  const reportesVentas = {
    hoy: 2450.00,
    semana: 12890.00,
    mes: 48320.00,
    objetivoMes: 50000.00,
    transaccionesHoy: 28,
    ticketPromedio: 87.50,
    clientesNuevos: 12,
    tasaConversion: 68.5
  };

  const progresoObjetivo = (reportesVentas.mes / reportesVentas.objetivoMes * 100).toFixed(1);
  const empleadosFiltrados = empleados.filter(e => 
    e.nombre.toLowerCase().includes(busquedaEmpleado.toLowerCase()) ||
    e.rol.toLowerCase().includes(busquedaEmpleado.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
      {/* Header */}
      <header style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", color: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.5em", fontWeight: "700", letterSpacing: "0.5px" }}>👨‍💼 Panel Supervisor</h2>
          <small style={{ opacity: 0.8, fontSize: "0.9em" }}>Usuario: {userRole} | Fecha: {new Date().toLocaleDateString()}</small>
        </div>
        <button onClick={onBackToCatalog} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s" }} onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.3)"} onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}>
          🔙 Volver
        </button>
      </header>

      {/* Tabs */}
      <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "15px 30px", borderBottom: "3px solid #4facfe", display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("reportes")} style={{ padding: "12px 24px", background: activeTab === "reportes" ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(79, 172, 254, 0.1)", color: activeTab === "reportes" ? "#fff" : "#4facfe", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "reportes" ? "0 4px 15px rgba(79,172,254,0.4)" : "none" }}>
          📊 Reportes
        </button>
        <button onClick={() => setActiveTab("empleados")} style={{ padding: "12px 24px", background: activeTab === "empleados" ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(79, 172, 254, 0.1)", color: activeTab === "empleados" ? "#fff" : "#4facfe", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "empleados" ? "0 4px 15px rgba(79,172,254,0.4)" : "none" }}>
          👥 Empleados ({empleados.length})
        </button>
        <button onClick={() => setActiveTab("desempeño")} style={{ padding: "12px 24px", background: activeTab === "desempeño" ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(79, 172, 254, 0.1)", color: activeTab === "desempeño" ? "#fff" : "#4facfe", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "desempeño" ? "0 4px 15px rgba(79,172,254,0.4)" : "none" }}>
          📈 Desempeño
        </button>
        <button onClick={() => setActiveTab("incidencias")} style={{ padding: "12px 24px", background: activeTab === "incidencias" ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(79, 172, 254, 0.1)", color: activeTab === "incidencias" ? "#fff" : "#4facfe", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s", boxShadow: activeTab === "incidencias" ? "0 4px 15px rgba(79,172,254,0.4)" : "none" }}>
          📝 Incidencias ({incidencias.length})
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "30px" }}>
        {activeTab === "reportes" && (
          <div>
            {/* Cards de métricas principales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "25px" }}>
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(76,175,80,0.3)", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ color: "#666", fontSize: "0.9em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5em" }}>💰</span> Ventas Hoy
                </div>
                <div style={{ fontSize: "2.2em", fontWeight: "bold", color: "#4CAF50", marginBottom: "8px" }}>S/. {reportesVentas.hoy.toLocaleString()}</div>
                <div style={{ fontSize: "0.85em", color: "#999" }}>📊 {reportesVentas.transaccionesHoy} transacciones</div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(33,150,243,0.3)", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ color: "#666", fontSize: "0.9em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5em" }}>📈</span> Ventas Semana
                </div>
                <div style={{ fontSize: "2.2em", fontWeight: "bold", color: "#2196F3", marginBottom: "8px" }}>S/. {reportesVentas.semana.toLocaleString()}</div>
                <div style={{ fontSize: "0.85em", color: "#999" }}>🎫 Ticket promedio: S/. {reportesVentas.ticketPromedio}</div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(255,107,107,0.3)", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ color: "#666", fontSize: "0.9em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5em" }}>🏆</span> Ventas Mes
                </div>
                <div style={{ fontSize: "2.2em", fontWeight: "bold", color: "#ff6b6b", marginBottom: "8px" }}>S/. {reportesVentas.mes.toLocaleString()}</div>
                <div style={{ fontSize: "0.85em", color: "#999" }}>👥 {reportesVentas.clientesNuevos} clientes nuevos</div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(156,39,176,0.3)", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ color: "#666", fontSize: "0.9em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.5em" }}>📊</span> Tasa Conversión
                </div>
                <div style={{ fontSize: "2.2em", fontWeight: "bold", color: "#9c27b0", marginBottom: "8px" }}>{reportesVentas.tasaConversion}%</div>
                <div style={{ fontSize: "0.85em", color: "#999" }}>✓ Excelente rendimiento</div>
              </div>
            </div>

            {/* Objetivo mensual */}
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "2px solid rgba(79,172,254,0.3)" }}>
              <h4 style={{ margin: "0 0 20px 0", fontSize: "1.2em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                🎯 Objetivo Mensual de Ventas
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "1.05em" }}>
                <div>
                  <span style={{ color: "#666" }}>Progreso: </span>
                  <span style={{ fontWeight: "bold", fontSize: "1.3em", color: progresoObjetivo >= 100 ? "#4CAF50" : progresoObjetivo >= 80 ? "#4facfe" : "#ff6b6b" }}>
                    {progresoObjetivo}%
                  </span>
                </div>
                <div>
                  <span style={{ color: "#666" }}>Meta: </span>
                  <span style={{ fontWeight: "bold", fontSize: "1.3em", color: "#4facfe" }}>
                    S/. {reportesVentas.objetivoMes.toLocaleString()}
                  </span>
                </div>
              </div>
              <div style={{ width: "100%", height: "40px", background: "rgba(79,172,254,0.1)", borderRadius: "20px", overflow: "hidden", border: "2px solid rgba(79,172,254,0.3)", position: "relative" }}>
                <div style={{ width: `${Math.min(100, progresoObjetivo)}%`, height: "100%", background: progresoObjetivo >= 100 ? "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)" : "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)", transition: "width 0.5s ease", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "1em" }}>
                  {progresoObjetivo >= 10 && `${progresoObjetivo}%`}
                </div>
              </div>
              <div style={{ marginTop: "20px", padding: "15px", background: progresoObjetivo >= 100 ? "rgba(76,175,80,0.1)" : "rgba(79,172,254,0.1)", borderRadius: "10px", border: progresoObjetivo >= 100 ? "2px solid rgba(76,175,80,0.3)" : "2px solid rgba(79,172,254,0.3)" }}>
                {progresoObjetivo >= 100 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "2em" }}>🎉</span>
                    <div>
                      <div style={{ fontWeight: "bold", color: "#4CAF50", fontSize: "1.1em" }}>¡Objetivo Cumplido!</div>
                      <div style={{ color: "#666", fontSize: "0.9em" }}>Has superado la meta mensual</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#666", fontSize: "0.95em" }}>
                    <strong style={{ color: "#4facfe" }}>Faltan S/. {Math.max(0, reportesVentas.objetivoMes - reportesVentas.mes).toLocaleString()}</strong> para alcanzar el objetivo
                    <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
                      📊 Proyección: {progresoObjetivo >= 80 ? "✓ En buen camino" : "⚠️ Esfuerzo adicional requerido"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "empleados" && (
          <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "25px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3em", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
              👥 Personal Activo
              <span style={{ fontSize: "0.75em", background: "#4facfe", color: "#fff", padding: "4px 12px", borderRadius: "20px" }}>{empleados.length}</span>
            </h3>

            {/* Buscador */}
            <div style={{ marginBottom: "20px" }}>
              <input 
                type="text" 
                placeholder="🔍 Buscar empleado por nombre o rol..." 
                value={busquedaEmpleado}
                onChange={(e) => setBusquedaEmpleado(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e0e0e0", fontSize: "0.95em", transition: "all 0.3s" }}
                onFocus={(e) => e.target.style.borderColor = "#4facfe"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "#fff" }}>
                  <th style={{ padding: "14px", textAlign: "left", borderRadius: "10px 0 0 0" }}>Empleado</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>Rol</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>Turno</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>Contacto</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Ventas</th>
                  <th style={{ padding: "14px", textAlign: "center", borderRadius: "0 10px 0 0" }}>Desempeño</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                      No se encontraron empleados
                    </td>
                  </tr>
                ) : (
                  empleadosFiltrados.map(emp => (
                    <tr key={emp.id} style={{ background: "#fff", transition: "all 0.3s" }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(79,172,254,0.05)"} onMouseOut={(e) => e.currentTarget.style.background = "#fff"}>
                      <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ fontWeight: "600", fontSize: "1em", marginBottom: "4px" }}>{emp.nombre}</div>
                        <div style={{ fontSize: "0.8em", color: "#999" }}>📅 Ingreso: {emp.fechaIngreso}</div>
                      </td>
                      <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0" }}>
                        <span style={{ padding: "6px 12px", background: "rgba(79,172,254,0.1)", color: "#4facfe", borderRadius: "8px", fontSize: "0.85em", fontWeight: "600" }}>
                          {emp.rol}
                        </span>
                      </td>
                      <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.9em", color: "#666" }}>
                        🕐 {emp.turno}
                      </td>
                      <td style={{ padding: "14px", borderBottom: "1px solid #f0f0f0", fontSize: "0.85em", color: "#666" }}>
                        <div>📧 {emp.email}</div>
                        <div style={{ marginTop: "4px" }}>📱 {emp.telefono}</div>
                      </td>
                      <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0", fontWeight: "bold", fontSize: "1.2em", color: "#4facfe" }}>
                        {emp.ventas > 0 ? emp.ventas : "—"}
                      </td>
                      <td style={{ padding: "14px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                          <span style={{ padding: "8px 16px", background: emp.desempeño >= 90 ? "rgba(76,175,80,0.15)" : emp.desempeño >= 80 ? "rgba(255,193,7,0.15)" : "rgba(255,107,107,0.15)", color: emp.desempeño >= 90 ? "#4CAF50" : emp.desempeño >= 80 ? "#ffc107" : "#ff6b6b", borderRadius: "10px", fontSize: "1em", fontWeight: "bold", border: emp.desempeño >= 90 ? "2px solid rgba(76,175,80,0.3)" : emp.desempeño >= 80 ? "2px solid rgba(255,193,7,0.3)" : "2px solid rgba(255,107,107,0.3)" }}>
                            {emp.desempeño}%
                          </span>
                          <span style={{ fontSize: "0.75em", color: emp.desempeño >= 90 ? "#4CAF50" : emp.desempeño >= 80 ? "#ffc107" : "#ff6b6b", fontWeight: "600" }}>
                            {emp.desempeño >= 90 ? "Excelente" : emp.desempeño >= 80 ? "Bueno" : "Regular"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {activeTab === "desempeño" && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
            <h3>Análisis de Desempeño</h3>
            <div style={{ marginTop: "30px" }}>
              {empleados.map(emp => (
                <div key={emp.id} style={{ marginBottom: "25px", padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{emp.nombre}</div>
                      <div style={{ color: "#666", fontSize: "0.9em" }}>{emp.rol} - {emp.turno}</div>
                    </div>
                    <div style={{ fontSize: "1.5em", fontWeight: "bold", color: emp.desempeño >= 90 ? "#4CAF50" : emp.desempeño >= 80 ? "#FFA726" : "#ff6b6b" }}>
                      {emp.desempeño}%
                    </div>
                  </div>
                  <div style={{ width: "100%", height: "20px", background: "#eee", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${emp.desempeño}%`, height: "100%", background: emp.desempeño >= 90 ? "#4CAF50" : emp.desempeño >= 80 ? "#FFA726" : "#ff6b6b" }}></div>
                  </div>
                  <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
                    {emp.rol === "Cajero" && `Ventas realizadas: ${emp.ventas}`}
                    {emp.rol === "Almacenero" && "Gestión de inventario eficiente"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "incidencias" && (
          <div>
            {/* Formulario */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
              <h3>Registrar Incidencia</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Empleado</label>
                  <select value={nuevaIncidencia.empleado} onChange={(e) => setNuevaIncidencia({...nuevaIncidencia, empleado: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option value="">Seleccionar...</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.nombre}>{emp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tipo</label>
                  <select value={nuevaIncidencia.tipo} onChange={(e) => setNuevaIncidencia({...nuevaIncidencia, tipo: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    <option>Retraso</option>
                    <option>Ausencia</option>
                    <option>Reconocimiento</option>
                    <option>Llamado de atención</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Descripción</label>
                <textarea value={nuevaIncidencia.descripcion} onChange={(e) => setNuevaIncidencia({...nuevaIncidencia, descripcion: e.target.value})} rows="3" placeholder="Describe la incidencia..." style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", resize: "vertical" }}></textarea>
              </div>
              <button onClick={registrarIncidencia} style={{ marginTop: "15px", padding: "12px 24px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                Registrar Incidencia
              </button>
            </div>

            {/* Historial */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
              <h3>Historial de Incidencias</h3>
              <div style={{ marginTop: "20px" }}>
                {incidencias.map(inc => (
                  <div key={inc.id} style={{ padding: "15px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>{inc.empleado}</div>
                        <div style={{ color: "#666", fontSize: "0.9em" }}>{inc.fecha}</div>
                      </div>
                      <span style={{ padding: "4px 12px", background: inc.tipo === "Reconocimiento" ? "#e6ffea" : "#fff3cd", color: inc.tipo === "Reconocimiento" ? "#28a745" : "#856404", borderRadius: "12px", fontSize: "0.85em", height: "fit-content" }}>
                        {inc.tipo}
                      </span>
                    </div>
                    <div style={{ color: "#333", marginBottom: "8px" }}>{inc.descripcion}</div>
                    <div style={{ fontSize: "0.85em", color: "#999" }}>Estado: {inc.estado}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
