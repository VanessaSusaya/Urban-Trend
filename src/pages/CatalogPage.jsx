import ProductCard from "../components/ProductCard";

function CatalogPage({ products }) {
  return (
    <div>
      <h2 className="fw-bold mb-4 text-center">Catálogo Urban Trend</h2>

      {products.length === 0 ? (
        <p className="text-center text-muted">
          No hay productos aún. Regístrelos en el módulo de inventario.
        </p>
      ) : (
        <div className="row g-4">
          {products.map((p, i) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={i}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
