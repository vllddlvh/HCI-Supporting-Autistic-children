<template>
  <div class="flex h-screen custom-theme-bg font-quicksand overflow-hidden">

    <div class="hidden md:block w-64 shrink-0 h-full border-r border-slate-200 bg-white z-20 relative">
      <Sidebar />
    </div>

    <RacingTrack />

    <div class="hidden lg:flex w-80 shrink-0 h-full border-l-2 border-amber-100/50 bg-[#fdfbf8] flex-col p-6 gap-6 z-20 select-none">

      <!-- Cozy Floating Stats Bubbles -->
      <div class="flex justify-between items-center gap-3">
        <div
          class="flex items-center gap-2 font-black text-orange-600 bg-orange-50/80 border border-orange-100 px-4 py-2.5 rounded-2xl hover:scale-105 transition cursor-pointer shadow-sm">
          <i class="fas fa-fire text-orange-500 text-xl animate-bounce"></i>
          <span>{{ store.currentStreak }} ngày</span>
        </div>
        
        <div id="star-counter"
          class="flex items-center gap-2 font-black text-amber-600 bg-yellow-50/80 border border-yellow-100 px-4 py-2.5 rounded-2xl hover:scale-105 transition cursor-pointer shadow-sm"
          :class="{ 'scale-110 text-yellow-500': starBump }">
          <i class="fas fa-star text-yellow-400 text-xl"></i>
          <span>{{ store.stars }} sao</span>
        </div>

        <div class="w-10 h-10 rounded-full border-2 border-rose-200 bg-white p-0.5 shadow-sm shrink-0">
          <img :src="store.userInfo.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'" class="w-full h-full rounded-full object-cover bg-white" />
        </div>
      </div>

      <!-- Tactile Quest Board -->
      <div class="bg-white rounded-[2rem] p-5 border-2 border-amber-100/40 shadow-md shadow-rose-50/50 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-300 to-yellow-400"></div>
        
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-black text-slate-800 text-base">🎯 Nhiệm Vụ Hôm Nay</h3>
          <span class="text-[11px] font-black text-sky-500 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase cursor-pointer hover:bg-sky-100 transition">Tất cả</span>
        </div>
        
        <div class="space-y-4">
          <!-- Quest 1 -->
          <div class="flex items-center gap-3">
            <div class="text-2xl w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shrink-0">⚡</div>
            <div class="flex-1 min-w-0">
              <p class="font-black text-slate-700 text-xs truncate">Hoàn thành 1 trạm học</p>
              <div class="w-full bg-slate-100 h-3 rounded-full mt-2 overflow-hidden relative shadow-inner border border-slate-50">
                <div class="bg-gradient-to-r from-amber-400 to-yellow-300 h-full w-1/2 rounded-full relative overflow-hidden">
                  <div class="absolute inset-0 bg-white/20 w-full animate-shimmer"></div>
                </div>
              </div>
            </div>
            <div class="text-[10px] font-black text-amber-500">1/2</div>
          </div>
          
          <!-- Quest 2 -->
          <div class="flex items-center gap-3">
            <div class="text-2xl w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">🎁</div>
            <div class="flex-1 min-w-0">
              <p class="font-black text-slate-700 text-xs truncate">Mở 1 rương thần kì</p>
              <div class="w-full bg-slate-100 h-3 rounded-full mt-2 overflow-hidden relative shadow-inner border border-slate-50">
                <div class="bg-gradient-to-r from-emerald-450 to-green-400 h-full w-full rounded-full relative overflow-hidden">
                  <div class="absolute inset-0 bg-white/20 w-full animate-shimmer"></div>
                </div>
              </div>
            </div>
            <div class="text-emerald-500 font-extrabold text-sm"><i class="fas fa-check-circle"></i></div>
          </div>
        </div>
      </div>

      <!-- Magical Gold Explorer Map Card -->
      <div class="bg-gradient-to-br from-rose-50 to-sky-50 border-2 border-white rounded-[2rem] p-5 shadow-lg shadow-rose-50/50 relative overflow-hidden group cursor-pointer hover:scale-103 transition duration-300">
        <div class="absolute -bottom-6 -right-6 text-7xl opacity-10 group-hover:rotate-12 transition duration-300"><i class="fas fa-crown text-amber-500"></i></div>
        
        <h3 class="font-black text-slate-800 text-base mb-2 flex items-center gap-2">
          <span>👑</span> Bản Đồ Thám Hiểm
        </h3>
        <p class="text-xs font-bold text-slate-500 mb-4 leading-relaxed">
          Đăng ký thành viên vàng để mở khóa tất cả các màn chơi và xe đua ngộ nghĩnh không giới hạn cho bé.
        </p>
        <button
          class="w-full py-3 rounded-2xl bg-rose-450 hover:bg-rose-500 text-white font-black text-sm transition transform active:scale-95"
          style="box-shadow: 0 4px 0 #be123c, 0 6px 12px rgba(244, 63, 94, 0.1)">
          Khám Phá Thành Viên Vàng
        </button>
      </div>

      <div class="mt-auto text-center text-[10px] text-slate-350 font-black tracking-widest space-x-4 border-t pt-4">
        <a href="#" class="hover:text-slate-400 transition">GIỚI THIỆU</a>
        <span>·</span>
        <a href="#" class="hover:text-slate-400 transition">RIÊNG TƯ</a>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import RacingTrack from '../components/RacingTrack.vue';
import { useProgressStore } from '../stores/progress';

const store = useProgressStore();
const starBump = ref(false);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');

.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
