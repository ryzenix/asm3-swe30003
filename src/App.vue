<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navigation 
      @open-login="showAuth = true" 
      :isLoggedIn="navIsLoggedIn" 
      :user="navUser"
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
      @auth-success="handleAuthSuccess"
    />
    <CartSidebar />
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navigation from './components/Header/Navigation.vue'
import Footer from './components/Footer.vue'
import AuthOverlay from './components/AuthOverlay/AuthOverlay.vue'
import CartSidebar from './components/Common/CartSidebar.vue'
import ToastContainer from './components/Common/ToastContainer.vue'
import { useAuth } from './composables/useAuth.js'

const showAuth = ref(false)
const router = useRouter()

// Use the auth composable
const { isLoggedIn, user, isLoading, logout, forceLoginStateUpdate } = useAuth()

// Manual reactive triggers for Navigation
const navIsLoggedIn = ref(isLoggedIn.value)
const navUser = ref(user.value)

// Watch for auth state changes to ensure Navigation is updated
watch([isLoggedIn, user], ([newIsLoggedIn, newUser], [oldIsLoggedIn, oldUser]) => {
  console.log('App: Auth state changed', {
    isLoggedIn: { from: oldIsLoggedIn, to: newIsLoggedIn },
    user: { from: oldUser, to: newUser }
  })
  
  // Update manual triggers
  navIsLoggedIn.value = newIsLoggedIn
  navUser.value = newUser
  
  // Force a re-render if needed
  if (newIsLoggedIn !== oldIsLoggedIn) {
    nextTick(() => {
      console.log('App: Navigation should now reflect login state:', newIsLoggedIn)
    })
  }
}, { immediate: true, deep: true })

// Enhanced auth success handler
const handleAuthSuccess = async () => {
  console.log('App: Auth success event received')
  await forceLoginStateUpdate()
  
  // Manually update navigation props
  navIsLoggedIn.value = isLoggedIn.value
  navUser.value = user.value
  
  console.log('App: Navigation props updated', {
    navIsLoggedIn: navIsLoggedIn.value,
    navUser: navUser.value
  })
}

// Listen for global auth state changes from other components
const handleGlobalAuthChange = (event) => {
  console.log('App: Global auth state change received', event.detail)
  
  // Update navigation props immediately
  navIsLoggedIn.value = event.detail.isLoggedIn
  navUser.value = event.detail.user
  
  // Also trigger a force update of the auth composable
  setTimeout(async () => {
    await forceLoginStateUpdate()
    navIsLoggedIn.value = isLoggedIn.value
    navUser.value = user.value
  }, 50)
}

// Add event listener for global auth changes
window.addEventListener('auth-state-changed', handleGlobalAuthChange)

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

