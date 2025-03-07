import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchProductById, createProduct, updateProduct } from "../../services/productService"
import "../../styles/ProductForm.css"

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    storeName: currentUser.storeName,
  })

  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (isEditMode) {
        try {
          const product = await fetchProductById(id)

          // Check if the product belongs to the current store
          if (product.storeName !== currentUser.storeName) {
            setError("You do not have permission to edit this product")
            return
          }

          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            storeName: product.storeName,
          })
        } catch (error) {
          console.error("Error loading product:", error)
          setError("Failed to load product details")
        } finally {
          setLoading(false)
        }
      }
    }

    loadProduct()
  }, [id, isEditMode, currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required")
      return false
    }

    if (!formData.price.trim() || isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      setError("Valid price is required")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        storeName: currentUser.storeName,
      }

      if (isEditMode) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      navigate("/products")
    } catch (error) {
      console.error("Error saving product:", error)
      setError("Failed to save product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading product details...</div>
  }

  if (error && error.includes("permission")) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/products")} className="back-button">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <button onClick={() => navigate("/products")} className="back-button">
          Cancel
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

