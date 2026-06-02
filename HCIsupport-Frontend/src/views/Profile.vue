<template>
  <div class="min-h-screen md:pl-64 pt-6 pb-20 custom-theme-bg font-quicksand transition-all duration-300">
    <Sidebar />

    <div class="max-w-3xl mx-auto px-6 pb-12">
      <!-- Header Section -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span class="p-2.5 bg-[var(--theme-primary-light)] rounded-2xl text-[var(--theme-primary-hover)] shadow-sm"><i class="fas fa-user-circle"></i></span>
            Cá nhân hoá hồ sơ
          </h1>
          <p class="text-slate-500 text-sm mt-1">Cài đặt giao diện, chọn hình đại diện và thông tin của bé</p>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center p-20 text-slate-400">
         <i class="fas fa-spinner fa-spin text-4xl text-[var(--theme-primary)] mb-4 animate-pulse"></i>
         <p class="font-bold text-lg">Đang tải thông tin bé yêu...</p>
      </div>

      <div v-else class="space-y-8">
        
        <!-- CARD 1: USER INFO & AVATAR SELECTION -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[var(--theme-shadow-color)] border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--theme-shadow-color)]">
          <div class="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary-light)]/40 rounded-bl-[100px] -z-10"></div>
          
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Left: Avatar Preview -->
            <div class="relative group">
              <div class="w-36 h-36 rounded-full bg-gradient-to-br from-[var(--theme-primary-light)] to-[var(--theme-primary)] p-1 shadow-md transition-transform group-hover:scale-105">
                <img :src="selectedAvatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'"
                  class="w-full h-full rounded-full object-cover bg-white" 
                  alt="Child Avatar">
              </div>
              <div v-if="!isEditing" @click="startEditing"
                class="absolute bottom-0 right-1 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md cursor-pointer transition transform active:scale-95">
                <i class="fas fa-pen text-sm"></i>
              </div>
            </div>

            <!-- Right: Display Details or Edit Form -->
            <div class="flex-1 w-full space-y-4 text-center md:text-left">
              <div v-if="!isEditing" class="space-y-3">
                <h2 class="text-3xl font-extrabold text-slate-800 tracking-wide">{{ store.userInfo.childName }}</h2>
                <div class="space-y-1.5 inline-block text-left md:block">
                  <p class="text-slate-600 font-medium flex items-center gap-2.5 text-base">
                    <span class="w-7 h-7 rounded-lg bg-[var(--theme-primary-light)] text-[var(--theme-primary-hover)] flex items-center justify-center text-xs"><i class="fas fa-heart"></i></span>
                    <span class="font-bold text-slate-400">Phụ huynh:</span> {{ store.userInfo.parentName || 'Chưa cập nhật' }}
                  </p>
                  <p class="text-slate-500 font-medium flex items-center gap-2.5 text-base">
                    <span class="w-7 h-7 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center text-xs"><i class="fas fa-envelope"></i></span>
                    <span class="font-bold text-slate-400">Email:</span> {{ store.userInfo.email }}
                  </p>
                </div>
                
                <div class="flex gap-4 justify-center md:justify-start pt-3">
                  <div class="bg-amber-50 text-amber-600 px-5 py-2.5 rounded-2xl font-bold border border-amber-100 shadow-sm flex items-center gap-2.5 hover:scale-105 transition duration-200">
                    <i class="fas fa-star text-2xl text-yellow-400 animate-spin-slow"></i> 
                    <span class="text-xl font-extrabold">{{ store.stars }}</span> Sao đạt được
                  </div>
                  <div class="bg-orange-50 text-orange-600 px-5 py-2.5 rounded-2xl font-bold border border-orange-100 shadow-sm flex items-center gap-2.5 hover:scale-105 transition duration-200">
                    <i class="fas fa-fire text-2xl text-orange-500 animate-bounce"></i> 
                    <span class="text-xl font-extrabold">{{ store.currentStreak }}</span> Ngày liên tục
                  </div>
                </div>

                <div class="pt-4 flex justify-center md:justify-start">
                  <button @click="startEditing"
                    class="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-lg shadow-[var(--theme-shadow-color)] flex items-center gap-2 transition transform active:scale-95">
                    <i class="fas fa-user-edit"></i> Chỉnh sửa thông tin bé
                  </button>
                </div>
              </div>

              <!-- EDIT MODE FORM -->
              <div v-else class="space-y-4 text-left">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="block text-sm font-extrabold text-slate-500">Tên của bé</label>
                    <input v-model="editChildName" type="text"
                      class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-[var(--theme-primary)] focus:outline-none font-bold text-slate-700 transition"
                      placeholder="Nhập tên bé...">
                  </div>
                  <div class="space-y-1">
                    <label class="block text-sm font-extrabold text-slate-500">Tên ba mẹ</label>
                    <input v-model="editParentName" type="text"
                      class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-[var(--theme-primary)] focus:outline-none font-bold text-slate-700 transition"
                      placeholder="Nhập tên phụ huynh...">
                  </div>
                </div>

                <!-- Avatar Selection Grid -->
                <div class="space-y-2 pt-2">
                  <label class="block text-sm font-extrabold text-slate-500 flex items-center gap-2">
                    <span>Chọn bạn đồng hành của bé:</span>
                    <span class="text-xs text-[var(--theme-primary-hover)] font-bold bg-[var(--theme-primary-light)] px-2 py-0.5 rounded-full">Dễ thương 🐾</span>
                  </label>
                  <div class="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    <div v-for="av in AVATARS" :key="av.name"
                      @click="selectedAvatar = av.url"
                      class="aspect-square rounded-2xl p-1 bg-slate-50 border-2 cursor-pointer transition duration-200 transform hover:scale-110 flex items-center justify-center relative"
                      :class="selectedAvatar === av.url ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-light)] shadow-md shadow-[var(--theme-shadow-color)]' : 'border-slate-100 hover:border-slate-200'">
                      <img :src="av.url" class="w-full h-full rounded-xl object-contain bg-white" :alt="av.name" />
                      <div v-if="selectedAvatar === av.url" class="absolute -top-1.5 -right-1.5 bg-[var(--theme-primary)] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-white shadow">
                        <i class="fas fa-check"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Controls -->
                <div class="flex gap-3 pt-3">
                  <button @click="saveProfile" :disabled="isSaving"
                    class="bg-emerald-400 hover:bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-2xl flex-1 shadow-lg shadow-emerald-100 transition transform active:scale-95 disabled:opacity-50">
                    <i class="fas fa-check-circle mr-1.5"></i> {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                  </button>
                  <button @click="isEditing = false"
                    class="bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold px-6 py-3 rounded-2xl transition transform active:scale-95">
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2: GIAO DIỆN & MÀU SẮC (THEMES SWITCHER) -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[var(--theme-shadow-color)] border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--theme-shadow-color)]">
          <h3 class="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3.5">
            <span class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shadow-sm"><i class="fas fa-palette"></i></span>
            Giao diện sinh động của bé
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="t in THEMES" :key="t.id"
              @click="selectTheme(t.id)"
              class="rounded-3xl p-5 border-3 text-center cursor-pointer transition duration-300 transform hover:scale-103 flex flex-col items-center justify-center space-y-3 relative group"
              :class="store.theme === t.id ? t.activeClass + ' shadow-lg' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'">
              
              <!-- Color Indicator Disk -->
              <div class="w-14 h-14 rounded-full shadow-inner bg-gradient-to-tr flex items-center justify-center text-3xl group-hover:rotate-12 transition duration-300"
                :class="t.fromColor">
              </div>

              <div>
                <h4 class="font-extrabold text-sm text-slate-700">{{ t.name }}</h4>
                <p class="text-xs text-slate-400 font-medium mt-1">{{ t.description }}</p>
              </div>

              <!-- Active Badge -->
              <div v-if="store.theme === t.id" class="absolute top-2 right-3 text-xs bg-white/80 backdrop-blur px-2.5 py-0.5 rounded-full font-bold border border-current shadow-sm">
                Đang dùng
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 3: APP SETTINGS (SOUND, TIMEOUTS) -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[var(--theme-shadow-color)] border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--theme-shadow-color)]">
          <h3 class="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3.5">
            <span class="w-10 h-10 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center shadow-sm"><i class="fas fa-magic"></i></span>
            Cài đặt trò chơi & Âm thanh
          </h3>

          <div class="space-y-6">
            <!-- Audio Switch -->
            <div class="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition duration-200 group cursor-pointer"
              @click="bgMusicActive = !bgMusicActive">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition">
                  <i class="fas" :class="bgMusicActive ? 'fa-volume-up' : 'fa-volume-mute'"></i>
                </div>
                <div>
                  <span class="font-extrabold text-slate-700 text-base">Nhạc nền & Hiệu ứng</span>
                  <p class="text-slate-400 text-xs font-medium mt-0.5">Bật nhạc nền vui nhộn khi chơi game</p>
                </div>
              </div>
              
              <!-- Custom Toggle -->
              <div class="w-14 h-8 rounded-full p-1 transition-all duration-200 cursor-pointer"
                :class="bgMusicActive ? 'bg-emerald-400' : 'bg-slate-200'">
                <div class="w-6 h-6 bg-white rounded-full shadow-md transform transition duration-200"
                  :class="bgMusicActive ? 'translate-x-6' : 'translate-x-0'">
                </div>
              </div>
            </div>

            <!-- Reminder Switch -->
            <div class="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition duration-200 group cursor-pointer"
              @click="studyReminder = !studyReminder">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition">
                  <i class="fas fa-bell"></i>
                </div>
                <div>
                  <span class="font-extrabold text-slate-700 text-base">Nhắc nhở học tập hàng ngày</span>
                  <p class="text-slate-400 text-xs font-medium mt-0.5">Nhận thông báo để bé duy trì Streak lửa 🔥</p>
                </div>
              </div>
              
              <!-- Custom Toggle -->
              <div class="w-14 h-8 rounded-full p-1 transition-all duration-200 cursor-pointer"
                :class="studyReminder ? 'bg-emerald-400' : 'bg-slate-200'">
                <div class="w-6 h-6 bg-white rounded-full shadow-md transform transition duration-200"
                  :class="studyReminder ? 'translate-x-6' : 'translate-x-0'">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LOGOUT -->
        <button @click="handleLogout"
          class="w-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 font-extrabold py-4 rounded-[2rem] transition flex items-center justify-center gap-2 text-lg shadow-inner">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất tài khoản
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
import confetti from 'canvas-confetti';

const store = useProgressStore();
const router = useRouter();
const isLoading = ref(true);
const isEditing = ref(false);
const isSaving = ref(false);

const editChildName = ref('');
const editParentName = ref('');
const selectedAvatar = ref('');

const bgMusicActive = ref(localStorage.getItem('bg_music') !== 'false');
const studyReminder = ref(localStorage.getItem('study_reminder') !== 'false');

// Listeners to persist toggles locally
onMounted(() => {
  localStorage.setItem('bg_music', String(bgMusicActive.value));
  localStorage.setItem('study_reminder', String(studyReminder.value));
});

const AVATARS = [
  { name: 'Cáo Con 🦊', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  { name: 'Gấu Trúc 🐼', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Coco' },
  { name: 'Thỏ Bông 🐰', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bunny' },
  { name: 'Mèo Lười 🐱', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily' },
  { name: 'Cún Con 🐶', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bailey' },
  { name: 'Sư Tử Nhỏ 🦁', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo' },
  { name: 'Hổ Con 🐯', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Toby' },
  { name: 'Khỉ Con 🐵', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo' }
];

const THEMES = [
  { id: 'default', name: 'Rừng Xanh 🌳', description: 'Mặc định - Xanh dịu mát', fromColor: 'from-emerald-100 to-emerald-200', activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-600' },
  { id: 'ocean', name: 'Đại Dương 🐳', description: 'Xanh dương bình yên', fromColor: 'from-sky-100 to-sky-200', activeClass: 'border-sky-400 bg-sky-50 text-sky-600' },
  { id: 'peach', name: 'Đào Ngọt 🌸', description: 'Hồng & Xanh dịu nhẹ', fromColor: 'from-rose-100 to-rose-200', activeClass: 'border-rose-400 bg-rose-50 text-rose-600' },
  { id: 'sunset', name: 'Hoàng Hôn ☀️', description: 'Cam vàng ấm áp', fromColor: 'from-amber-100 to-amber-200', activeClass: 'border-amber-400 bg-amber-50 text-amber-600' }
];

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    store.userInfo = res.data.userInfo;
    store.currentStreak = res.data.currentStreak;

    editChildName.value = store.userInfo.childName || '';
    editParentName.value = store.userInfo.parentName || '';
    selectedAvatar.value = store.userInfo.avatar || AVATARS[0].url;

  } catch (err) {
    console.error("Lỗi tải profile:", err);
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
       store.logout();
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUserProfile();
});

const startEditing = () => {
  editChildName.value = store.userInfo.childName;
  editParentName.value = store.userInfo.parentName;
  selectedAvatar.value = store.userInfo.avatar || AVATARS[0].url;
  isEditing.value = true;
};

const saveProfile = async () => {
  if (!editChildName.value.trim()) {
    alert("Tên của bé không được để trống nhé!");
    return;
  }
  isSaving.value = true;
  try {
    await store.updateProfile(editChildName.value.trim(), editParentName.value.trim(), selectedAvatar.value);
    isEditing.value = false;
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  } catch (error) {
    alert("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!");
  } finally {
    isSaving.value = false;
  }
};

const selectTheme = (themeId) => {
  store.changeTheme(themeId);
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  });
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  });
};

const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    store.logout();
  }
}
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>