# API Integration Documentation

## Overview
This document describes the integration of the backend API endpoints with the Vue.js frontend for product management functionality.

## Backend API Endpoints

### Base URL
```
http://localhost:3000/management/products
```

### Available Endpoints

1. **GET /list** - Get products with filtering and pagination
   - Query parameters: `page`, `limit`, `search`, `category`, `status`, `manufacturer`
   - Returns: Paginated list of products with metadata

2. **GET /:id** - Get single product by ID
   - Path parameter: `id` (product ID)
   - Returns: Single product details

3. **POST /create** - Create new product
   - Body: Product data object
   - Returns: Created product details

4. **PUT /update/:id** - Update existing product
   - Path parameter: `id` (product ID)
   - Body: Product data object (partial updates supported)
   - Returns: Updated product details

5. **DELETE /delete/:id** - Delete product
   - Path parameter: `id` (product ID)
   - Returns: Deletion confirmation

## Frontend Integration

### API Service (`src/services/productApi.js`)
Created a centralized API service that handles all product-related API calls using the existing error handling system.

### Updated Components

#### 1. ProductManagement.vue
- **Before**: Used static sample data
- **After**: Integrates with backend API for:
  - Fetching products with pagination and filtering
  - Creating new products
  - Updating existing products
  - Deleting products
  - Toggling product status

**Key Features:**
- Real-time search with debouncing
- Server-side pagination
- Filter by category, status, manufacturer
- Loading and error states
- Optimistic UI updates

#### 2. ProductList.vue
- **Before**: Used static sample data
- **After**: Integrates with backend API for:
  - Fetching active products for customers
  - Server-side filtering and search
  - Client-side price range filtering
  - Sorting functionality

**Key Features:**
- Only shows active products to customers
- Hybrid filtering (server-side + client-side)
- Loading and error states
- Responsive grid layout

#### 3. ProductDetail.vue
- **Before**: Used static sample data
- **After**: Integrates with backend API for:
  - Fetching individual product details by ID
  - Dynamic product information display

**Key Features:**
- Route-based product ID fetching
- Data transformation from API format to component format
- Loading and error states
- Fallback to placeholder images

## Data Flow

### Product Management Flow
1. Component mounts → `fetchProducts()` called
2. API request sent with current filters/pagination
3. Response processed and stored in reactive state
4. UI updates with loading/error states
5. User interactions trigger new API calls

### Product Creation/Update Flow
1. User submits form → `saveProduct()` called
2. API request sent with product data
3. On success → List refreshed, success message shown
4. On error → Error message displayed

### Product Detail Flow
1. Route change → `mounted()` hook triggered
2. Product ID extracted from route params
3. API request sent for specific product
4. Data transformed and displayed

## Error Handling

All API calls use the existing `useErrorHandler` composable for consistent error handling:
- Network errors
- API response errors
- Validation errors
- Timeout handling

## Loading States

Each component includes:
- Loading spinners during API calls
- Error messages with retry buttons
- Graceful fallbacks for missing data

## Benefits of Integration

1. **Real Data**: No more static sample data
2. **Scalability**: Server-side pagination and filtering
3. **Performance**: Efficient data loading and caching
4. **User Experience**: Loading states and error handling
5. **Maintainability**: Centralized API service
6. **Consistency**: Unified error handling across components

## Testing

To test the integration:

1. Start the backend server on `http://localhost:3000`
2. Ensure the database is populated with sample products
3. Navigate to the product pages in the Vue.js app
4. Test CRUD operations in ProductManagement
5. Test filtering and search in ProductList
6. Test individual product viewing in ProductDetail

## Future Enhancements

- Add caching for frequently accessed products
- Implement real-time updates using WebSockets
- Add offline support with service workers
- Implement advanced search with Elasticsearch
- Add product image upload functionality 