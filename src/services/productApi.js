// services/productApi.js
import { useErrorHandler } from '../composables/useErrorHandler.js'

const API_BASE_URL = 'http://localhost:3000'

export function useProductApi() {
  const { makeApiRequest } = useErrorHandler()

  // Get products list with filters and pagination
  const getProducts = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      
      // Add filter parameters
      if (params.search) queryParams.append('search', params.search)
      if (params.category) queryParams.append('category', params.category)
      if (params.status) queryParams.append('status', params.status)
      if (params.manufacturer) queryParams.append('manufacturer', params.manufacturer)
      
      // Add sort parameters
      if (params.sort) queryParams.append('sort', params.sort)

      const url = `${API_BASE_URL}/products/list?${queryParams.toString()}`
      const response = await makeApiRequest(url)
      
      return response
    } catch (error) {
      console.error('Get products error:', error)
      throw error
    }
  }

  // Get single product by ID
  const getProduct = async (id) => {
    try {
      const url = `${API_BASE_URL}/products/${id}`
      const response = await makeApiRequest(url)
      
      return response
    } catch (error) {
      console.error('Get product error:', error)
      throw error
    }
  }

  // Create new product
  const createProduct = async (productData) => {
    try {
      const url = `${API_BASE_URL}/products/management/create`
      const response = await makeApiRequest(url, {
        method: 'POST',
        body: JSON.stringify(productData)
      })
      
      return response
    } catch (error) {
      console.error('Create product error:', error)
      throw error
    }
  }

  // Update existing product
  const updateProduct = async (id, productData) => {
    try {
      const url = `${API_BASE_URL}/products/management/update/${id}`
      const response = await makeApiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(productData)
      })
      
      return response
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  }

  // Delete product
  const deleteProduct = async (id) => {
    const url = `${API_BASE_URL}/products/management/delete/${id}`
    return await makeApiRequest(url, {
      method: 'DELETE'
    })
  }

  // Upload product image
  const uploadImage = async (productId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const url = `${API_BASE_URL}/products/management/${productId}/images/upload`
    return await makeApiRequest(url, {
      method: 'POST',
      body: formData
    })
  }

  // Delete product image
  const deleteImage = async (productId, imageIndex) => {
    const url = `${API_BASE_URL}/products/management/${productId}/images/${imageIndex}`
    return await makeApiRequest(url, {
      method: 'DELETE'
    })
  }

  // Set main image
  const setMainImage = async (productId, imageIndex) => {
    const url = `${API_BASE_URL}/products/management/${productId}/images/${imageIndex}/main`
    return await makeApiRequest(url, {
      method: 'PUT'
    })
  }

  // Get filter options for products
  const getFilterOptions = async () => {
    const url = `${API_BASE_URL}/products/filter-options`
    return await makeApiRequest(url)
  }

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    deleteImage,
    setMainImage,
    getFilterOptions
  }
} 