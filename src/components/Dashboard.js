import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { fetchInvoicesByStore } from "../services/invoiceService"
import { fetchProductsByStore } from "../services/productService"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext)
  const [recentInvoices, setRecentInvoices] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const invoices = await fetchInvoicesByStore(currentUser.storeName)
        setRecentInvoices(invoices.slice(0, 5))

        const products = await fetchProductsByStore(currentUser.storeName)
        setProductCount(products.length)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser])

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {currentUser.storeName}</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{productCount}</p>
          <Link to="/products" className="stat-link">
            View All Products
          </Link>
        </div>
        <div className="stat-card">
          <h3>Recent Invoices</h3>
          <p className="stat-value">{recentInvoices.length}</p>
          <Link to="/invoices" className="stat-link">
            View All Invoices
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Invoices</h2>
        {recentInvoices.length > 0 ? (
          <div className="recent-invoices">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="invoice-card">
                <div className="invoice-header">
                  <h3>Invoice #{invoice.id}</h3>
                  <span className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div className="invoice-details">
                  <p>Order ID: {invoice.orderId}</p>
                  <p>Total: ${invoice.total.toFixed(2)}</p>
                </div>
                <Link to={`/invoices/${invoice.id}`} className="view-invoice">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent invoices found.</p>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/products/new" className="action-button">
            Add New Product
          </Link>
          <Link to="/invoices" className="action-button">
            Generate Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

