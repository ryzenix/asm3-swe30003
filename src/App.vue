<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navigation @open-login="showAuth = true" />
    <router-view />
    <Footer />
    <AuthOverlay :visible="showAuth" @close="showAuth = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAuth = ref(false)
import Navigation from './components/Header/Navigation.vue'
import Footer from './components/Footer.vue'
import AuthOverlay from './components/AuthOverlay/AuthOverlay.vue'
</script>