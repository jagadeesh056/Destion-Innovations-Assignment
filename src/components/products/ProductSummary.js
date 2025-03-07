import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchProductsByStore } from "../../services/productService"
import "../../styles/ProductSummary.css"

const ProductSummary = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [totalWithoutTax, setTotalWithoutTax] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByStore(currentUser.storeName)
        setProducts(data)

        const subtotal = data.reduce((sum, product) => sum + product.price, 0)
        const tax = subtotal * 0.05

        setTotalWithoutTax(subtotal)
        setTotalTax(tax)
        setGrandTotal(subtotal + tax)
      } catch (error) {
        console.error("Error loading products:", error)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentUser])

  if (loading) {
    return <div className="loading">Loading product summary...</div>
  }

  if (error) {
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
    <div className="product-summary-container">
      <div className="product-summary-header">
        <h1>Product Cost Summary</h1>
        <button onClick={() => navigate("/products")} className="back-button">
          Back to Products
        </button>
      </div>

      <div className="product-summary-content">
        <div className="product-list-section">
          <h2>All Available Products</h2>
          <table className="product-summary-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Tax (5%)</th>
                <th>Price with Tax</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const tax = product.price * 0.05
                const priceWithTax = product.price + tax

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>${tax.toFixed(2)}</td>
                    <td>${priceWithTax.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="cost-summary-section">
          <h2>Total Cost Summary</h2>
          <div className="cost-summary">
            <div className="cost-row">
              <span>Total Cost (without tax):</span>
              <span>${totalWithoutTax.toFixed(2)}</span>
            </div>
            <div className="cost-row">
              <span>Total Tax (5%):</span>
              <span>${totalTax.toFixed(2)}</span>
            </div>
            <div className="cost-row grand-total">
              <span>Grand Total (with tax):</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSummary

