import { useState } from "react";

function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState({
    name: "",
    size: "",
    color: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onAddProduct(form);
    setForm({ name: "", size: "", color: "", stock: "", image: "" });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">

        <h4 className="text-primary fw-bold">Registrar Producto</h4>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input className="form-control" name="name"
              value={form.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Talla</label>
            <select className="form-select" name="size"
              value={form.size} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option>S</option><option>M</option><option>L</option><option>XL</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Color</label>
            <input className="form-control" name="color"
              value={form.color} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input type="number" className="form-control"
              name="stock" value={form.stock} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">URL de Imagen</label>
            <input className="form-control"
              name="image" placeholder="https://..."
              value={form.image} onChange={handleChange} />
          </div>

          <button className="btn btn-primary w-100">Guardar Producto</button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
