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

    <!-- Login Card Panel -->
    <div class="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-[3rem] shadow-2xl shadow-emerald-200/50 border-2 border-white/80 overflow-hidden relative transition-all duration-300 hover:shadow-emerald-200">
      
      <!-- Top Rainbow Decor Trim -->
      <div class="h-2.5 w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-400"></div>

      <div class="p-8 md:p-10">
        <!-- Brand/Logo Header -->
        <div class="text-center mb-8 flex flex-col items-center">
          <div class="w-24 h-24 bg-gradient-to-tr from-green-50 to-emerald-50 p-2.5 rounded-3xl shadow-md border-2 border-white mb-4 hover:rotate-6 transition duration-300">
            <!-- Custom Hot Air Balloon Logo Integrated -->
            <img src="../assets/logo.png" class="w-full h-full object-cover bg-white rounded-2xl" alt="Trạm Cảm Xúc Logo" />
          </div>
          <h2 class="text-3xl font-black text-slate-800 tracking-wide">Chào mừng trở lại!</h2>
          <p class="text-slate-500 font-bold text-sm mt-1">Đăng nhập trạm để tiếp tục hành trình của bé</p>
        </div>

        <!-- Form fields with cozy styling -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label class="block text-slate-500 font-extrabold text-sm flex items-center gap-1.5">
              <i class="far fa-envelope text-slate-400"></i> Email của ba mẹ
            </label>
            <input 
              v-model="email" 
              type="email"
              required
              class="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700 placeholder-slate-350"
              placeholder="ba-me@email.com">
          </div>

          <div class="space-y-1.5">
            <label class="block text-slate-500 font-extrabold text-sm flex items-center gap-1.5">
              <i class="fas fa-lock text-slate-400"></i> Mật khẩu bảo mật
            </label>
            <input 
              v-model="password" 
              type="password"
              required
              class="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-emerald-300 focus:outline-none transition font-bold text-slate-700"
              placeholder="••••••••">
          </div>

          <!-- Error Alert Banner -->
          <div v-if="errorMessage" class="p-3.5 bg-red-50 text-red-500 rounded-2xl text-xs font-black border border-red-100 flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-base"></i> {{ errorMessage }}
          </div>

          <!-- Submit 3D Button -->
          <button type="submit"
            class="w-full bg-rose-450 hover:bg-rose-500 text-white font-black py-4.5 rounded-2xl shadow-lg transition transform active:translate-y-1 text-lg"
            style="box-shadow: 0 6px 0 #047857, 0 10px 15px rgba(16, 185, 129, 0.15)">
            Vào Trạm Học Ngay 🚀
          </button>
        </form>

        <!-- Form Links -->
        <div class="mt-8 text-center text-slate-500 font-bold text-sm space-y-3">
          <p>
            Chưa có tài khoản?
            <router-link to="/register" class="text-rose-500 hover:text-emerald-600 hover:underline">Đăng ký tại đây</router-link>
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
const email = ref('');    
const password = ref(''); 
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Fire confetti burst upon successful authorization!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        router.push('/app');
      }, 500);
    }
  } catch (error) {
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message;
    } else {
        errorMessage.value = 'Không thể kết nối đến máy chủ.';
    }
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