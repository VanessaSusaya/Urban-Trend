import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import CatalogPage from "./pages/CatalogPage";

function App() {
  const [products, setProducts] = useState([]);

  const addProduct = (p) => setProducts([...products, p]);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand fw-bold">Urban Trend</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Inventario</Link>
            </li>
            <li className="nav-item">
              <Link to="/catalogo" className="nav-link">Catálogo Web</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* RUTAS */}
      <div className="container py-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="row g-4">
                <div className="col-md-4">
                  <ProductForm onAddProduct={addProduct} />
                </div>
                <div className="col-md-8">
                  <ProductList products={products} />
                </div>
              </div>
            }
          />

          <Route
            path="/catalogo"
            element={<CatalogPage products={products} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

