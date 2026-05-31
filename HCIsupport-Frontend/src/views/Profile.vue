<template>
  <div class="min-h-screen md:pl-64 pt-6">
    <Sidebar />

    <div class="max-w-2xl mx-auto px-6 pb-20">
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center p-20 text-slate-400">
        <div class="kid-card px-8 py-6 flex items-center gap-4">
          <i class="fas fa-spinner fa-spin text-3xl text-sky-500"></i>
          <div>
            <p class="font-extrabold text-slate-700 text-lg">Đang tải thông tin…</p>
            <p class="text-sm text-slate-500 font-bold">Chờ xíu nha!</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="kid-card p-8 flex flex-col md:flex-row items-center gap-8 mb-8 animate-fade-in">
          <div class="relative group cursor-pointer">
            <img :src="store.userInfo.avatar || 'https://ui-avatars.com/api/?name=' + store.userInfo.childName + '&background=random'"
              class="w-32 h-32 rounded-full object-cover border-4 border-sky-100 shadow-md transition-transform group-hover:scale-105" 
              alt="Avatar">
            
            <button
              class="absolute bottom-0 right-0 bg-sky-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-sky-600 transition">
              <i class="fas fa-camera"></i>
            </button>
          </div>

          <div class="text-center md:text-left flex-1 space-y-2">
            <h2 class="text-3xl font-bold text-slate-800">{{ store.userInfo.childName }}</h2>
            
            <p class="text-slate-500 flex items-center justify-center md:justify-start gap-2 text-lg">
              <i class="fas fa-user-shield text-blue-500"></i> 
              <span class="font-medium">Phụ huynh:</span> {{ store.userInfo.parentName || 'Chưa cập nhật' }}
            </p>
            
            <p class="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <i class="fas fa-envelope"></i> {{ store.userInfo.email }}
            </p>

            <div class="flex gap-4 justify-center md:justify-start mt-6">
              <div class="kid-card bg-amber-50/70 px-5 py-2 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-none">
                <i class="fas fa-star text-xl text-yellow-400"></i> 
                <span class="text-lg">{{ store.stars }}</span> Sao
              </div>
              <div class="kid-card bg-orange-50/70 px-5 py-2 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-none">
                <i class="fas fa-fire text-xl text-orange-500"></i> 
                <span class="text-lg">{{ store.currentStreak }}</span> Ngày
              </div>
            </div>
          </div>
        </div>

        <div class="kid-card p-8 mb-8 animate-fade-in" style="animation-delay: 100ms">
          <h3 class="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
              <i class="fas fa-cog text-sky-500"></i> Cài đặt ứng dụng
          </h3>

          <div class="space-y-6">
            <div class="flex items-center justify-between group cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center text-lg group-hover:bg-sky-100 transition">
                  <i class="fas fa-volume-up"></i>
                </div>
                <span class="font-extrabold text-slate-700">Âm thanh nền</span>
              </div>
              <div class="w-12 h-6 bg-emerald-400 rounded-full relative shadow-inner">
                <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm transition-all"></div>
              </div>
            </div>

            <div class="flex items-center justify-between group cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-violet-50 text-violet-500 rounded-full flex items-center justify-center text-lg group-hover:bg-violet-100 transition">
                  <i class="fas fa-bell"></i>
                </div>
                <span class="font-extrabold text-slate-700">Nhắc nhở học tập</span>
              </div>
              <div class="w-12 h-6 bg-emerald-400 rounded-full relative shadow-inner">
                <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm transition-all"></div>
              </div>
            </div>
          </div>
        </div>

        <button @click="handleLogout" class="w-full kid-btn kid-btn-secondary text-slate-700 flex items-center justify-center gap-2">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';
import { useRouter } from 'vue-router';
import axios from 'axios';

const store = useProgressStore();
const router = useRouter();
const isLoading = ref(true);
const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

// Hàm gọi API Backend
const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Logic cũ (giữ lại để dễ quay về):
    // router.push('/login');
    // return;

    if (!BYPASS_AUTH) { router.push('/login'); return; }

    // Mock data để test UI khi chưa chạy backend / chưa đăng nhập
    store.userInfo = {
      parentName: 'Phụ Huynh (Dev)',
      childName: 'Bé Bi (Dev)',
      email: 'dev@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Dev&background=random'
    };
    store.stars = 12;
    store.currentStreak = 3;
    isLoading.value = false;
    return;
  }

  try {
    // Gọi đúng route đã định nghĩa ở Backend
    const res = await axios.get('http://localhost:3000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // API trả về: { userInfo: {...}, stars: 10, currentStreak: 5 }
    // Cập nhật vào Pinia Store để đồng bộ toàn app
    store.userInfo = res.data.userInfo;
    store.stars = res.data.stars;
    store.currentStreak = res.data.currentStreak;

  } catch (err) {
    console.error("Lỗi tải profile:", err);
    
    // Xử lý token hết hạn
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
       store.logout(); // Hàm logout trong store đã có redirect
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUserProfile();
});

const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    store.logout();
    // store.logout() trong code cũ của bạn đã có window.location.href = '/login'
    // nên không cần router.push ở đây nữa, hoặc giữ lại cũng không sao.
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>