<template>
  <div class="bg-white rounded-xl shadow-xl p-6 relative max-w-md">
    <!-- Back Button -->
    <button @click="$emit('back')"
      class="absolute top-3 left-3 p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
      title="Quay lại đăng nhập">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Close Button -->
    <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-400 hover:text-black text-xl"
      aria-label="Close">
      &times;
    </button>

    <!-- Header -->
    <div class="text-center mt-4 mb-6">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-800">Đăng nhập Superuser</h2>
      <p class="text-sm text-gray-500">Xác thực bằng Passkey</p>
    </div>

    <!-- Status Message -->
    <div v-if="statusMessage" :class="[
        'message p-4 rounded-lg mb-4 text-sm',
        statusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : '',
        statusType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : '',
        statusType === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''
      ]">
      {{ statusMessage }}
    </div>

    <!-- Success State -->
    <div v-if="isLoggedIn" class="text-center">
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
        <div class="text-green-600 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-green-800 mb-2">Đăng nhập thành công!</h3>
        <p class="text-sm text-green-700 mb-3">Bạn đã được xác thực với quyền Superuser</p>
        <div class="text-xs text-green-600 space-y-1">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Tên:</strong> {{ user.fullName }}</p>
          <p><strong>Thời gian xác thực:</strong> {{ user.authTime }}</p>
        </div>
      </div>
    </div>

    <!-- Authentication Options -->
    <div v-else class="space-y-4">
      <!-- No Stored Credentials -->
      <!-- <div v-if="!hasStoredCredentials" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="text-yellow-600 mb-2 text-center">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-yellow-800 mb-2 text-center">Không tìm thấy Passkey</h3>
        <p class="text-xs text-yellow-700 text-center">
          Không có passkey nào được đăng ký cho superuser. Vui lòng liên hệ quản trị viên để được cấp quyền.
        </p>
      </div> -->

      <!-- Authenticate with Passkey -->
      <div v-if="!hasStoredCredentials" class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="text-green-600 mb-2 text-center">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m0-6V9a2 2 0 012-2h0a2 2 0 012 2v2" />
          </svg>
        </div>
        <p class="text-sm text-green-600 text-center mb-3">
          Sẵn sàng xác thực với Passkey
        </p>
        <button @click="authenticateSuperuser" :disabled="isAuthenticating"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
          <span v-if="isAuthenticating">Đang xác thực...</span>
          <span v-else>Xác thực với Passkey</span>
        </button>
      </div>

      <!-- WebAuthn Not Supported -->
      <div v-if="!isWebAuthnSupported" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 text-center">
          WebAuthn không được hỗ trợ trong trình duyệt này
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref,
    onMounted
  } from 'vue'
  import {
    useAuth
  } from '../../composables/useAuth.js'

  const props = defineProps({
    isLoggedIn: Boolean,
    user: Object
  })
  const emit = defineEmits(['back', 'close', 'auth-success'])

  // Reactive state
  const statusMessage = ref('')
  const statusType = ref('info')
  const isAuthenticating = ref(false)
  const isWebAuthnSupported = ref(false)
  const hasStoredCredentials = ref(false)

  // Use auth composable
  const {
    checkSession,
    forceLoginStateUpdate
  } = useAuth()

  // Base64 URL encoding/decoding utilities
  function base64urlEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  function base64urlDecode(str) {
    const padLength = (4 - (str.length % 4)) % 4;
    const padded = str + "=".repeat(padLength);
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  }

  // Update status message
  const updateStatus = (message, type) => {
    statusMessage.value = message
    statusType.value = type
  }

  // Generate authentication challenge
  const generateChallenge = async () => {
    const challengeRes = await fetch('http://localhost:3000/auth/superuser/login-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //     email
      // }),
      credentials: 'include'
    });
    if (!challengeRes.ok) {
      const errorData = await challengeRes.json();
      throw new Error(errorData.error || 'Gặp lỗi khi lấy challenge để xác thực');
    }
    const challengeData = await challengeRes.json();
    return challengeData;
  }

  // Authenticate superuser with passkey
  const authenticateSuperuser = async () => {
    try {
      isAuthenticating.value = true
      updateStatus('Bắt đầu xác thực...', 'info')

      // Get challenge
      const challengeData = await generateChallenge();

      const publicKeyCredentialRequestOptions = {
        ...challengeData,
        challenge: base64urlDecode(challengeData.challenge),
        allowCredentials: challengeData.allowCredentials.map(cred => ({
          ...cred,
          id: base64urlDecode(cred.id)
        }))
      }

      updateStatus('Vui lòng xác thực với passkey của bạn...', 'info');

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (!credential) {
        throw new Error('Authentication was cancelled');
      }

      updateStatus('Đang xác thực mã khóa...', 'info');

      const authData = {
        id: credential.id,
        rawId: base64urlEncode(credential.rawId),
        response: {
          clientDataJSON: base64urlEncode(credential.response.clientDataJSON),
          authenticatorData: base64urlEncode(credential.response.authenticatorData),
          signature: base64urlEncode(credential.response.signature),
          userHandle: credential.response.userHandle ? base64urlEncode(credential.response.userHandle) : null
        },
        type: credential.type
      };

      const verifyResponse = await fetch('http://localhost:3000/auth/superuser/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
        credentials: 'include'
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Gặp lỗi khi xác thực mã khóa.');
      }

      const result = await verifyResponse.json();

      if (result.success) {
        updateStatus('Xác thực thành công! Chào mừng bạn trở lại!', 'success');
        // await forceLoginStateUpdate();
        emit('close');
        emit('auth-success');
      } else {
        throw new Error(result.error || 'Mã khóa không hợp lệ.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      updateStatus(`Xác thực thất bại: ${error.message}`, 'error');
    } finally {
      isAuthenticating.value = false;
    }
  }

  // Check WebAuthn support and credentials on mount
  onMounted(async () => {
    isWebAuthnSupported.value = !!window.PublicKeyCredential;
    if (!isWebAuthnSupported.value) {
      updateStatus('WebAuthn không được hỗ trợ trong trình duyệt này', 'error');
      return;
    }

    // Check login status and credentials
    await checkSession();
    if (!props.isLoggedIn || !hasStoredCredentials.value) {
      updateStatus('Vui lòng đăng nhập bằng passkey của bạn (Face ID, Touch ID)', 'error');
      return;
    }
  });
</script>