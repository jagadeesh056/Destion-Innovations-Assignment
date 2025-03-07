const mockProducts = [
    {
      id: "1",
      name: "Premium Coffee Beans",
      description: "High-quality Arabica coffee beans from Colombia",
      price: 14.99,
      imageUrl: "/placeholder.svg?height=200&width=200",
      storeName: "Store A",
    },
    {
      id: "2",
      name: "Organic Green Tea",
      description: "Certified organic green tea leaves",
      price: 9.99,
      imageUrl: "/placeholder.svg?height=200&width=200",
      storeName: "Store A",
    },
    {
      id: "3",
      name: "Artisan Chocolate Bar",
      description: "72% dark chocolate made from single-origin cacao",
      price: 6.99,
      imageUrl: "/placeholder.svg?height=200&width=200",
      storeName: "Store B",
    },
    {
      id: "4",
      name: "Handcrafted Soap",
      description: "Natural soap with essential oils",
      price: 5.99,
      imageUrl: "/placeholder.svg?height=200&width=200",
      storeName: "Store B",
    },
    {
      id: "5",
      name: "Organic Honey",
      description: "Raw, unfiltered honey from local beekeepers",
      price: 8.99,
      imageUrl: "/placeholder.svg?height=200&width=200",
      storeName: "Store C",
    },
  ]
  
  export const fetchProductsByStore = (storeName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredProducts = mockProducts.filter((product) => product.storeName === storeName)
        resolve(filteredProducts)
      }, 500)
    })
  }
  
  export const fetchProductById = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find((product) => product.id === id)
        if (product) {
          resolve(product)
        } else {
          reject(new Error("Product not found"))
        }
      }, 500)
    })
  }
  
  export const createProduct = (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = {
          id: `PROD-${Date.now()}`,
          ...productData,
        }
        mockProducts.push(newProduct)
        resolve(newProduct)
      }, 500)
    })
  }
  
  export const updateProduct = (id, productData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex((product) => product.id === id)
        if (index !== -1) {
          mockProducts[index] = {
            ...mockProducts[index],
            ...productData,
            id,
          }
          resolve(mockProducts[index])
        } else {
          reject(new Error("Product not found"))
        }
      }, 500)
    })
  }
  
  export const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex((product) => product.id === id)
        if (index !== -1) {
          const deletedProduct = mockProducts.splice(index, 1)[0]
          resolve(deletedProduct)
        } else {
          reject(new Error("Product not found"))
        }
      }, 500)
    })
  }
  
  