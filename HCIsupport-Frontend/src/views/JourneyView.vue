<template>
  <div class="flex h-screen custom-theme-bg font-quicksand overflow-hidden relative">
    
    <!-- Decorative Floating Leaf Graphics (Forest Adventure Vibes) -->
    <div class="absolute top-10 right-[15%] text-4xl select-none pointer-events-none opacity-20 animate-float-slow">🍃</div>
    <div class="absolute bottom-20 left-[20%] text-5xl select-none pointer-events-none opacity-20 animate-float-mid">🌱</div>
    <div class="absolute top-[40%] left-[25%] text-3xl select-none pointer-events-none opacity-15 animate-float-fast">🍄</div>
    <div class="absolute bottom-[30%] right-[10%] text-4xl select-none pointer-events-none opacity-20 animate-float-slow-2">🌸</div>

    <!-- Pinned Desktop Sidebar -->
    <div class="hidden md:block w-64 shrink-0 h-full border-r border-slate-200 bg-white z-20 relative">
      <Sidebar />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col h-full overflow-y-auto pb-24 md:pb-8 pr-1 relative z-10">
      
      <!-- Top Sticky Navigation & Header -->
      <header class="px-6 py-5 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-md border-b border-slate-100 z-30 shadow-[0_2px_15px_rgba(0,0,0,0.02)] select-none">
        <div class="flex items-center gap-3">
          <!-- Back to dashboard for ease of use -->
          <button @click="$router.push('/app')" 
                  class="md:hidden w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div>
            <h1 class="text-xl md:text-2xl font-black text-emerald-800 flex items-center gap-2">
              <span>🗺️</span> Hành Trình Học Tập
            </h1>
            <p class="text-xs text-emerald-600/80 font-bold hidden sm:block">Khám phá thung lũng cảm xúc cùng bé yêu!</p>
          </div>
        </div>

        <!-- Right Header Stats (Cozy Floating Bubbles) -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- Streak -->
          <div class="flex items-center gap-1.5 font-black text-orange-600 bg-orange-50 border border-orange-100 px-3.5 py-2 rounded-2xl hover:scale-105 transition cursor-pointer shadow-sm text-sm">
            <i class="fas fa-fire text-orange-500 animate-bounce"></i>
            <span>{{ store.currentStreak }} ngày</span>
          </div>
          
          <!-- Stars -->
          <div class="flex items-center gap-1.5 font-black text-amber-600 bg-yellow-50 border border-yellow-100 px-3.5 py-2 rounded-2xl hover:scale-105 transition cursor-pointer shadow-sm text-sm">
            <i class="fas fa-star text-yellow-400"></i>
            <span>{{ store.stars }} sao</span>
          </div>

          <!-- Profile Photo -->
          <div @click="$router.push('/profile')" class="w-10 h-10 rounded-full border-2 border-emerald-250 bg-white p-0.5 shadow-sm cursor-pointer hover:rotate-6 transition shrink-0">
            <img :src="store.userInfo.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'" class="w-full h-full rounded-full object-cover bg-white" />
          </div>
        </div>
      </header>

      <!-- Map Body Scrollable Container -->
      <main class="max-w-5xl w-full mx-auto p-6 flex-1 space-y-12">

        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-100/50 p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col sm:flex-row items-center gap-5 shadow-sm">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-300/10 rounded-full"></div>
          <div class="text-4xl sm:text-5xl shrink-0 animate-bounce">🎒</div>
          <div class="text-center sm:text-left">
            <h2 class="text-lg md:text-xl font-black text-emerald-800">Chào mừng {{ store.userInfo.childName || 'Bé Bi' }} đến với Đại Ngàn Cảm Xúc!</h2>
            <p class="text-xs md:text-sm font-bold text-emerald-700/80 mt-1 leading-relaxed">
              Các trạm học thú vị đang chờ bé khám phá. Hãy lần lượt chinh phục từng chặng để rèn luyện kỹ năng và nhận phần quà rương sao cực khủng nhé! 🌳⭐️
            </p>
          </div>
        </div>

        <!-- Levels List (Roadmap Chapters) -->
        <div v-if="store.isLoading && !store.levels.length" class="flex flex-col items-center justify-center py-20 text-slate-400">
          <i class="fas fa-spinner fa-spin text-5xl text-emerald-500 mb-4 animate-pulse"></i>
          <p class="font-extrabold text-lg">Đang tải bản đồ phiêu lưu...</p>
        </div>

        <div v-else class="space-y-16 relative">
          <!-- Winding Connection Trail (Visual connecting path between level cards) -->
          <div class="hidden md:block absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-2 bg-dashed border-l-4 border-emerald-200 -z-10"></div>

          <!-- LEVEL CARD LOOP -->
          <div v-for="(level, idx) in store.levels" :key="level.id" 
               class="bg-white border-[3px] rounded-[2.5rem] p-6 md:p-8 shadow-xl border-slate-100 relative transition-all duration-300 hover:shadow-2xl flex flex-col gap-6"
               :class="[
                 level.locked 
                   ? 'opacity-85 border-dashed border-slate-200 bg-slate-50/50 shadow-none' 
                   : 'border-emerald-100 shadow-[0_15px_30px_rgba(22,163,74,0.03)]'
               ]">
            
            <!-- Top Header of Level (Claymorphic Green Tab) -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-dashed border-slate-100">
              <div class="flex items-center gap-3.5">
                <span class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner"
                      :class="level.locked ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
                  {{ idx + 1 }}
                </span>
                <div>
                  <h3 class="text-xl font-black flex items-center gap-2"
                      :class="level.locked ? 'text-slate-400' : 'text-emerald-950'">
                    {{ level.name }}
                    <span v-if="level.locked" class="text-xs bg-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">🔒 Khóa</span>
                    <span v-else-if="isLevelDone(level)" class="text-xs bg-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <i class="fas fa-check-circle"></i> Đã hoàn thành
                    </span>
                  </h3>
                  <p class="text-xs font-bold mt-0.5" :class="level.locked ? 'text-slate-400/80' : 'text-emerald-700/70'">
                    {{ level.description || 'Học và trải nghiệm cảm xúc' }}
                  </p>
                </div>
              </div>

              <!-- Star Milestone Indicator inside Level Header -->
              <div v-if="!level.locked" class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-2xl">
                <span class="text-xs font-bold text-emerald-800">Tiến độ bài học:</span>
                <span class="text-sm font-black text-emerald-600">{{ getCompletedCount(level) }}/5</span>
              </div>
            </div>

            <!-- LEVEL LOCKED OVERLAY BANNER -->
            <div v-if="level.locked" class="py-12 flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-3xl border border-slate-200/50 mb-4 shadow-inner">
                🔒
              </div>
              <h4 class="font-black text-slate-600 text-base">Cấp độ đang bị khóa</h4>
              <p class="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Bé yêu hãy giúp Cáo Con hoàn thành tất cả các trạm ở <strong>Màn {{ idx }}</strong> để mở khóa vùng đất này nhé! 💕
              </p>
            </div>

            <!-- STATIONS ROADWAY MAP GRID -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-5 gap-6 py-4 relative z-10 select-none">
              
              <!-- Connection dashed curve under desktop screen -->
              <div class="hidden sm:block absolute top-[44px] left-[8%] right-[8%] h-0.5 border-t-[3px] border-dashed border-emerald-100 -z-10 pointer-events-none"></div>

              <!-- STATION 1 CARD -->
              <div @click="enterStation(level, 'flashcard')" 
                   class="flex flex-col items-center text-center group cursor-pointer">
                <div class="node-icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition transform relative z-10"
                     :class="getStationClasses(level, 'flashcard')">
                  🎴
                  <span v-if="isCompleted(level, 'flashcard')" class="checkmark-badge"><i class="fas fa-check"></i></span>
                  <span v-else-if="!isLocked(level.id, 'flashcard')" class="play-badge"><i class="fas fa-play"></i></span>
                </div>
                <div class="mt-3">
                  <h4 class="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition">Trạm 1</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">Thẻ Tranh Kì Diệu</p>
                </div>
              </div>

              <!-- STATION 2 CARD -->
              <div @click="enterStation(level, 'matching')" 
                   class="flex flex-col items-center text-center group cursor-pointer">
                <div class="node-icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition transform relative z-10"
                     :class="getStationClasses(level, 'matching')">
                  🧩
                  <span v-if="isCompleted(level, 'matching')" class="checkmark-badge"><i class="fas fa-check"></i></span>
                  <span v-else-if="!isLocked(level.id, 'matching')" class="play-badge animate-pulse"><i class="fas fa-play"></i></span>
                </div>
                <div class="mt-3">
                  <h4 class="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition">Trạm 2</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">Ghép Cặp Siêu Tốc</p>
                </div>
              </div>

              <!-- STATION 3 CARD -->
              <div @click="enterStation(level, 'context')" 
                   class="flex flex-col items-center text-center group cursor-pointer">
                <div class="node-icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition transform relative z-10"
                     :class="getStationClasses(level, 'context')">
                  📚
                  <span v-if="isCompleted(level, 'context')" class="checkmark-badge"><i class="fas fa-check"></i></span>
                  <span v-else-if="!isLocked(level.id, 'context')" class="play-badge"><i class="fas fa-play"></i></span>
                </div>
                <div class="mt-3">
                  <h4 class="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition">Trạm 3</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">Nhận Biết Tình Huống</p>
                </div>
              </div>

              <!-- STATION 4 CARD -->
              <div @click="enterStation(level, 'emotion_training')" 
                   class="flex flex-col items-center text-center group cursor-pointer">
                <div class="node-icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition transform relative z-10"
                     :class="getStationClasses(level, 'emotion_training')">
                  🪞
                  <span v-if="isCompleted(level, 'emotion_training')" class="checkmark-badge"><i class="fas fa-check"></i></span>
                  <span v-else-if="!isLocked(level.id, 'emotion_training')" class="play-badge"><i class="fas fa-play"></i></span>
                </div>
                <div class="mt-3">
                  <h4 class="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition">Trạm 4</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">Thử Tài Soi Gương</p>
                </div>
              </div>

              <!-- STATION 5 CARD (AI Game) -->
              <div @click="enterStation(level, 'ai')" 
                   class="flex flex-col items-center text-center group cursor-pointer">
                <div class="node-icon-circle w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition transform relative z-10"
                     :class="getStationClasses(level, 'ai')">
                  🤖
                  <span v-if="isCompleted(level, 'ai')" class="checkmark-badge"><i class="fas fa-check"></i></span>
                  <span v-else-if="!isLocked(level.id, 'ai')" class="play-badge"><i class="fas fa-play"></i></span>
                </div>
                <div class="mt-3">
                  <h4 class="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition">Trạm 5</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">Gương Thần Nhận Diện</p>
                </div>
              </div>

            </div>

            <!-- LEVEL TREASURE CHEST ROW (Cozy claymorphic chest tab) -->
            <div v-if="!level.locked" class="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
              <div class="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-amber-400 to-yellow-500"></div>
              
              <div class="flex items-center gap-3">
                <!-- Lock Icon or Glowing Chest -->
                <div class="text-3xl relative" :class="{ 'animate-bounce': isLevelDone(level) && !level.chestClaimed }">
                  <span v-if="level.chestClaimed">🎁 Opened</span>
                  <span v-else-if="isLevelDone(level)" class="cursor-pointer text-4xl drop-shadow-md">🎁</span>
                  <span v-else class="text-3xl opacity-50 grayscale">🔒</span>
                </div>
                
                <div class="text-center sm:text-left">
                  <h4 class="text-xs font-black text-slate-800">Rương Thần Kỳ Cấp Độ {{ idx + 1 }}</h4>
                  <p class="text-[10px] font-bold text-slate-500 leading-snug">
                    <span v-if="level.chestClaimed" class="text-emerald-600">Con đã mở rương này và nhận 15 sao cực kì xuất sắc! 🌟</span>
                    <span v-else-if="isLevelDone(level)" class="text-amber-500 animate-pulse font-extrabold">Bấm vào rương để mở hộp quà 15 Sao của con nào! 🎉</span>
                    <span v-else>Hoàn thành cả 5 trạm học của cấp độ này để giải khóa phần thưởng sao!</span>
                  </p>
                </div>
              </div>

              <!-- Chest Action Button -->
              <button v-if="isLevelDone(level) && !level.chestClaimed"
                      @click="triggerClaimChest(level)"
                      class="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-extrabold text-xs rounded-2xl shadow-md border-b-4 border-amber-600 transition transform active:scale-95 active:border-b-0 active:translate-y-1">
                <i class="fas fa-gift"></i> Nhận 15 Sao!
              </button>
              
              <div v-else-if="level.chestClaimed" class="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                <i class="fas fa-check-circle text-base"></i> Đã nhận quà
              </div>

              <div v-else class="text-[10px] font-black text-slate-400 uppercase bg-slate-200/50 px-3 py-1 rounded-xl">
                Còn {{ 5 - getCompletedCount(level) }} trạm
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>

    <!-- Alert Modal / Popup Banners (Clean, cozy custom child friendly) -->
    <div v-if="modalMessage" 
         class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      <div class="bg-white rounded-[2.5rem] border-4 border-emerald-100 p-8 max-w-sm w-full text-center relative shadow-2xl animate-scale-up">
        <!-- Close heart icon -->
        <button @click="modalMessage = ''" class="absolute top-4 right-4 text-slate-300 hover:text-slate-500 text-xl transition">
          <i class="fas fa-times-circle"></i>
        </button>

        <div class="text-6xl mb-4 animate-bounce">
          {{ modalEmoji }}
        </div>
        
        <h3 class="text-xl font-black text-slate-800 mb-2">{{ modalTitle }}</h3>
        <p class="text-xs font-bold text-slate-500 leading-relaxed mb-6">{{ modalMessage }}</p>
        
        <button @click="modalMessage = ''" 
                class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition transform active:scale-97">
          Đồng ý luôn! 💕
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();

// Cozy Custom Modal States
const modalMessage = ref('');
const modalTitle = ref('');
const modalEmoji = ref('');

// --- LIFECYCLE ---
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  // Tải đồng bộ tiến trình học tập
  store.isLoading = true;
  try {
    await Promise.all([
      store.fetchLevelsFromAPI(),
      store.fetchReportData()
    ]);
  } catch (error) {
    console.error("Lỗi đồng bộ hóa dữ liệu hành trình:", error);
  } finally {
    store.isLoading = false;
  }
});

// --- HELPER METHODS ---

const isLocked = (levelId, type) => {
  return store.isLessonLocked(levelId, type);
};

const isCompleted = (level, type) => {
  return !!level.lessons?.[type];
};

const getCompletedCount = (level) => {
  if (!level.lessons) return 0;
  return Object.values(level.lessons).filter(val => val === true).length;
};

const isLevelDone = (level) => {
  return getCompletedCount(level) === 5;
};

// Handle entering a station route
const enterStation = (level, type) => {
  if (level.locked) {
    triggerAlert("Cấp độ đang bị khóa!", "Bé yêu hãy cùng thám hiểm và vượt qua các màn học phía trước để mở khóa màn chơi mới này nhé!", "🔒", "Lần sau sẽ thử!");
    return;
  }

  if (isLocked(level.id, type)) {
    triggerAlert("Trạm này chưa mở đâu!", "Bé hãy hoàn thành các bài học ở trạm trước theo thứ tự 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 để mở khóa trạm này nha!", "🧸", "Con nhớ rồi ạ!");
    return;
  }

  // Navigate to Dynamic Lesson Path
  router.push(`/learn/${level.id}/${type}`);
};

// Trigger custom cute alerts
const triggerAlert = (title, message, emoji) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalEmoji.value = emoji;
};

// Trigger Confetti and Store Chest claiming API
const triggerClaimChest = async (level) => {
  if (level.chestClaimed) return;
  
  // Confetti celebration!
  confetti({
    particleCount: 180,
    spread: 80,
    origin: { y: 0.6 }
  });
  
  await store.claimChest(level.id);
  triggerAlert("Chúc Mừng Bé Yêu! 🎁", "Con vừa mở Rương Thần Kỳ và được tặng thêm 15 Sao thưởng vàng cực lấp lánh! Hãy dùng sao để thám hiểm tiếp nhé!", "🎉");
};

// Return classes based on completion / lock states
const getStationClasses = (level, type) => {
  if (isCompleted(level, type)) {
    // Completed state
    return 'bg-emerald-500 text-white border-4 border-emerald-300 shadow-[0_6px_0_#15803d,0_10px_20px_rgba(22,163,74,0.2)] hover:scale-105 active:scale-95';
  } else if (isLocked(level.id, type)) {
    // Locked state
    return 'bg-slate-100 text-slate-400 border-4 border-slate-200 cursor-not-allowed shadow-[0_6px_0_#cbd5e1]';
  } else {
    // Unlocked / Pulse Play state
    return 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white border-4 border-amber-300 shadow-[0_6px_0_#ca8a04,0_10px_20px_rgba(234,179,8,0.25)] hover:scale-105 active:scale-95 scale-103 animate-pulse';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800;900&display=swap');

.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}

/* Node layout decorators */
.node-icon-circle {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.checkmark-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: #059669;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-weight: 900;
}

.play-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: #f59e0b;
  border: 1px solid #ffffff;
  color: #ffffff;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-weight: 900;
}

/* Soft Floating Animations */
@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(8deg); }
}

@keyframes floatMid {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-6deg); }
}

@keyframes floatFast {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(4deg); }
}

.animate-float-slow {
  animation: floatSlow 6s ease-in-out infinite;
}
.animate-float-slow-2 {
  animation: floatSlow 8s ease-in-out infinite;
}
.animate-float-mid {
  animation: floatMid 5s ease-in-out infinite;
}
.animate-float-fast {
  animation: floatFast 4s ease-in-out infinite;
}

/* Modals Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
