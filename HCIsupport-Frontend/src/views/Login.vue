<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="kid-card w-full max-w-md overflow-hidden">
      <div class="p-8 md:p-10">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 text-white rounded-full text-3xl font-extrabold mb-4 shadow-md"
            style="background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 60%, #0ea5e9 100%);">
            E</div>
          <h2 class="text-3xl font-bold text-slate-700">Chào mừng trở lại!</h2>
          <p class="text-slate-400 mt-2">Đăng nhập để tiếp tục bài học của bé</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-slate-600 font-bold mb-2">Email phụ huynh</label>
            <!-- 👇 THÊM v-model="email" VÀO ĐÂY 👇 -->
            <input 
              v-model="email" 
              type="email"
              required
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:outline-none transition focus:ring-4 focus:ring-sky-200/70 focus:border-sky-300"
              placeholder="vi-du@gmail.com">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <!-- 👇 THÊM v-model="password" VÀO ĐÂY 👇 -->
            <input 
              v-model="password" 
              type="password"
              required
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:outline-none transition focus:ring-4 focus:ring-sky-200/70 focus:border-sky-300"
              placeholder="••••••••">
          </div>

          <!-- Hiển thị lỗi nếu có -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <button type="submit" class="w-full kid-btn kid-btn-primary text-lg">
            Đăng Nhập
          </button>
        </form>

        <div class="mt-8 text-center text-slate-500">
          Chưa có tài khoản?
          <router-link to="/register" class="text-sky-600 font-extrabold hover:underline">Đăng ký ngay</router-link>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/" class="text-sm text-slate-500 hover:text-slate-700 font-bold">← Về trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');    
const password = ref(''); 
const errorMessage = ref('');

const handleLogin = async () => {
  // Xóa thông báo lỗi cũ trước khi gửi mới
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Đăng nhập thành công!'); // Thông báo nhẹ
      router.push('/app');
    }
  } catch (error) {
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message;
    } else {
        errorMessage.value = 'Không thể kết nối đến Server';
    }
  }
}
</script>