import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchProductsByStore, deleteProduct } from "../../services/productService"
import SearchBar from "../common/SearchBar"
import "../../styles/ProductList.css"

const ProductList = () => {
  const { currentUser } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByStore(currentUser.storeName)
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentUser])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchTerm])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleDeleteClick = (productId) => {
    setConfirmDelete(productId)
  }

  const handleConfirmDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      const updatedProducts = products.filter((product) => product.id !== productId)
      setProducts(updatedProducts)
      setFilteredProducts(
        updatedProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setConfirmDelete(null)
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <div className="product-actions-header">
          <Link to="/products/summary" className="view-summary-btn">
            View Cost Summary
          </Link>
          <Link to="/products/new" className="add-product-btn">
            Add New Product
          </Link>
        </div>
      </div>

      <div className="product-filters">
        <SearchBar placeholder="Search products..." onSearch={handleSearch} />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
              <div className="product-actions">
                <Link to={`/products/edit/${product.id}`} className="edit-btn">
                  Edit
                </Link>
                <button className="delete-btn" onClick={() => handleDeleteClick(product.id)}>
                  Delete
                </button>
              </div>

              {confirmDelete === product.id && (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete this product?</p>
                  <div className="confirmation-buttons">
                    <button className="confirm-btn" onClick={() => handleConfirmDelete(product.id)}>
                      Yes, Delete
                    </button>
                    <button className="cancel-btn" onClick={handleCancelDelete}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No products found. {searchTerm ? "Try adjusting your search." : "Add some products to get started."}</p>
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => handleSearch("")}>
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductList

