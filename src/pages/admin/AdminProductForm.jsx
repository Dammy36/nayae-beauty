import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
  getCategories,
  getProductAdmin,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProductImage,
} from "../../lib/adminProducts.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  status: "active",
  categoryId: "",
};

function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    getProductAdmin(id)
      .then((product) => {
        setFormData({
          name: product.name,
          description: product.description ?? "",
          price: product.price != null ? String(product.price) : "",
          stock: String(product.stock),
          status: product.status,
          categoryId: product.category_id ?? "",
        });
        setImages(product.images);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, isEditing]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price.trim() === "" ? null : Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status,
      categoryId: formData.categoryId || null,
    };

    if (!productData.name) {
      setError("Product name is required.");
      return;
    }
    if (!productData.categoryId) {
      setError("Choose a category.");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateProduct(id, productData);
        navigate("/admin/products");
      } else {
        const newId = await createProduct(productData);
        // Move straight into editing the new product so images can be
        // uploaded right away (an image needs a product to belong to).
        navigate(`/admin/products/${newId}/edit`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    setImageError(null);

    try {
      const imageUrl = await uploadProductImage(id, file, images.length);
      setImages((current) => [...current, { id: crypto.randomUUID(), image_url: imageUrl }]);
    } catch (err) {
      setImageError(err.message);
    } finally {
      event.target.value = "";
    }
  }

  async function handleImageDelete(imageId) {
    try {
      await deleteProductImage(imageId);
      setImages((current) => current.filter((image) => image.id !== imageId));
    } catch (err) {
      setImageError(err.message);
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="state-message">Loading product...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="product-category">Category</label>
          <select
            id="product-category"
            value={formData.categoryId}
            onChange={(event) => updateField("categoryId", event.target.value)}
          >
            <option value="">Select a category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            rows={3}
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </div>

        <div className="admin-form__row">
          <div className="form-field">
            <label htmlFor="product-price">Price (CAD)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Leave blank for &quot;Price coming soon&quot;"
              value={formData.price}
              onChange={(event) => updateField("price", event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(event) => updateField("stock", event.target.value)}
            />
          </div>
        </div>

        <div className="form-field form-field--radio-group" role="radiogroup" aria-label="Status">
          <label className="form-field__radio">
            <input
              type="radio"
              name="status"
              checked={formData.status === "active"}
              onChange={() => updateField("status", "active")}
            />
            Active (visible in shop)
          </label>
          <label className="form-field__radio">
            <input
              type="radio"
              name="status"
              checked={formData.status === "inactive"}
              onChange={() => updateField("status", "inactive")}
            />
            Inactive (hidden)
          </label>
        </div>

        {error && <p className="form-field__error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Product"}
        </button>
        <Link to="/admin/products" className="btn btn-ghost admin-form__cancel">
          Cancel
        </Link>
      </form>

      {!isEditing && (
        <p className="admin-image-manager__pending-note">
          Photo upload becomes available after you save this product for the first time.
        </p>
      )}

      {isEditing && (
        <div className="admin-image-manager">
          <h2>Photos</h2>
          <p className="admin-image-manager__hint">JPG, PNG, or WEBP. Max 5MB per photo.</p>

          <div className="admin-image-manager__grid">
            {images.map((image) => (
              <div key={image.id} className="admin-image-manager__item">
                <img src={image.image_url} alt="" />
                <button type="button" className="btn btn-ghost" onClick={() => handleImageDelete(image.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <label className="btn btn-secondary admin-image-manager__upload">
            Upload Photo
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} hidden />
          </label>
          {imageError && <p className="form-field__error">{imageError}</p>}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProductForm;
