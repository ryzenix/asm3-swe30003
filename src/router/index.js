import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import StaffManagement from '../views/StaffManagement.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'Product List', component: ProductList },
  { path: '/products/:id', name: 'Product Detail', component: ProductDetail },
  { path: '/staff', name: 'Staff Management', component: StaffManagement },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Redirect any unmatched routes to Home
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router