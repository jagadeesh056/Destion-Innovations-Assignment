import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchInvoiceById } from "../../services/invoiceService"
import "../../styles/InvoiceDetail.css"

const InvoiceDetail = () => {
  const { id } = useParams()
  const { currentUser } = useContext(AuthContext)
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id)

        if (data.storeName !== currentUser.storeName) {
          setError("You do not have permission to view this invoice")
          return
        }

        setInvoice(data)
      } catch (error) {
        console.error("Error loading invoice:", error)
        setError("Failed to load invoice details")
      } finally {
        setLoading(false)
      }
    }

    loadInvoice()
  }, [id, currentUser])

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.quantity * item.dealPrice, 0)
  }

  const calculateTax = () => {
    return invoice.items.reduce((sum, item) => sum + item.quantity * item.dealPrice * 0.05, 0)
  }

  if (loading) {
    return <div className="loading">Loading invoice details...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/invoices")} className="back-button">
          Back to Invoices
        </button>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="not-found">
        <p>Invoice not found</p>
        <button onClick={() => navigate("/invoices")} className="back-button">
          Back to Invoices
        </button>
      </div>
    )
  }

  return (
    <div className="invoice-detail-container">
      <div className="invoice-detail-header">
        <h1>Invoice #{invoice.id}</h1>
        <div className="invoice-actions">
          <button onClick={() => navigate("/invoices")} className="back-button">
            Back to Invoices
          </button>
          <button className="print-button">
            Print Invoice
          </button>
        </div>
      </div>

      <div className="invoice-paper">
        <div className="invoice-header-section">
          <div className="store-info">
            <h2>{invoice.storeName}</h2>
            <p>{invoice.storeAddress}</p>
            <p>Phone: {invoice.storePhone}</p>
          </div>
          <div className="invoice-info">
            <p>
              <strong>Invoice #:</strong> {invoice.id}
            </p>
            <p>
              <strong>Order ID:</strong> {invoice.orderId}
            </p>
            <p>
              <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="invoice-items-section">
          <h3>Items</h3>
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Regular Price</th>
                <th>Deal Price</th>
                <th>Item Total</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.regularPrice.toFixed(2)}</td>
                  <td>${item.dealPrice.toFixed(2)}</td>
                  <td>${(item.quantity * item.dealPrice).toFixed(2)}</td>
                  <td>${item.tax.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary-section">
          <div className="invoice-totals">
            <div className="total-row">
              <span>Subtotal (without tax):</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (5%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Grand Total (with tax):</span>
              <span>${(calculateSubtotal() + calculateTax()).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail

