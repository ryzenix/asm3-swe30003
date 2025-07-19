<script setup>
  import {
    ref
  } from 'vue'
  import Navigation from './components/Header/Navigation.vue'
  import Footer from './components/Footer.vue'
  import ProductRow from './components/home/ProductRow.vue'
  import BannerSlider from './components/home/BannerSlider.vue'
  import AuthOverlay from './components/AuthOverlay/AuthOverlay.vue'
  const showAuth = ref(false)
  const featuredBanners = [{
      image: '/img/banners/banner-1.png'
    },
    {
      image: '/img/banners/banner-2.jpg'
    }
  ]
  const hotDeals = [{
      name: 'Listerine Tartar Control',
      price: '187.000',
      image: '/img/product.avif'
    },
    {
      name: 'Probiotics bổ sung',
      price: '323.850',
      image: '/img/product.avif'
    },
    {
      name: 'Tinh chất L’Oreal',
      price: '324.000',
      image: '/img/product.avif'
    },
    {
      name: 'Probiotics bổ sung',
      price: '323.850',
      image: '/img/product.avif'
    },
    {
      name: 'Tinh chất L’Oreal',
      price: '324.000',
      image: '/img/product.avif'
    },
    {
      name: 'Probiotics bổ sung',
      price: '323.850',
      image: '/img/product.avif'
    },
    {
      name: 'Tinh chất L’Oreal',
      price: '324.000',
      image: '/img/product.avif'
    },
    // more products...
  ]
  const urgentMeds = [{
      name: 'Que thử thai nhanh',
      price: '12.000',
      image: '/img/product.avif'
    },
    {
      name: 'Viên Azoltel 400mg',
      price: '4.500',
      image: '/img/product.avif'
    },
    // more products...
  ]
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navigation @open-login="showAuth = true" />
    <main class="flex-grow">
      <div class="container mx-auto px-4 my-6">
        <BannerSlider :banners="featuredBanners" />
      </div>
      <div>
        <ProductRow title="Siêu deal ngập trời" :products="hotDeals" />
        <ProductRow title="Cần thuốc gấp, Pharmacy có ngay" :products="urgentMeds" />
      </div>
    </main>
    <Footer />
    <AuthOverlay :visible="showAuth" @close="showAuth = false" />
  </div>
</template>