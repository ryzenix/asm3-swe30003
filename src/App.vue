<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navigation 
      @open-login="showAuth = true" 
      :isLoggedIn="isLoggedIn" 
      :user="user"
      :isLoading="isLoading"
      @logout="handleLogout"
    />
    <router-view />
    <Footer />
    <AuthOverlay 
      :visible="showAuth" 
      :isLoggedIn="isLoggedIn" 
      :user="user"
      @close="showAuth = false" 
      @auth-success="forceLoginStateUpdate"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Navigation from './components/Header/Navigation.vue'
import Footer from './components/Footer.vue'
import AuthOverlay from './components/AuthOverlay/AuthOverlay.vue'
import { useAuth } from './composables/useAuth.js'

const showAuth = ref(false)
const router = useRouter()

// Use the auth composable
const { isLoggedIn, user, isLoading, logout, forceLoginStateUpdate } = useAuth();



// Handle logout from navigation
const handleLogout = async () => {
  console.log('App: Logout requested')
  await logout()
  console.log('App: Logout completed, hiding auth overlay and navigating to home')
  showAuth.value = false
  // Navigate to home view after logout
  router.push('/')
}
</script>