<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100/80 via-yellow-100/60 to-sky-100/80 p-4 relative font-quicksand overflow-hidden">
    
    <!-- Vibrant Glowing Color Blobs (Gradient Mesh effect) -->
    <div class="absolute -top-20 -left-20 w-96 h-96 bg-amber-300/40 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
    <div class="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-sky-300/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse delay-500"></div>
    <div class="absolute top-1/4 -right-10 w-72 h-72 bg-pink-300/30 rounded-full blur-[90px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-1/4 -left-10 w-80 h-80 bg-emerald-300/30 rounded-full blur-[100px] pointer-events-none -z-10"></div>

    <!-- Floating Cozy Cartoon Clouds & Colorful Playful Elements -->
    <div class="absolute top-12 left-12 text-6xl opacity-35 select-none pointer-events-none animate-float-1">☁️</div>
    <div class="absolute bottom-16 right-16 text-6xl opacity-35 select-none pointer-events-none animate-float-2">☁️</div>
    
    <div class="absolute top-20 right-20 text-5xl select-none pointer-events-none animate-float-2">🎈</div>
    <div class="absolute bottom-24 left-16 text-5xl select-none pointer-events-none animate-float-1">🦊</div>
    <div class="absolute top-1/3 left-[12%] text-6xl select-none pointer-events-none animate-float-3">🌈</div>
    <div class="absolute bottom-1/3 right-[10%] text-5xl select-none pointer-events-none animate-float-1">🏎️</div>
    <div class="absolute top-10 left-1/3 text-4xl select-none pointer-events-none animate-spin-slow opacity-60">🌸</div>
    <div class="absolute bottom-10 right-1/3 text-4xl select-none pointer-events-none animate-float-2">🍄</div>
    <div class="absolute top-1/4 right-[15%] text-4xl select-none pointer-events-none animate-float-3">🎨</div>
    <div class="absolute bottom-[15%] left-1/3 text-4xl select-none pointer-events-none animate-float-2">🧸</div>

    <!-- Register Card Panel -->
    <div class="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-[3rem] shadow-2xl shadow-emerald-200/50 border-2 border-white/80 overflow-hidden relative transition-all duration-300 hover:shadow-emerald-200">
      
      <!-- Top Rainbow Decor Trim -->
      <div class="h-2.5 w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400"></div>

      <div class="p-8 md:p-10">
        <!-- Brand/Logo Header -->
        <div class="text-center mb-6 flex flex-col items-center">
          <div class="w-22 h-22 bg-gradient-to-tr from-green-50 to-emerald-50 p-2.5 rounded-3xl shadow-md border-2 border-white mb-3 hover:rotate-6 transition duration-300">
            <!-- Custom Hot Air Balloon Logo Integrated -->
            <img src="../assets/logo.png" class="w-full h-full object-cover bg-white rounded-2xl" alt="Trạm Cảm Xúc Logo" />
          </div>
          <h2 class="text-3xl font-black text-slate-800 tracking-wide">Tạo tài khoản mới 🚀</h2>
          <p class="text-slate-500 font-bold text-sm mt-1">Cùng bé bắt đầu chuyến du hành cảm xúc</p>
        </div>

        <!-- Form fields with cozy styling -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <div class="space-y-1">
            <label class="block text-slate-500 font-extrabold text-xs flex items-center gap-1.5">
              <i class="far fa-user text-slate-400"></i> Tên của ba mẹ
            </label>
            <input 
              v-model="parentName" 
              type="text"
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700"
              placeholder="Ví dụ: Nguyễn Văn A">
          </div>

          <div class="space-y-1">
            <label class="block text-slate-500 font-extrabold text-xs flex items-center gap-1.5">
              <i class="fas fa-child text-slate-400"></i> Tên thân mật của bé
            </label>
            <input 
              v-model="childName"
              type="text"
              required
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700"
              placeholder="Ví dụ: Bé Bi, Na, Bo...">
          </div>

          <div class="space-y-1">
            <label class="block text-slate-500 font-extrabold text-xs flex items-center gap-1.5">
              <i class="far fa-envelope text-slate-400"></i> Email đăng nhập
            </label>
            <input 
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700"
              placeholder="ba-me@email.com">
          </div>

          <div class="space-y-1">
            <label class="block text-slate-500 font-extrabold text-xs flex items-center gap-1.5">
              <i class="fas fa-lock text-slate-400"></i> Mật khẩu bảo mật
            </label>
            <input 
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700"
              placeholder="••••••••">
          </div>

          <!-- Error Alert Banner -->
          <div v-if="errorMessage" class="p-3.5 bg-red-50 text-red-500 rounded-2xl text-xs font-black border border-red-100 flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-base"></i> {{ errorMessage }}
          </div>

          <!-- Submit 3D Button -->
          <button type="submit"
            :disabled="isLoading"
            class="w-full bg-rose-450 hover:bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg transition transform active:translate-y-1 text-base mt-2 disabled:opacity-70"
            style="box-shadow: 0 6px 0 #047857, 0 10px 15px rgba(16, 185, 129, 0.15)">
            {{ isLoading ? 'Đang gửi thông tin...' : 'Đăng Ký Miễn Phí' }}
          </button>
        </form>

        <!-- Form Links -->
        <div class="mt-8 text-center text-slate-500 font-bold text-sm space-y-3">
          <p>
            Đã có tài khoản?
            <router-link to="/login" class="text-rose-500 hover:text-emerald-600 hover:underline">Đăng nhập</router-link>
          </p>
          <div class="pt-3 border-t border-slate-100 flex justify-center">
            <router-link to="/" class="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5">
              <i class="fas fa-arrow-left"></i> Quay lại trang chủ
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import confetti from 'canvas-confetti';

const router = useRouter();

const parentName = ref('');
const childName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      username: childName.value,    
      parent_name: parentName.value,
      email: email.value,
      password: password.value
    });

    // Play visual celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    alert('Tạo tài khoản Trạm Cảm Xúc thành công! Bé hãy đăng nhập nhé!');
    router.push('/login');

  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Không thể kết nối đến máy chủ.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.bg-rose-450 {
  background-color: #10b981;
}
.hover\:bg-rose-500:hover {
  background-color: #059669;
}
.text-rose-500 {
  color: #10b981;
}

/* Playful Animations for Floating Surrounding Elements */
@keyframes float1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(15deg) scale(1.1); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-12deg) scale(1.05); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(8deg); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float-1 {
  animation: float1 8s ease-in-out infinite;
}
.animate-float-2 {
  animation: float2 6s ease-in-out infinite;
}
.animate-float-3 {
  animation: float3 7s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spinSlow 15s linear infinite;
}
</style>