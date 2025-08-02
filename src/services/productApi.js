// services/productApi.js
import { useErrorHandler } from '../composables/useErrorHandler.js'

const API_BASE_URL = 'http://localhost:3000/products'

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

      const url = `${API_BASE_URL}/list?${queryParams.toString()}`
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
      const url = `${API_BASE_URL}/${id}`
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
      const url = `${API_BASE_URL}/create`
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
      const url = `${API_BASE_URL}/update/${id}`
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
    try {
      const url = `${API_BASE_URL}/delete/${id}`
      const response = await makeApiRequest(url, {
        method: 'DELETE'
      })
      
      return response
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    }
  }

  // Upload product image
  const uploadImage = async (productId, file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const url = `${API_BASE_URL}/${productId}/images/upload`
      const response = await makeApiRequest(url, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it
        }
      })
      
      return response
    } catch (error) {
      console.error('Upload image error:', error)
      throw error
    }
  }

  // Delete product image
  const deleteImage = async (productId, imageIndex) => {
    try {
      const url = `${API_BASE_URL}/${productId}/images/${imageIndex}`
      const response = await makeApiRequest(url, {
        method: 'DELETE'
      })
      
      return response
    } catch (error) {
      console.error('Delete image error:', error)
      throw error
    }
  }

  // Set main image
  const setMainImage = async (productId, imageIndex) => {
    try {
      const url = `${API_BASE_URL}/${productId}/images/${imageIndex}/main`
      const response = await makeApiRequest(url, {
        method: 'PUT'
      })
      
      return response
    } catch (error) {
      console.error('Set main image error:', error)
      throw error
    }
  }

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    deleteImage,
    setMainImage
  }
} 