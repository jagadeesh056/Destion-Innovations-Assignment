const mockInvoices = [
    {
      id: "1001",
      orderId: "ORD-2023-001",
      date: "2023-03-15",
      storeName: "Store A",
      storeAddress: "123 Main St, City, State 12345",
      storePhone: "(123) 456-7890",
      items: [
        {
          name: "Product 1",
          quantity: 2,
          regularPrice: 19.99,
          dealPrice: 15.99,
          tax: 3.2,
        },
        {
          name: "Product 2",
          quantity: 1,
          regularPrice: 29.99,
          dealPrice: 29.99,
          tax: 3.0,
        },
      ],
      total: 68.18,
    },
    {
      id: "1002",
      orderId: "ORD-2023-002",
      date: "2023-03-18",
      storeName: "Store A",
      storeAddress: "123 Main St, City, State 12345",
      storePhone: "(123) 456-7890",
      items: [
        {
          name: "Product 3",
          quantity: 3,
          regularPrice: 12.99,
          dealPrice: 10.99,
          tax: 3.3,
        },
      ],
      total: 36.27,
    },
    {
      id: "1003",
      orderId: "ORD-2023-003",
      date: "2023-03-20",
      storeName: "Store B",
      storeAddress: "456 Oak Ave, City, State 12345",
      storePhone: "(123) 555-7890",
      items: [
        {
          name: "Product 4",
          quantity: 1,
          regularPrice: 49.99,
          dealPrice: 39.99,
          tax: 4.0,
        },
        {
          name: "Product 5",
          quantity: 2,
          regularPrice: 24.99,
          dealPrice: 19.99,
          tax: 4.0,
        },
      ],
      total: 87.98,
    },
  ]
  
  export const fetchInvoicesByStore = (storeName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredInvoices = mockInvoices.filter((invoice) => invoice.storeName === storeName)
        resolve(filteredInvoices)
      }, 500)
    })
  }
  
  export const fetchInvoiceById = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const invoice = mockInvoices.find((invoice) => invoice.id === id)
        if (invoice) {
          resolve(invoice)
        } else {
          reject(new Error("Invoice not found"))
        }
      }, 500)
    })
  }
  
  export const createInvoice = (invoiceData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInvoice = {
          id: `INV-${Date.now()}`,
          ...invoiceData,
          date: new Date().toISOString().split("T")[0],
        }
        mockInvoices.push(newInvoice)
        resolve(newInvoice)
      }, 500)
    })
  }
  
  