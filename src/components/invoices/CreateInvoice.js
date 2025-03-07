import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchProductsByStore } from "../../services/productService"
import { createInvoice } from "../../services/invoiceService"
import "../../styles/CreateInvoice.css"

const CreateInvoice = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [invoiceItems, setInvoiceItems] = useState([])
  const [orderId, setOrderId] = useState("")

  const [subtotal, setSubtotal] = useState(0)
  const [totalTax, setTotalTax] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByStore(currentUser.storeName)
        setProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    setOrderId(`ORD-${Date.now().toString().slice(-6)}`)
  }, [currentUser])

  useEffect(() => {
    calculateTotals()
  }, [invoiceItems])

  const calculateTotals = () => {
    const newSubtotal = invoiceItems.reduce((sum, item) => {
      return sum + item.quantity * item.dealPrice
    }, 0)

    const newTotalTax = invoiceItems.reduce((sum, item) => {
      return sum + item.tax
    }, 0)

    const newGrandTotal = newSubtotal + newTotalTax

    setSubtotal(newSubtotal)
    setTotalTax(newTotalTax)
    setGrandTotal(newGrandTotal)
  }

  const handleAddProduct = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItemIndex = invoiceItems.findIndex((item) => item.productId === productId)

    if (existingItemIndex >= 0) {
      const updatedItems = [...invoiceItems]
      updatedItems[existingItemIndex].quantity += 1

      const taxRate = 0.1
      updatedItems[existingItemIndex].tax =
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].dealPrice * taxRate

      setInvoiceItems(updatedItems)
    } else {
      const taxRate = 0.1
      const tax = product.price * taxRate

      const newItem = {
        productId: product.id,
        name: product.name,
        quantity: 1,
        regularPrice: product.price,
        dealPrice: product.price,
        tax: tax,
      }

      setInvoiceItems([...invoiceItems, newItem])
    }
  }

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return

    const updatedItems = [...invoiceItems]
    updatedItems[index].quantity = newQuantity

    const taxRate = 0.1
    updatedItems[index].tax = newQuantity * updatedItems[index].dealPrice * taxRate

    setInvoiceItems(updatedItems)
  }

  const handleDealPriceChange = (index, newDealPrice) => {
    if (newDealPrice < 0) return

    const updatedItems = [...invoiceItems]
    updatedItems[index].dealPrice = newDealPrice

    const taxRate = 0.1
    updatedItems[index].tax = updatedItems[index].quantity * newDealPrice * taxRate

    setInvoiceItems(updatedItems)
  }

  const handleRemoveItem = (index) => {
    const updatedItems = [...invoiceItems]
    updatedItems.splice(index, 1)
    setInvoiceItems(updatedItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (invoiceItems.length === 0) {
      alert("Please add at least one product to the invoice")
      return
    }

    try {
      const invoiceData = {
        orderId: orderId,
        date: new Date().toISOString().split("T")[0],
        storeName: currentUser.storeName,
        storeAddress: "123 Store Address, City, State 12345",
        storePhone: "(123) 456-7890",
        items: invoiceItems,
        total: grandTotal,
      }

      const newInvoice = await createInvoice(invoiceData)
      navigate(`/invoices/${newInvoice.id}`)
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Failed to create invoice. Please try again.")
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>
  }

  return (
    <div className="create-invoice-container">
      <div className="create-invoice-header">
        <h1>Create New Invoice</h1>
        <button onClick={() => navigate("/invoices")} className="back-button">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-group">
          <label htmlFor="orderId">Order ID</label>
          <input type="text" id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
        </div>

        <div className="product-selection">
          <h3>Add Products</h3>
          <div className="product-dropdown-container">
            <select className="product-dropdown" onChange={(e) => handleAddProduct(e.target.value)} value="">
              <option value="" disabled>
                Select a product to add
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {invoiceItems.length > 0 ? (
          <div className="invoice-items">
            <h3>Invoice Items</h3>
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Regular Price</th>
                  <th>Deal Price</th>
                  <th>Item Total</th>
                  <th>Tax</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, Number.parseInt(e.target.value))}
                        className="quantity-input"
                      />
                    </td>
                    <td>${item.regularPrice.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.dealPrice}
                        onChange={(e) => handleDealPriceChange(index, Number.parseFloat(e.target.value))}
                        className="price-input"
                      />
                    </td>
                    <td>${(item.quantity * item.dealPrice).toFixed(2)}</td>
                    <td>${item.tax.toFixed(2)}</td>
                    <td>
                      <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-items">
            <p>No items added to this invoice yet. Select products from the dropdown above.</p>
          </div>
        )}

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal (without tax):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Total Tax:</span>
            <span>${totalTax.toFixed(2)}</span>
          </div>
          <div className="summary-row grand-total">
            <span>Grand Total (with tax):</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="create-button">
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateInvoice

