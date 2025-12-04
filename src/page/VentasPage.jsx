import { useState, useEffect } from "react";

function VentasPage({ products, setProducts, onLogout }) {
    const [ventas, setVentas] = useState(() => {
        const saved = localStorage.getItem("ventas");
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    // Guardar ventas en localStorage
    useEffect(() => {
        localStorage.setItem("ventas", JSON.stringify(ventas));
    }, [ventas]);


    const registrarVenta = () => {
        if (!selectedProduct) return;

        if (cantidad > selectedProduct.stock) {
            alert("No hay suficiente stock disponible.");
            return;
        }

        // Nueva venta
        const nuevaVenta = {
            id: ventas.length + 1,
            producto: selectedProduct.nombre,
            cantidad,
            total: selectedProduct.precio * cantidad,
            fecha: new Date().toLocaleString(),
        };

        setVentas([...ventas, nuevaVenta]);

        // Actualizar stock del producto
        setProducts(prev =>
            prev.map(p =>
                p.id === selectedProduct.id
                    ? { ...p, stock: p.stock - cantidad }
                    : p
            )
        );

        alert("Venta registrada correctamente");

        setSelectedProduct(null);
        setCantidad(1);
    };


    return (
        <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>

            {/* Header */}
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
                    <div style={{ fontSize: "0.7em", letterSpacing: "2px", color: "#ff6b6b", fontWeight: "bold" }}>
                        URBAN
                    </div>
                    <div style={{ fontSize: "1em", fontWeight: "900", letterSpacing: "1px" }}>
                        TREND
                    </div>
                </div>

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
            </header>


            {/* Título */}
            <h2 className="text-center mt-4 mb-4">Registrar Venta</h2>


            {/* Grid de productos */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "20px",
                }}
            >
                {products.map((p) => (
                    <div className="card shadow-sm" key={p.id}>
                        <img
                            src={p.imagen}
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                        />

                        <div className="card-body">
                            <h5>{p.nombre}</h5>
                            <p className="text-muted mb-2">
                                Precio: <strong>S/{p.precio}</strong><br />
                                Stock: <strong>{p.stock}</strong>
                            </p>

                            {p.stock === 0 ? (
                                <span className="badge bg-danger">Sin stock</span>
                            ) : (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => setSelectedProduct(p)}
                                >
                                    Registrar venta
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {/* Modal simple */}
            {selectedProduct && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "25px",
                            borderRadius: "10px",
                            width: "350px",
                        }}
                    >
                        <h4 className="mb-3">{selectedProduct.nombre}</h4>

                        <label>Cantidad a vender:</label>
                        <input
                            type="number"
                            className="form-control mb-3"
                            value={cantidad}
                            min={1}
                            max={selectedProduct.stock}
                            onChange={(e) => setCantidad(parseInt(e.target.value))}
                        />

                        <div className="d-flex justify-content-between">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={registrarVenta}
                            >
                                Confirmar venta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VentasPage;
