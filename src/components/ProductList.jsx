function ProductList({ products }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="fw-bold text-success mb-3">Inventario de Productos</h4>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((p, index) => (
                  <tr key={index}>
                    <td>{p.name}</td>
                    <td>{p.categoria}</td>
                    <td>{p.size}</td>
                    <td>{p.color}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;

