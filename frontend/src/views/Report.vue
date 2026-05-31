<template>
  <div class="min-h-screen font-quicksand report-bg overflow-x-hidden relative">
    <Sidebar />

    <!-- ☁️ Magic sky background with drifting clouds & floating stars -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <!-- Drifting clouds -->
      <div class="cloud cloud-1" style="--duration: 45s; top: 8%">☁️</div>
      <div class="cloud cloud-2" style="--duration: 65s; top: 25%">☁️</div>
      <div class="cloud cloud-3" style="--duration: 55s; top: 60%">☁️</div>
      
      <!-- Twinkling stars -->
      <div class="star-float" style="top:5%; left:12%; animation-delay: 0s">⭐</div>
      <div class="star-float" style="top:22%; right:8%; animation-delay: 1.5s">✨</div>
      <div class="star-float" style="top:45%; left:6%; animation-delay: 0.8s">🌟</div>
      <div class="star-float" style="top:75%; right:14%; animation-delay: 2.2s">⭐</div>
      <div class="star-float" style="top:90%; left:20%; animation-delay: 1.1s">✨</div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 md:pl-72 px-4 pt-8 pb-28 max-w-[1400px] mx-auto">

      <!-- ── 🎈 COMPACT HEADER ── -->
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pop">
        <h1 class="text-2xl md:text-3xl font-black text-slate-800 drop-shadow-sm">
          Báo Cáo Học Tập Của <span class="text-indigo-600">{{ store.userInfo.childName || 'Bé Bi' }}</span> 🚀
        </h1>
        <div class="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <span class="text-sky-500 text-lg">📅</span>
          <span class="font-bold text-slate-700">{{ currentDate }}</span>
        </div>
      </div>

      <!-- ── 🏆 3D CLAYMOPHIC STATS ROW ── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <!-- Stars -->
        <div class="stat-card group star-card-3d animate-pop" style="animation-delay: 50ms">
          <div class="stat-icon-wrap bg-amber-400">
            <span class="text-3xl group-hover:scale-125 transition-transform duration-300">⭐</span>
          </div>
          <div class="stat-val text-amber-600">{{ store.stars }}</div>
          <div class="stat-lbl">Sao Đã Kiếm</div>
          <span class="stat-pill bg-amber-100 text-amber-600">+{{ Math.max(0, store.stars - prevStars) }} hôm nay</span>
        </div>

        <!-- Accuracy -->
        <div class="stat-card group accuracy-card-3d animate-pop" style="animation-delay: 100ms">
          <div class="stat-icon-wrap bg-sky-400">
            <span class="text-3xl group-hover:scale-125 transition-transform duration-300">🎯</span>
          </div>
          <div class="stat-val" :class="getAccuracyColor(store.reportData.accuracy)">
            {{ store.reportData.accuracy || 0 }}<span class="text-xl font-black">%</span>
          </div>
          <div class="stat-lbl">Chính Xác</div>
          <span class="stat-pill" :class="getAccuracyBadge(store.reportData.accuracy)">
            {{ getAccuracyLabel(store.reportData.accuracy) }}
          </span>
        </div>

        <!-- Streak -->
        <div class="stat-card group streak-card-3d animate-pop" style="animation-delay: 150ms">
          <div class="stat-icon-wrap bg-orange-400">
            <span class="text-3xl group-hover:scale-125 transition-transform duration-300">🔥</span>
          </div>
          <div class="stat-val text-orange-600">{{ store.currentStreak }}</div>
          <div class="stat-lbl">Ngày Liên Tiếp</div>
          <span class="stat-pill bg-orange-100 text-orange-600">
            {{ store.currentStreak >= 7 ? 'Cực siêu phàm!' : 'Cố lên bé yêu!' }}
          </span>
        </div>

        <!-- Lessons Completed -->
        <div class="stat-card group lesson-card-3d animate-pop" style="animation-delay: 200ms">
          <div class="stat-icon-wrap bg-emerald-400">
            <span class="text-3xl group-hover:scale-125 transition-transform duration-300">🏆</span>
          </div>
          <div class="stat-val text-emerald-600">{{ totalLessonsCompleted }}</div>
          <div class="stat-lbl">Bài Đã Học</div>
          <span class="stat-pill bg-emerald-100 text-emerald-600">Tuyệt vời quá!</span>
        </div>
      </div>

      <!-- ── 🗺️ ADVANCED ADVENTURE GRID ── -->
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">

        <!-- ── LEFT: COMPASS MAP (Radar Chart) ── -->
        <div class="xl:col-span-2 glass-panel rounded-[2.5rem] p-8 border-2 border-white/80 animate-pop relative overflow-hidden flex flex-col justify-between" style="animation-delay: 250ms">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-2xl shadow-inner shadow-purple-50">
                🧩
              </div>
              <div>
                <h2 class="font-black text-slate-800 text-lg leading-none">Bản Đồ Cảm Xúc</h2>
                <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Emotion Radar Compass</p>
              </div>
            </div>

            <!-- Chart Box -->
            <div class="relative flex items-center justify-center mx-auto" style="min-height: 250px; max-width: 280px">
              <Radar
                v-if="chartReady && computedRadarData"
                :data="computedRadarData"
                :options="radarOptions"
              />
              <!-- Empty state -->
              <div v-else class="flex flex-col items-center gap-4 text-center">
                <div class="w-20 h-20 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-4xl animate-bounce">
                  🧭
                </div>
                <p class="font-black text-slate-500 text-sm">Đang tải la bàn học tập...</p>
              </div>
            </div>
          </div>

          <!-- Level indicator -->
          <div v-if="computedRadarData" class="space-y-3 mt-6 border-t border-slate-100 pt-6">
            <div v-for="(item, i) in store.reportData.radarData" :key="i" class="flex items-center gap-3 group">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm border"
                   :class="getLevelPillClass(item.score)">
                {{ i + 1 }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-black text-slate-600">{{ item.label }}</span>
                  <span class="text-xs font-black" :class="getScoreColorText(item.score)">{{ item.score }}%</span>
                </div>
                <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                       :class="getScoreColorBg(item.score)"
                       :style="{ width: item.score + '%' }">
                    <div class="absolute inset-0 shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
            ✨ Càng tròn, bé thấu hiểu càng đều! ✨
          </div>
        </div>

        <!-- ── RIGHT: HERO QUESTS LOG (Skills) ── -->
        <div class="xl:col-span-3 glass-panel rounded-[2.5rem] p-8 border-2 border-white/80 animate-pop relative overflow-hidden flex flex-col justify-between" style="animation-delay: 300ms">
          
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-2xl shadow-inner shadow-sky-50">
                  🎒
                </div>
                <div>
                  <h2 class="font-black text-slate-800 text-lg leading-none">Nhiệm Vụ Kỹ Năng</h2>
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Adventure Skills Breakdown</p>
                </div>
              </div>
              <span class="px-3.5 py-1.5 bg-slate-100 border border-slate-200/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Độ thông thạo
              </span>
            </div>

            <!-- Skill List -->
            <div v-if="store.reportData.skillData && store.reportData.skillData.length > 0"
                 class="space-y-4 overflow-y-auto max-h-[460px] pr-1 custom-scrollbar">
              
              <div v-for="skill in store.reportData.skillData" :key="skill.code" class="skill-quest-card">
                <div class="flex items-center gap-4 mb-3">
                  <!-- Custom Icon Capsule -->
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-md relative"
                       :class="getSkillBgClass(skill.code)">
                    <i class="fas text-xl" :class="getLessonIcon(skill.code)"></i>
                    <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[9px] shadow-sm font-black border border-slate-200">
                      {{ getSkillEmoji(skill.score) }}
                    </div>
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex justify-between items-end">
                      <div>
                        <h4 class="font-black text-slate-700 text-sm md:text-base leading-tight">{{ skill.name }}</h4>
                        <p class="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{{ getLessonSubtitle(skill.code) }}</p>
                      </div>
                      <div class="text-right">
                        <span class="text-2xl font-black tracking-tight" :class="getScoreColorText(skill.score)">{{ skill.score }}</span>
                        <span class="text-xs font-black text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3D Candy-bar progress -->
                <div class="h-4 bg-slate-100 border border-slate-200/20 rounded-full overflow-hidden shadow-inner relative mb-2">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden progress-fill-3d"
                       :class="getSkillBarClass(skill.code)"
                       :style="{ width: skill.score + '%' }">
                    <div class="absolute inset-0 shimmer"></div>
                    <div class="absolute inset-0 glossy-shine"></div>
                  </div>
                </div>

                <!-- Footer tip -->
                <div class="flex justify-between items-center px-1">
                  <span class="text-[11px] font-black italic tracking-wide" :class="getCommentColor(skill.score)">
                    🎯 Lời khuyên: {{ getSkillComment(skill.score) }}
                  </span>
                  
                  <!-- Stars visual indicators -->
                  <div class="flex gap-0.5">
                    <i v-for="n in 3" :key="n" class="fas fa-star text-[10px]"
                       :class="skill.score >= n * 33 ? 'text-yellow-400 animate-pulse' : 'text-slate-200'"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skill Empty State -->
            <div v-else class="h-64 flex flex-col items-center justify-center gap-4 text-center">
              <div class="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl shadow-inner">
                🎒
              </div>
              <div>
                <p class="font-black text-slate-700 text-base">Hành trang của bé còn trống</p>
                <p class="text-xs text-slate-400 font-bold mt-1">Bé hãy hoàn thành bài học đầu tiên để mở khóa nhé!</p>
              </div>
              <button class="kid-btn kid-btn-primary px-8 mt-2" @click="$router.push('/app')">
                Bắt đầu ngay thôi! 🚀
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <!-- ── 📝 NEW: ADVENTURE HISTORICAL LOGS (Timeline) ── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- Logs Card -->
        <div class="lg:col-span-2 glass-panel rounded-[2.5rem] p-8 border-2 border-white/80 animate-pop" style="animation-delay: 350ms">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-inner">
              📜
            </div>
            <div>
              <h2 class="font-black text-slate-800 text-lg leading-none">Nhật Ký Phiêu Lưu Gần Đây</h2>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Live Adventure Chronicle</p>
            </div>
          </div>

          <!-- Timeline log list -->
          <div v-if="store.reportData.recentLogs && store.reportData.recentLogs.length > 0" class="relative pl-6 border-l-2 border-dashed border-sky-200 space-y-6 my-2">
            <div v-for="(log, idx) in store.reportData.recentLogs" :key="idx" class="relative group">
              <!-- Timeline node -->
              <div class="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-white border-4 border-sky-400 flex items-center justify-center shadow group-hover:scale-125 transition-transform duration-300 z-10">
                <div class="w-1.5 h-1.5 rounded-full" :class="log.is_correct ? 'bg-emerald-500' : 'bg-orange-500'"></div>
              </div>

              <!-- Content card -->
              <div class="bg-white/50 border border-white hover:border-sky-200 hover:bg-white/80 p-4 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" 
                       :class="log.is_correct ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'">
                    {{ log.is_correct ? '✅' : '⚡' }}
                  </div>
                  <div>
                    <h4 class="font-black text-slate-700 text-sm">{{ log.lesson_type }}</h4>
                    <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{ formatDate(log.answered_at) }}</p>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-sm font-black text-slate-700">+{{ log.score }} ⭐</div>
                  <div class="text-[9px] font-black uppercase tracking-wider mt-0.5" 
                       :class="log.is_correct ? 'text-emerald-500' : 'text-orange-500'">
                    {{ log.is_correct ? 'Chính xác!' : 'Hoàn thành' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="h-44 flex flex-col items-center justify-center gap-3 text-center">
            <p class="text-4xl">📚</p>
            <p class="font-black text-slate-500 text-sm">Chưa có nhật ký hoạt động nào</p>
            <p class="text-xs text-slate-400">Nhật ký sẽ tự ghi khi bé chơi các trò chơi ở bản đồ.</p>
          </div>
        </div>

        <!-- ── Mascot Gold Medal (Motivation Board) ── -->
        <div class="glass-panel rounded-[2.5rem] p-8 border-2 border-white/80 animate-pop royal-banner flex flex-col justify-between items-center text-center relative overflow-hidden" style="animation-delay: 400ms">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-amber-400/5 to-transparent pointer-events-none"></div>
          
          <!-- Medal Container -->
          <div class="relative shrink-0 my-4 select-none">
            <!-- Sparkles -->
            <div class="absolute -top-4 -left-4 text-2xl animate-pulse">✨</div>
            <div class="absolute -bottom-2 -right-4 text-2xl animate-pulse" style="animation-delay: 0.8s">🌟</div>
            
            <div class="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-white flex items-center justify-center text-6xl shadow-2xl relative z-10 hover-rotate">
              🏅
            </div>
            
            <div class="absolute -bottom-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-xs shadow border-2 border-white">
              👑
            </div>
          </div>

          <!-- Message box -->
          <div class="flex-1 flex flex-col justify-center relative z-10 px-2 mt-2">
            <p class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Bằng Khen Danh Dự</p>
            <h3 class="text-xl font-black leading-tight text-slate-800 mt-2 mb-3">
              {{ getMotivationMessage() }}
            </h3>
            <p class="text-xs text-slate-500 font-bold leading-relaxed">
              "Ba mẹ ơi! Hôm nay bé học rất cừ khôi, ba mẹ hãy tặng bé một cái ôm thật ấm áp nhé!" 💛
            </p>
          </div>

          <!-- Badges indicators -->
          <div class="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-amber-100/50 relative z-10">
            <div class="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black text-amber-700">
              ⭐ {{ store.stars }} sao
            </div>
            <div class="bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black text-sky-700">
              🔥 {{ store.currentStreak }} ngày
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Chart as ChartJS, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Radar } from 'vue-chartjs';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';
import { useRouter } from 'vue-router';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const store = useProgressStore();
const router = useRouter();
const chartReady = ref(false);
const prevStars = ref(0);

const currentDate = new Date().toLocaleDateString('vi-VN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// ── COMPUTED ──

const totalLessonsCompleted = computed(() => {
  if (!store.reportData.skillData) return 0;
  return store.reportData.skillData.filter(s => s.score > 0).length;
});

const computedRadarData = computed(() => {
  const radarRaw = store.reportData.radarData;
  if (!radarRaw || radarRaw.length === 0) return null;
  return {
    labels: radarRaw.map(i => i.label),
    datasets: [{
      label: 'Thông thạo (%)',
      backgroundColor: 'rgba(139, 92, 246, 0.12)', // Lilac violet fill
      borderColor: '#8b5cf6', // Violet borders
      borderWidth: 3,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#8b5cf6',
      pointRadius: 5,
      pointHoverRadius: 7,
      data: radarRaw.map(i => i.score)
    }]
  };
});

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true, color: 'rgba(167, 139, 250, 0.25)' },
      grid: { color: 'rgba(167, 139, 250, 0.15)' },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { stepSize: 25, display: false },
      pointLabels: {
        font: { size: 10, family: "'Quicksand', sans-serif", weight: '900' },
        color: '#475569'
      }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(76, 29, 149, 0.9)', // Deep purple tooltip
      titleFont: { family: "'Quicksand', sans-serif", weight: '800', size: 12 },
      bodyFont: { family: "'Quicksand', sans-serif", weight: '600' },
      padding: 10,
      cornerRadius: 12,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.r}% thông thạo`
      }
    }
  }
};

// ── HELPERS ──

const getAccuracyColor = (v) => v >= 80 ? 'text-emerald-500' : v >= 50 ? 'text-sky-500' : 'text-orange-400';
const getAccuracyBadge = (v) => v >= 80 ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : v >= 50 ? 'bg-sky-100 text-sky-600 border border-sky-200' : 'bg-orange-100 text-orange-600 border border-orange-200';
const getAccuracyLabel = (v) => v >= 80 ? '🔥 Cực giỏi!' : v >= 50 ? '👍 Rất tốt!' : '💪 Cố lên nhé!';

const getScoreColorText = (s) => s >= 80 ? 'text-emerald-500' : s >= 50 ? 'text-sky-500' : 'text-orange-400';
const getScoreColorBg   = (s) => s >= 80 ? 'bg-emerald-400' : s >= 50 ? 'bg-sky-400' : 'bg-orange-400';
const getCommentColor   = (s) => s >= 80 ? 'text-emerald-600' : s >= 50 ? 'text-sky-600' : 'text-orange-500';

const getLevelPillClass = (s) =>
  s >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
  s >= 50 ? 'bg-sky-50 border-sky-200 text-sky-600'       :
  s  >  0 ? 'bg-orange-50 border-orange-200 text-orange-500'   : 'bg-slate-50 border-slate-200 text-slate-400';

const getLessonIcon = (code) => ({
  FLASHCARD: 'fa-images',
  CONTEXT:   'fa-book-reader',
  MATCHING:  'fa-puzzle-piece',
  TRAINING:  'fa-theater-masks',
  AI:        'fa-robot'
})[code] || 'fa-star';

const getLessonSubtitle = (code) => ({
  FLASHCARD: 'Nhận biết cảm xúc qua ảnh',
  CONTEXT:   'Hiểu cảm xúc qua ngữ cảnh',
  MATCHING:  'Nối cặp từ và biểu cảm',
  TRAINING:  'Luyện nét mặt trước camera',
  AI:        'Tương tác AI chấm điểm'
})[code] || 'Hoạt động phiêu lưu';

const getSkillBgClass = (code) => ({
  FLASHCARD: 'bg-gradient-to-br from-amber-300 to-yellow-400 text-white border-yellow-200',
  CONTEXT:   'bg-gradient-to-br from-sky-400 to-blue-500 text-white border-sky-200',
  MATCHING:  'bg-gradient-to-br from-pink-400 to-rose-500 text-white border-pink-200',
  TRAINING:  'bg-gradient-to-br from-violet-400 to-purple-500 text-white border-purple-200',
  AI:        'bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-emerald-200'
})[code] || 'bg-gradient-to-br from-slate-300 to-slate-450 text-white border-slate-200';

const getSkillBarClass = (code) => ({
  FLASHCARD: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400',
  CONTEXT:   'bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500',
  MATCHING:  'bg-gradient-to-r from-pink-400 via-rose-450 to-rose-500',
  TRAINING:  'bg-gradient-to-r from-violet-400 via-purple-400 to-purple-500',
  AI:        'bg-gradient-to-r from-emerald-400 via-teal-400 to-teal-500'
})[code] || 'bg-gradient-to-r from-slate-300 to-slate-400';

const getSkillEmoji = (s) => s >= 80 ? '⭐' : s >= 50 ? '🌸' : s > 0 ? '🌱' : '💤';
const getSkillComment = (s) => {
  if (s === 0) return 'Bé hãy thử sức bài này nhé.';
  if (s >= 80) return 'Tuyệt đỉnh! Bé đã làm chủ kỹ năng này.';
  if (s >= 50) return 'Tốt lắm, chỉ một xíu nữa là hoàn hảo!';
  return 'Chúng mình luyện tập thêm chút nhé!';
};

const getMotivationMessage = () => {
  const stars = store.stars;
  if (stars === 0) return 'Bé con ơi, đi tìm kho báu cảm xúc thôi! 🦖';
  if (stars < 10) return 'Bé đang có tiến bộ vô cùng kỳ diệu! ✨';
  if (stars < 30) return 'Bé đã tích lũy thật nhiều siêu năng lực! 🎉';
  return 'Bé đích thực là siêu anh hùng cảm xúc! 🌟';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${time} - ${date}`;
};

// ── LIFECYCLE ──
onMounted(async () => {
  store.loadUserInfo();
  prevStars.value = store.stars;
  await store.fetchReportData();
  chartReady.value = true;
});
</script>

<script>
export default {
  name: 'ReportView'
}
</script>

<style scoped>
/* ── Background ── */
.report-bg {
  background: linear-gradient(135deg, #f0f6ff 0%, #f7f9ff 40%, #f6f1ff 100%);
  min-height: 100vh;
}

/* ── Moving Clouds ── */
.cloud {
  position: fixed;
  font-size: 5rem;
  opacity: 0.15;
  filter: blur(2px);
  z-index: 0;
  animation: drift var(--duration, 60s) linear infinite;
  white-space: nowrap;
}
.cloud-1 { left: -10vw; }
.cloud-2 { left: -25vw; }
.cloud-3 { left: -15vw; }

@keyframes drift {
  from { transform: translateX(-10vw); }
  to   { transform: translateX(110vw); }
}

/* ── Star float ── */
.star-float {
  position: fixed;
  font-size: 1.5rem;
  opacity: 0.35;
  z-index: 0;
  animation: floatDrift 6s ease-in-out infinite;
}
@keyframes floatDrift {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50%       { transform: translateY(-15px) rotate(15deg) scale(1.15); }
}

/* ── 3D Glass panel ── */
.glass-panel {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 40px rgba(109, 40, 217, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* ── 🎈 HERO HEADER BANNER ── */
.header-banner {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.28), 
              0 2px 0 rgba(255,255,255,0.2) inset,
              0 -8px 0 rgba(0, 0, 0, 0.15) inset;
  border: 3px solid rgba(255,255,255,0.25);
}
.shadow-text {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
.bounce-slow {
  animation: gentleBounce 4s ease-in-out infinite;
}
@keyframes gentleBounce {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50%       { transform: translateY(-8px) rotate(1deg); }
}

/* ── 🏆 3D CLAYMOPHIC STATS ROW ── */
.stat-card {
  position: relative;
  background: #ffffff;
  border: 3px solid #f1f5f9;
  border-radius: 2.5rem;
  padding: 1.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
  overflow: hidden;
  box-shadow: 0 10px 0 #e2e8f0, 0 15px 30px rgba(148, 163, 184, 0.08);
}
.stat-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%);
  pointer-events: none;
}
.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 0 #cbd5e1, 0 20px 40px rgba(148, 163, 184, 0.15);
}
.stat-card:active {
  transform: translateY(4px);
  box-shadow: 0 6px 0 #e2e8f0;
}

/* Specific card accents */
.star-card-3d { border-color: #fde68a; }
.star-card-3d:hover { border-color: #fcd34d; }
.accuracy-card-3d { border-color: #bae6fd; }
.accuracy-card-3d:hover { border-color: #7dd3fc; }
.streak-card-3d { border-color: #fed7aa; }
.streak-card-3d:hover { border-color: #fdba74; }
.lesson-card-3d { border-color: #a7f3d0; }
.lesson-card-3d:hover { border-color: #6ee7b7; }

.stat-icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  box-shadow: 0 8px 16px rgba(0,0,0,0.06), inset 0 -4px 0 rgba(0,0,0,0.12);
  border: 2px solid rgba(255,255,255,0.3);
  color: white;
  transition: transform 0.3s;
}
.stat-card:hover .stat-icon-wrap {
  transform: rotate(10deg) scale(1.08);
}
.stat-val {
  font-size: 2.3rem;
  font-weight: 950;
  line-height: 1;
  margin-bottom: 0.35rem;
  letter-spacing: -0.03em;
}
.stat-lbl {
  font-size: 0.72rem;
  font-weight: 900;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.85rem;
}
.stat-pill {
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  letter-spacing: 0.04em;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
}

/* ── 🗺️ SKILL QUEST CARDS ── */
.skill-quest-card {
  background: rgba(255, 255, 255, 0.75);
  border: 2px solid #ffffff;
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 6px 15px rgba(100, 116, 139, 0.03);
  transition: all 0.3s ease;
}
.skill-quest-card:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 25px rgba(100, 116, 139, 0.08);
}

/* ── 🍬 CANDY BAR PROGRESS ── */
.progress-fill-3d {
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -4px 0 rgba(0,0,0,0.12);
  border: 1px solid rgba(255,255,255,0.1);
}
.glossy-shine {
  background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%);
  pointer-events: none;
}
.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmerMove 2.5s linear infinite;
}
@keyframes shimmerMove {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* ── 🎖️ MOTIVATION / ROYAL BANNER ── */
.royal-banner {
  background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #fef3c7 100%);
  border: 3px solid #fcd34d;
  box-shadow: 0 15px 35px rgba(251, 191, 36, 0.06), 0 8px 0 #fbbf24;
  transition: all 0.3s ease;
}
.royal-banner:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(251, 191, 36, 0.12), 0 12px 0 #fbbf24;
}
.hover-rotate:hover {
  transform: rotate(360deg) scale(1.1);
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── SCROLLBARS ── */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* ── ANIMS ── */
@keyframes popIn {
  0%   { opacity: 0; transform: scale(0.9) translateY(20px); }
  15%  { opacity: 0.2; }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-pop {
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
</style>