import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'

import OrderDetails from '../views/OrderDetails.vue'
import OrderManagement from '../views/OrderManagement.vue'
import CustomerOrders from '../views/CustomerOrders.vue'
import StaffManagement from '../views/StaffManagement.vue'
import ProductManagement from '../views/ProductManagement.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'Product List', component: ProductList },
  { path: '/products/:id', name: 'Product Detail', component: ProductDetail },
  { path: '/cart', name: 'Cart', component: Cart },

  { path: '/orders/:orderId', name: 'Order Details', component: OrderDetails },
  { path: '/my-orders', name: 'Customer Orders', component: CustomerOrders },
  { path: '/admin/orders', name: 'Order Management', component: OrderManagement },
  { path: '/staff', name: 'Staff Management', component: StaffManagement },
  { path: '/admin/products', name: 'Product Management', component: ProductManagement },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Redirect any unmatched routes to Home
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router