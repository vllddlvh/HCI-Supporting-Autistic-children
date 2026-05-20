<template>
  <div class="flex h-screen font-quicksand overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50">

    <!-- Dynamic Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Clouds -->
      <div class="cloud opacity-40" style="--duration: 45s; top: 10%; left: -100px;">
        <i class="fas fa-cloud text-white text-9xl"></i>
      </div>
      <div class="cloud opacity-30" style="--duration: 65s; top: 25%; left: -200px;">
        <i class="fas fa-cloud text-white text-8xl"></i>
      </div>
      <div class="cloud opacity-50" style="--duration: 55s; top: 40%; left: -150px;">
        <i class="fas fa-cloud text-white text-[10rem]"></i>
      </div>
      
      <!-- Decorative Blobs -->
      <div class="absolute top-[10%] -left-20 w-[40rem] h-[40rem] bg-sky-200/20 rounded-full blur-[120px] animate-pulse-soft"></div>
      <div class="absolute bottom-[10%] -right-20 w-[35rem] h-[35rem] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse-soft" style="animation-delay: 2s"></div>
    </div>

    <!-- Left Sidebar Space -->
    <div class="hidden md:block w-80 shrink-0 h-full relative z-[100]">
      <Sidebar />
    </div>

    <!-- Main Content (Map) -->
    <div class="flex-1 h-full overflow-y-auto relative no-scrollbar scroll-smooth">
      
      <!-- Mobile Top Bar -->
      <div class="md:hidden sticky top-0 z-[60] px-6 py-4 flex justify-between items-center bg-white/60 backdrop-blur-2xl border-b border-white/40">
        <span class="font-black text-slate-800 text-xl tracking-tight">Empathy<span class="text-sky-500">Kids</span></span>
        <div class="flex gap-3">
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/50 rounded-full border border-orange-200">
            <i class="fas fa-fire text-orange-500 text-sm"></i>
            <span class="text-orange-700 font-black text-xs">{{ store.currentStreak }}</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100/50 rounded-full border border-yellow-200">
            <i class="fas fa-star text-yellow-500 text-sm"></i>
            <span class="text-yellow-700 font-black text-xs">{{ store.stars }}</span>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto px-6 py-16 relative z-10">
        
        <!-- Premium Header -->
        <div class="text-center mb-24 relative">
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
          <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3 drop-shadow-sm">Hành trình của bé</h1>
          <div class="flex items-center justify-center gap-3">
            <div class="h-px w-8 bg-slate-300"></div>
            <p class="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Chinh phục cảm xúc mỗi ngày</p>
            <div class="h-px w-8 bg-slate-300"></div>
          </div>
        </div>

        <div v-for="(level, index) in store.levels" :key="level.id" class="relative mb-40">
          
          <!-- Level Flag (Premium Card) -->
          <div class="flex justify-center mb-24 relative z-20">
            <div :class="['group relative px-10 py-6 rounded-[2.5rem] text-white shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 border-b-8',
              level.locked ? 'bg-slate-300 border-slate-400/50 shadow-slate-200' : 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-600/30 shadow-emerald-200 cursor-pointer']">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
                   <i :class="[level.locked ? 'fas fa-lock' : getLevelIcon(index), {'text-white/50': level.locked, 'text-yellow-300 drop-shadow-md': !level.locked}]"></i>
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black opacity-80 uppercase tracking-widest mb-0.5">Cấp độ {{ index + 1 }}</p>
                  <p class="text-2xl font-black leading-tight">{{ level.name }}</p>
                </div>
              </div>
              
              <!-- Completion Badge for level -->
              <div v-if="getLevelProgress(level) === 100" class="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-xl animate-bounce">
                <i class="fas fa-crown"></i>
              </div>

              <!-- Premium Progress indicator -->
              <div v-if="!level.locked" class="absolute -bottom-2 left-8 right-8 h-2 bg-black/10 rounded-full overflow-hidden">
                <div class="bg-white h-full transition-all duration-1000 relative" :style="{ width: getLevelProgress(level) + '%' }">
                  <div class="absolute top-0 right-0 w-2 h-full bg-white blur-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- The Map Path Area -->
          <div class="relative h-[900px] w-full">
            
            <!-- Path SVG (Enhanced with dash animation) -->
            <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient :id="'pathGrad-' + level.id" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop :offset="getStopOffset(level) + '%'" stop-color="#34d399" />
                  <stop :offset="getStopOffset(level) + '%'" stop-color="#E2E8F0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <!-- Background shadow path -->
              <path d="M 50 2 C 50 15 15 15 15 25 C 15 35 85 35 85 45 C 85 55 15 55 15 65 C 15 75 50 75 50 85 L 50 98"
                fill="none" stroke="rgba(0,0,0,0.03)" stroke-width="6" stroke-linecap="round" />
              <!-- Animated dash path -->
              <path d="M 50 2 C 50 15 15 15 15 25 C 15 35 85 35 85 45 C 85 55 15 55 15 65 C 15 75 50 75 50 85 L 50 98"
                fill="none" :stroke="level.locked ? '#E2E8F0' : `url(#pathGrad-${level.id})`" 
                stroke-width="4" stroke-linecap="round" class="path-dash" filter="url(#glow)" />
            </svg>

            <!-- Node items -->
            <template v-for="(node, nodeIdx) in getLevelNodes(level)" :key="node.type">
                <div class="absolute z-20" :style="node.style">
                    
                    <!-- Current Mascot Pointer -->
                    <div v-if="node.state === 'current'" id="current-lesson-node"
                         class="absolute -top-28 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none group">
                         <div class="relative">
                           <div class="absolute inset-0 bg-sky-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                           <img src="/img/mascot.png" class="w-32 h-32 drop-shadow-2xl animate-float-gentle object-contain" alt="Mascot">
                           
                           <!-- Speech Bubble -->
                           <div class="absolute -top-12 -right-24 bg-white px-5 py-3 rounded-[2rem] rounded-bl-none shadow-2xl border-2 border-sky-100 whitespace-nowrap animate-bounce-subtle">
                             <p class="text-sky-600 text-xs font-black uppercase tracking-wider">Học tiếp thôi bé!</p>
                             <div class="absolute -bottom-2 left-0 w-4 h-4 bg-white border-l-2 border-b-2 border-sky-100 rotate-45 -translate-x-1/2"></div>
                           </div>
                         </div>
                    </div>

                    <!-- Lesson Node Button -->
                    <button @click="goToLesson(level.id, node.type)" 
                            @mouseenter="playHoverSound"
                            :style="node.state !== 'locked' ? getNodeStyle(node.type) : ''"
                            :class="['node-btn-premium group', node.state === 'locked' ? 'locked' : '']">
                        
                        <div class="relative w-full h-full flex flex-col items-center justify-center">
                          <i :class="node.icon" class="text-3xl mb-1 drop-shadow-md"></i>
                          <span class="text-[8px] font-black uppercase tracking-tighter opacity-90">{{ node.shortLabel }}</span>
                        </div>
                        
                        <!-- Completion Badge -->
                        <div v-if="node.state === 'completed'"
                             class="absolute -right-2 -top-2 bg-emerald-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-lg z-20 scale-110">
                            <i class="fas fa-check"></i>
                        </div>
                        
                        <!-- Label Bubble on Hover -->
                        <div class="absolute -bottom-14 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-50">
                           <span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">{{ getNodeLabel(node.type) }}</span>
                        </div>

                        <!-- Sparkle effect for current node -->
                        <div v-if="node.state === 'current'" class="absolute -inset-4 pointer-events-none">
                          <div class="absolute top-0 left-0 text-yellow-400 text-lg animate-sparkle" style="animation-delay: 0s">⭐</div>
                          <div class="absolute top-0 right-0 text-yellow-400 text-sm animate-sparkle" style="animation-delay: 0.5s">✨</div>
                          <div class="absolute bottom-0 left-1/4 text-yellow-400 text-sm animate-sparkle" style="animation-delay: 1.2s">✨</div>
                        </div>
                    </button>
                </div>
            </template>

            <!-- Treasure Chest (Final Boss/Goal) -->
            <div class="absolute left-1/2 -translate-x-1/2 top-[92%] z-30 group cursor-pointer transition-all duration-500"
                 @click="handleOpenChest(level, $event)">
              <div v-if="!isLevelDone(level)" class="relative grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all hover:scale-110">
                <div class="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                  <i class="fas fa-lock text-4xl text-slate-400"></i>
                </div>
              </div>
              <div v-else-if="!level.chestClaimed" class="relative group">
                <div class="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-6 py-3 rounded-2xl border-2 border-white shadow-2xl z-40 animate-bounce uppercase tracking-widest">Mở quà tặng con!</div>
                <div class="w-28 h-28 bg-amber-400/20 rounded-full blur-3xl absolute inset-0 animate-pulse"></div>
                <img src="https://cdn-icons-png.flaticon.com/512/3601/3601664.png" class="w-28 h-28 drop-shadow-[0_20px_40px_rgba(245,158,11,0.4)] animate-float-gentle" />
              </div>
              <div v-else class="opacity-50 hover:opacity-100 transition-all hover:scale-105">
                <img src="https://cdn-icons-png.flaticon.com/512/3601/3601700.png" class="w-24 h-24" />
              </div>
            </div>
          </div>
        </div>

        <!-- Future levels -->
        <div class="flex flex-col items-center py-32 opacity-30">
          <div class="w-24 h-24 glass-panel rounded-[2.5rem] flex items-center justify-center text-4xl text-slate-400 mb-6 border-2 border-dashed border-slate-300">
            <i class="fas fa-rocket"></i>
          </div>
          <p class="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Sắp ra mắt vùng đất mới</p>
        </div>
      </div>
    </div>

    <!-- Right Sidebar (Stats & Challenges) -->
    <div class="hidden lg:flex w-96 shrink-0 h-full border-l border-white/40 flex-col p-10 pb-24 gap-10 z-[100] glass-panel rounded-l-3xl border-y-0 border-r-0 overflow-y-auto no-scrollbar">
      
      <!-- Premium User Header -->
      <div class="flex items-center justify-between gap-5 p-2 rounded-[2rem] transition-all">
        <div class="flex items-center gap-5">
          <div class="relative group cursor-pointer" @click="router.push('/profile')">
             <div class="absolute -inset-1 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
             <div class="w-16 h-16 rounded-3xl bg-sky-100 flex items-center justify-center text-sky-500 text-2xl border-4 border-white shadow-xl relative z-10 overflow-hidden">
                <img v-if="store.userInfo.avatar" :src="store.userInfo.avatar" @error="e => e.target.style.display='none'" class="absolute inset-0 w-full h-full object-cover" />
                <i class="fas fa-user-astronaut"></i>
             </div>
             <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white z-20 flex items-center justify-center text-[10px] text-white">
                <i class="fas fa-check"></i>
             </div>
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Chào mừng bé!</p>
            <p class="text-2xl font-black text-slate-800 leading-tight">Bé {{ store.userInfo.childName || 'Thợ Săn' }}</p>
          </div>
        </div>
      </div>

      <!-- Elevated Stats Grid -->
      <div class="grid grid-cols-2 gap-6">
        <div class="glass-panel p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:translate-y-[-4px] transition-all cursor-default relative overflow-hidden">
          <div class="absolute top-0 right-0 w-12 h-12 bg-orange-100 rounded-bl-full opacity-30"></div>
          <i class="fas fa-fire text-orange-500 text-3xl group-hover:animate-bounce"></i>
          <span class="text-2xl font-black text-slate-800 leading-none">{{ store.currentStreak }}</span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ngày liên tiếp</span>
        </div>
        <div id="star-counter" :class="{'scale-110 rotate-12': starBump}" class="glass-panel p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:translate-y-[-4px] transition-all cursor-default relative overflow-hidden">
          <div class="absolute top-0 right-0 w-12 h-12 bg-yellow-100 rounded-bl-full opacity-30"></div>
          <i class="fas fa-star text-yellow-400 text-3xl group-hover:animate-spin-slow"></i>
          <span class="text-2xl font-black text-slate-800 leading-none">{{ store.stars }}</span>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Sao hy vọng</span>
        </div>
      </div>

      <!-- Daily Missions (Refined) -->
      <div class="space-y-6">
        <div class="flex justify-between items-center px-2">
          <div>
            <h3 class="font-black text-slate-800 text-lg leading-none">Nhiệm vụ hôm nay</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Làm mới sau 12 giờ</p>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-sm">
            <i class="fas fa-bolt-lightning"></i>
          </div>
        </div>
        
        <div class="space-y-5">
          <div v-for="mission in [
            { id: 1, title: 'Hoàn thành 2 bài học', progress: 1, total: 2, icon: '⚡', color: 'from-amber-400 to-orange-400' },
            { id: 2, title: 'Nhận diện 5 cảm xúc', progress: 5, total: 5, icon: '😊', color: 'from-emerald-400 to-teal-400' }
          ]" :key="mission.id" class="glass-panel p-5 rounded-3xl space-y-4 hover:border-sky-200/50 transition-colors">
            <div class="flex justify-between items-center font-black">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-lg">{{ mission.icon }}</span>
                <span class="text-slate-700 text-xs">{{ mission.title }}</span>
              </div>
              <span :class="mission.progress >= mission.total ? 'text-emerald-500' : 'text-slate-400'" class="text-[11px]">{{ mission.progress }}/{{ mission.total }}</span>
            </div>
            <div class="h-3.5 w-full bg-slate-100/50 rounded-full overflow-hidden p-1 border border-slate-200/30">
              <div class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r" :class="mission.color" :style="{ width: (mission.progress/mission.total*100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Promo Card (State of the art) -->
      <div class="mt-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[3rem] p-10 text-white relative group cursor-pointer shadow-2xl shadow-indigo-200 transition-transform hover:scale-[1.02] flex flex-col items-center text-center gap-6">
        <!-- Decorative elements -->
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <!-- Content -->
        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20 relative z-10">
          <i class="fas fa-crown text-yellow-300 drop-shadow-md"></i>
        </div>

        <div class="bg-white/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm relative z-10">
          Pro Member
        </div>
        
        <div class="space-y-3 relative z-10">
          <h4 class="font-black text-2xl leading-tight">Mở khóa<br/>Thế giới Cảm xúc</h4>
          <p class="text-[11px] text-indigo-100 font-bold leading-relaxed opacity-90 px-2">
            Truy cập 100+ bài học độc quyền và báo cáo phân tích AI chuyên sâu.
          </p>
        </div>
        
        <button class="w-full py-4 bg-white text-indigo-700 font-black text-xs rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-sky-50 transition-all hover:scale-105 active:scale-95 relative z-10">
          Dùng thử 7 ngày
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();
const starBump = ref(false);

onMounted(() => {
    store.loadUserInfo();
    store.fetchReportData(); // Fetch stars and streak
    store.fetchLevelsFromAPI().then(() => {
        setTimeout(() => {
            const currentEl = document.getElementById('current-lesson-node');
            if (currentEl) {
                currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 800);
    });
});

const isLevelDone = (level) => level.lessons && level.lessons.flashcard && level.lessons.matching && level.lessons.context && level.lessons.emotion_training && level.lessons.ai;

const getLevelProgress = (level) => {
  if (!level.lessons) return 0;
  const total = 5;
  const done = Object.values(level.lessons).filter(Boolean).length;
  return Math.min((done / total) * 100, 100);
};

const getLevelIcon = (index) => {
  const icons = [
    'fas fa-sun',
    'fas fa-cloud-rainbow',
    'fas fa-star-half-stroke',
    'fas fa-trophy'
  ];
  return icons[index] || 'fas fa-flag-checkered';
};

const getLessonState = (level, type) => {
  if (store.isLessonLocked(level.id, type)) return 'locked';
  if (level.lessons && level.lessons[type]) return 'completed';
  return 'current';
};

const getNodeLabel = (type) => {
  const labels = {
    flashcard: 'Khám phá thẻ',
    matching: 'Thử thách ghép cặp',
    context: 'Tình huống thực tế',
    emotion_training: 'Luyện tập cảm xúc',
    ai: 'Camera Nhận diện AI'
  };
  return labels[type] || '';
};

const getLevelNodes = (level) => {
    return [
        { type: 'flashcard', icon: 'fas fa-clone', shortLabel: 'Học thẻ', style: 'left: 50%; transform: translateX(-50%); top: 2%;', state: getLessonState(level, 'flashcard') },
        { type: 'matching', icon: 'fas fa-puzzle-piece', shortLabel: 'Ghép cặp', style: 'left: 15%; top: 23%;', state: getLessonState(level, 'matching') },
        { type: 'context', icon: 'fas fa-comment-dots', shortLabel: 'Tình huống', style: 'right: 15%; top: 43%;', state: getLessonState(level, 'context') },
        { type: 'emotion_training', icon: 'fas fa-face-smile-wink', shortLabel: 'Luyện tập', style: 'left: 15%; top: 63%;', state: getLessonState(level, 'emotion_training') },
        { type: 'ai', icon: 'fas fa-robot', shortLabel: 'Camera AI', style: 'left: 50%; transform: translateX(-50%); top: 83%;', state: getLessonState(level, 'ai') }
    ];
};

const playHoverSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
};

const getStopOffset = (level) => {
    if (!level.lessons) return 2;
    const order = ['flashcard', 'matching', 'context', 'emotion_training', 'ai'];
    let completed = 0;
    for (let t of order) { if (level.lessons[t]) completed++; else break; }
    const stops = [2, 23, 43, 63, 83, 100];
    return stops[completed];
};

const handleOpenChest = (level, event) => {
  if (!isLevelDone(level) || level.chestClaimed) return;
  const chestRect = event.currentTarget.getBoundingClientRect();
  const starRect = document.getElementById('star-counter')?.getBoundingClientRect() || { left: window.innerWidth - 100, top: 20, width: 50 };
  for (let i = 0; i < 20; i++) createFlyingStar(chestRect, starRect, i * 50);
  store.claimChest(level.id);
};

const createFlyingStar = (startRect, endRect, delay) => {
  const star = document.createElement('div');
  star.innerHTML = ['⭐', '✨', '🌟'][Math.floor(Math.random() * 3)];
  star.style.position = 'fixed';
  star.style.fontSize = (Math.random() * 10 + 20) + 'px';
  star.style.zIndex = '9999';
  star.style.left = (startRect.left + startRect.width / 2) + 'px';
  star.style.top = (startRect.top) + 'px';
  star.style.transition = 'all 1.2s cubic-bezier(0.19, 1, 0.22, 1)';
  document.body.appendChild(star);
  
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 100 + 50;
  const burstX = (startRect.left + startRect.width / 2) + Math.cos(angle) * distance;
  const burstY = startRect.top - Math.random() * 100;
  
  setTimeout(() => {
    star.style.left = burstX + 'px';
    star.style.top = burstY + 'px';
    
    setTimeout(() => {
      star.style.left = (endRect.left + endRect.width/2) + 'px';
      star.style.top = (endRect.top + endRect.height/2) + 'px';
      star.style.opacity = '0';
      star.style.transform = 'scale(0.5) rotate(1080deg)';
      setTimeout(() => { 
        star.remove(); 
        if (delay === 0) {
            starBump.value = true; 
            setTimeout(() => starBump.value = false, 200); 
        }
      }, 1200);
    }, 400);
  }, delay);
};

const getNodeStyle = (type) => {
  const styles = {
    flashcard: { '--shadow-rgba': 'rgba(245, 158, 11, 0.3)', '--bg-grad': 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    matching: { '--shadow-rgba': 'rgba(244, 63, 94, 0.3)', '--bg-grad': 'linear-gradient(135deg, #fb7185, #f43f5e)' },
    context: { '--shadow-rgba': 'rgba(14, 165, 233, 0.3)', '--bg-grad': 'linear-gradient(135deg, #38bdf8, #0ea5e9)' },
    emotion_training: { '--shadow-rgba': 'rgba(139, 92, 246, 0.3)', '--bg-grad': 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
    ai: { '--shadow-rgba': 'rgba(16, 185, 129, 0.3)', '--bg-grad': 'linear-gradient(135deg, #34d399, #10b981)' }
  };
  return styles[type] || {};
};

const goToLesson = (lvId, type) => {
  if (store.isLessonLocked(lvId, type)) return;
  router.push(`/learn/${lvId}/${type}`);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
</style>

