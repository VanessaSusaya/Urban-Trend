function ProductCard({ product }) {
  return (
    <div className="card shadow-sm h-100">
      <img
        src={product.imagen || "https://via.placeholder.com/300"}
        className="card-img-top"
        alt={product.nombre}
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5 className="fw-bold">{product.nombre}</h5>

        <p className="text-muted mb-2">
          Categoria: <strong>{product.categoria || "General"}</strong><br />
          Talla: <strong>{product.size || "Única"}</strong><br />
          Color: <strong>{product.color || "Variado"}</strong>
        </p>

        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary btn-sm">Agregar al carrito</button>
          <button className="btn btn-outline-danger btn-sm">❤️</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
