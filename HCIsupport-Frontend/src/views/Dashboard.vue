<template>
  <div class="flex h-screen bg-slate-50 font-quicksand overflow-hidden">

    <div class="hidden md:block w-64 shrink-0 h-full border-r border-slate-200 bg-white z-20 relative">
      <Sidebar />
    </div>

    <RacingTrack />

    <div class="hidden lg:flex w-80 shrink-0 h-full border-l border-slate-200 bg-white flex-col p-6 gap-8 z-20">

      <div class="flex justify-between items-center gap-4">
        <div
          class="flex items-center gap-2 font-extrabold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer">
          <i class="fas fa-fire text-orange-500 text-xl"></i>
          <span class="text-slate-700">{{ store.currentStreak }}</span>
        </div>
        <div id="star-counter"
          class="flex items-center gap-2 font-extrabold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer"
          :class="{ 'scale-125 text-yellow-400': starBump }">
          <i class="fas fa-star text-yellow-400 text-xl"></i>
          <span class="text-slate-700">{{ store.stars }}</span>
        </div>
        <div
          class="flex items-center gap-2 font-extrabold text-slate-400 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer">
          <img :src="store.userInfo.avatar" class="w-8 h-8 rounded-full object-cover border-2 border-slate-200" />
        </div>
      </div>

      <div class="border-2 border-slate-100 rounded-2xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-700 text-lg">Nhiệm vụ hôm nay</h3>
          <span class="text-xs font-bold text-sky-400 uppercase cursor-pointer hover:text-sky-500">Xem tất cả</span>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="text-2xl">⚡</div>
            <div class="flex-1">
              <p class="font-bold text-slate-700 text-sm">Hoàn thành 1 bài học</p>
              <div class="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                <div class="bg-amber-400 h-full w-1/2 rounded-full"></div>
              </div>
            </div>
            <div class="text-xs font-bold text-amber-400">1/2</div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-2xl">🎁</div>
            <div class="flex-1">
              <p class="font-bold text-slate-700 text-sm">Mở 1 rương kho báu</p>
              <div class="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                <div class="bg-emerald-400 h-full w-full rounded-full"></div>
              </div>
            </div>
            <div class="text-emerald-500 font-bold text-xs"><i class="fas fa-check"></i></div>
          </div>
        </div>
      </div>

      <div class="border-2 border-slate-100 rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
        <div
          class="absolute inset-0 bg-gradient-to-br from-violet-300 to-sky-300 opacity-20 group-hover:opacity-30 transition">
        </div>
        <h3 class="font-bold text-slate-700 mb-2">Mở khóa Super?</h3>
        <p class="text-sm text-slate-500 mb-4">Học không giới hạn và tắt quảng cáo.</p>
        <button
          class="w-full py-2 rounded-xl bg-slate-800 text-white font-bold text-sm shadow-lg active:scale-95 transition">Dùng
          thử miễn phí</button>
      </div>

      <div class="mt-auto text-center text-xs text-slate-300 font-bold space-x-4">
        <a href="#" class="hover:text-slate-400">Giới thiệu</a>
        <a href="#" class="hover:text-slate-400">Riêng tư</a>
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
