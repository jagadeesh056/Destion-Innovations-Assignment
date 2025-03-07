import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { fetchInvoicesByStore } from "../../services/invoiceService"
import DateRangePicker from "../common/DateRangePicker"
import SearchBar from "../common/SearchBar"
import "../../styles/InvoiceList.css"

const InvoiceList = () => {
  const { currentUser } = useContext(AuthContext)
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoicesByStore(currentUser.storeName)
        setInvoices(data)
        setFilteredInvoices(data)
      } catch (error) {
        console.error("Error loading invoices:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvoices()
  }, [currentUser])

  useEffect(() => {
    let filtered = invoices

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.date)
        return invoiceDate >= dateRange.startDate && invoiceDate <= dateRange.endDate
      })
    }

    if (searchTerm) {
      filtered = filtered.filter((invoice) => {
        if (invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }

        return invoice.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      })
    }

    setFilteredInvoices(filtered)
  }, [invoices, dateRange, searchTerm])

  const handleDateRangeChange = (range) => {
    setDateRange(range)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  if (loading) {
    return <div className="loading">Loading invoices...</div>
  }

  return (
    <div className="invoice-list-container">
      <div className="invoice-list-header">
        <h1>Invoices</h1>
        <Link to="/invoices/new" className="create-invoice-btn">
          Create New Invoice
        </Link>
      </div>

      <div className="invoice-filters">
        <DateRangePicker onChange={handleDateRangeChange} />
        <SearchBar placeholder="Search by Order ID or Item" onSearch={handleSearch} />
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.orderId}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.items.length}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <div className="invoice-actions">
                      <Link to={`/invoices/${invoice.id}`} className="view-btn">
                        View
                      </Link>
                      <button
                        className="print-btn"
                        onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")}
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-invoices">
          <p>No invoices found. {searchTerm || dateRange.startDate ? "Try adjusting your filters." : ""}</p>
        </div>
      )}
    </div>
  )
}

export default InvoiceList

