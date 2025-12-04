function ProductCard({ product }) {
  return (
    <div className="card shadow-sm h-100">
      <img
        src={product.imagen || "https://via.placeholder.com/300"}
        className="card-img-top"
        alt={product.name}
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5 className="fw-bold">{product.name}</h5>

        <p className="text-muted mb-2">
          Categoría: <strong>{product.categoria}</strong><br />
          Talla: <strong>{product.size}</strong><br />
          Stock: <strong>{product.stock}</strong>
          Precio: <strong>${product.price.toFixed(2)}</strong>
        </p>

        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary btn-sm">
            Agregar al carrito
          </button>

          <button className="btn btn-outline-danger btn-sm">
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
