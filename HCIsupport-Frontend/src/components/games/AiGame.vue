<template>
  <div class="w-full max-w-6xl mx-auto px-2 py-1 animate-fade-in font-quicksand select-none">
    
    <!-- Instruction Header -->
    <div class="text-center mb-3">
      <div class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full font-black text-xs border border-emerald-100 mb-1.5 shadow-sm">
        <i class="fas fa-robot"></i> Trạm Thử Thách Cảm Xúc AI
      </div>
      <h2 class="text-lg md:text-xl font-black text-slate-800 leading-snug">
        Bé hãy thể hiện lần lượt 3 cảm xúc đạt 90% trở lên để hoàn thành thử thách nhé!
      </h2>
    </div>

    <!-- Main Content Layout -->
    <div class="flex flex-col gap-4">

      <!-- TOP ROW: Video & Camera Side-by-Side -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Left: YouTube Video Card -->
        <div class="relative bg-slate-950 rounded-[2rem] overflow-hidden shadow-lg border-4 border-slate-100 h-[240px] flex flex-col justify-center">
          <iframe 
            v-if="embedUrl"
            class="w-full h-full"
            :src="embedUrl" 
            title="Video hướng dẫn" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-white/50 gap-2 bg-slate-900">
            <i class="fas fa-film text-3xl animate-pulse"></i>
            <span class="font-bold text-xs">Đang tải video...</span>
          </div>

          <!-- Video label badge -->
          <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
            🎬 Video Mẫu
          </div>
        </div>

        <!-- Right: Mirror (Camera Feed) with Glowing Border matching match progress -->
        <div 
          class="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg border-4 transition-all duration-500 h-[240px]"
          :class="glowBorderClass"
        >
          <video id="user-camera" ref="videoRef" class="w-full h-full object-cover transform -scale-x-100" autoplay muted playsinline></video>
          <canvas ref="canvasRef" class="hidden"></canvas>

          <!-- REC badge -->
          <div class="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm border border-red-500/30">
            <div class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-white text-[9px] font-black tracking-wider">🔴 GƯƠNG THẦN REC</span>
          </div>

          <!-- Connecting overlay -->
          <div v-if="!isConnected" class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 gap-2">
            <i class="fas fa-circle-notch fa-spin text-white text-2xl"></i>
            <span class="text-white text-[10px] font-bold animate-pulse">Gương thần đang kết nối...</span>
          </div>

          <!-- Camera label -->
          <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <i class="fas fa-smile-wink text-amber-300"></i> Bé Hãy Bắt Chước Nhé!
          </div>

          <!-- Match count badge -->
          <div v-if="isConnected" class="absolute bottom-3 right-3 bg-emerald-500 text-white text-[9.5px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <i class="fas fa-star"></i> Hoàn thành {{ completedCount }}/3
          </div>
        </div>

      </div>

      <!-- MIDDLE ROW: Interactive Magic Scoreboard -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <!-- Left: Checklist Challenges (lg:col-span-5) -->
        <div class="lg:col-span-5 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 rounded-[2rem] p-4 border-2 border-emerald-100/50 flex flex-col justify-between min-h-[150px] shadow-sm">
          
          <div class="flex items-center justify-between border-b border-emerald-100/50 pb-1.5">
            <span class="text-[10px] font-black text-emerald-800 uppercase tracking-wide">Thử thách cho bé</span>
            <span class="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              Tiến độ: {{ completedCount }}/3
            </span>
          </div>

          <!-- Interactive 3-part Checklist -->
          <div class="flex flex-col gap-2 my-2">
            <!-- 1. Vui vẻ -->
            <div 
              class="flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all"
              :class="checkedEmotions.happy ? 'bg-emerald-100/50 border-emerald-300' : 'bg-white border-slate-100'"
            >
              <div class="flex items-center gap-2">
                <span class="text-xl">😄</span>
                <span class="text-xs font-black text-slate-700">Vui vẻ (>= 80%)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] font-bold text-slate-400" v-if="!checkedEmotions.happy">Hiện tại: {{ emotionStats.happy }}%</span>
                <span v-if="checkedEmotions.happy" class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black animate-bounce">✓</span>
                <span v-else class="w-5 h-5 rounded-full border-2 border-slate-200 bg-slate-50"></span>
              </div>
            </div>

            <!-- 2. Buồn bã -->
            <div 
              class="flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all"
              :class="checkedEmotions.sad ? 'bg-emerald-100/50 border-emerald-300' : 'bg-white border-slate-100'"
            >
              <div class="flex items-center gap-2">
                <span class="text-xl">😢</span>
                <span class="text-xs font-black text-slate-700">Buồn bã (>= 80%)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] font-bold text-slate-400" v-if="!checkedEmotions.sad">Hiện tại: {{ emotionStats.sad }}%</span>
                <span v-if="checkedEmotions.sad" class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black animate-bounce">✓</span>
                <span v-else class="w-5 h-5 rounded-full border-2 border-slate-200 bg-slate-50"></span>
              </div>
            </div>

            <!-- 3. Giận dữ -->
            <div 
              class="flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all"
              :class="checkedEmotions.angry ? 'bg-emerald-100/50 border-emerald-300' : 'bg-white border-slate-100'"
            >
              <div class="flex items-center gap-2">
                <span class="text-xl">😡</span>
                <span class="text-xs font-black text-slate-700">Giận dữ (>= 80%)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] font-bold text-slate-400" v-if="!checkedEmotions.angry">Hiện tại: {{ emotionStats.angry }}%</span>
                <span v-if="checkedEmotions.angry" class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black animate-bounce">✓</span>
                <span v-else class="w-5 h-5 rounded-full border-2 border-slate-200 bg-slate-50"></span>
              </div>
            </div>
          </div>

          <!-- Encouraging kid-friendly message -->
          <div class="text-[10px] font-black text-center" :class="messageColorClass">
            {{ matchFeedbackMessage }}
          </div>
        </div>

        <!-- Right: All Emotions Breakdown (lg:col-span-7) -->
        <div class="lg:col-span-7 bg-white rounded-[2rem] p-4 shadow-sm border-2 border-slate-100 flex flex-col justify-between min-h-[150px]">
          <div class="border-b border-slate-100 pb-1.5 flex justify-between items-center">
            <h3 class="font-black text-slate-700 text-[10px] uppercase tracking-wide flex items-center gap-1.5">
              <span class="w-5 h-5 bg-amber-100 rounded flex items-center justify-center text-amber-600 text-[10px]"><i class="fas fa-chart-bar"></i></span>
              Bảng theo dõi cảm xúc
            </h3>
            <span class="text-[9px] font-black px-2 py-0.5 rounded-full" :class="isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-400'">
              {{ isConnected ? '● Kết nối' : '● Mất kết nối' }}
            </span>
          </div>

          <!-- Emotion items -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 py-2">
            <div 
              v-for="(value, key) in emotionStats" 
              :key="key" 
              class="flex items-center gap-2 px-2 py-1 rounded-xl transition hover:bg-slate-50"
              :class="isKeyInChallenge(key) ? 'bg-emerald-50/50 border border-emerald-100/30' : ''"
            >
              <div class="text-xl shrink-0 leading-none">{{ getEmoji(key) }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-[9px] font-black text-slate-500 mb-0.5">
                  <span class="truncate capitalize" :class="isKeyInChallenge(key) ? 'text-emerald-700 font-extrabold' : ''">
                    {{ getLabel(key) }}
                  </span>
                  <span>{{ value }}%</span>
                </div>
                <div class="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-300"
                    :class="getColorClass(key)"
                    :style="{ width: value + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- BOTTOM ROW: Action Buttons -->
      <div class="flex justify-center gap-4 mt-1.5 pb-1">
        <button @click="resetChallenge" class="bg-white hover:bg-slate-50 text-slate-600 px-6 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 shadow-sm active:scale-95">
          <i class="fas fa-redo"></i> Xem lại / Làm lại
        </button>
        <button 
          @click="$emit('next', true)" 
          :disabled="completedCount < 3"
          class="px-8 py-2.5 rounded-2xl font-black text-xs shadow-md transition active:scale-95 flex items-center gap-2 border-b-4"
          :class="completedCount === 3 ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700' : 'bg-slate-250 text-slate-400 border-slate-400 cursor-not-allowed'"
        >
          <i class="fas fa-check-circle"></i> Hoàn thành
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';

const props = defineProps(['data']);
const emit = defineEmits(['next']);

const videoRef = ref(null);
const canvasRef = ref(null);
const isConnected = ref(false);
const hasFinished = ref(false);
let analyzeInterval = null;

// ========== YOUTUBE EMBED PARSER ==========
const embedUrl = computed(() => {
  const url = props.data?.videoThumbnail;
  if (!url) return '';
  if (url.includes('/embed/')) return url;

  let videoId = '';
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) videoId = shortsMatch[1];

  if (!videoId) {
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) videoId = watchMatch[1];
  }

  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
});

// MULTI-EMOTION CHALLENGE CHECKLIST STATE
const checkedEmotions = ref({
  happy: false,
  sad: false,
  angry: false
});

const completedCount = computed(() => {
  let count = 0;
  if (checkedEmotions.value.happy) count++;
  if (checkedEmotions.value.sad) count++;
  if (checkedEmotions.value.angry) count++;
  return count;
});

const isKeyInChallenge = (key) => {
  return ['happy', 'sad', 'angry'].includes(key);
};

// Realtime interactive borders & texts based on challenge completion
const glowBorderClass = computed(() => {
  if (!isConnected.value) return 'border-slate-100';
  if (completedCount.value === 0) return 'border-slate-200';
  if (completedCount.value === 1) return 'border-amber-400/70 shadow-md shadow-amber-400/10';
  if (completedCount.value === 2) return 'border-teal-400/80 shadow-md shadow-teal-400/20';
  return 'border-emerald-500 shadow-xl shadow-emerald-400/30 animate-pulse';
});

const matchFeedbackMessage = computed(() => {
  if (!isConnected.value) return 'Gương thần đang kết nối phép thuật... ✨';
  if (completedCount.value === 0) return 'Hãy cười thật tươi (Vui vẻ) để bắt đầu nào! 😄';
  if (completedCount.value === 1) return 'Bé giỏi quá! Hãy khóc thử (Buồn bã) hoặc giận dữ nữa nào! 💪';
  if (completedCount.value === 2) return 'Chỉ còn 1 biểu cảm cuối cùng thôi, cố lên bé yêu! 🔥';
  return 'Xuất sắc! Cả 3 thử thách đã hoàn thành hoàn hảo! 🏆✨';
});

const messageColorClass = computed(() => {
  if (!isConnected.value) return 'text-slate-405';
  if (completedCount.value === 0) return 'text-sky-500';
  if (completedCount.value === 1) return 'text-amber-600';
  if (completedCount.value === 2) return 'text-teal-600';
  return 'text-emerald-600 font-extrabold animate-bounce';
});

const emotionStats = ref({
  happy: 0, sad: 0, fear: 0, angry: 0, surprised: 0, disgust: 0
});

const getColorClass = (key) => {
  const map = {
    happy: 'bg-green-400', sad: 'bg-blue-400', fear: 'bg-purple-400',
    angry: 'bg-red-400', surprised: 'bg-yellow-400', disgust: 'bg-emerald-600'
  };
  return map[key] || 'bg-slate-400';
};

const getEmoji = (key) => {
  const map = { happy: '😄', sad: '😢', fear: '😨', angry: '😡', surprised: '😲', disgust: '🤢' };
  return map[key] || '❓';
};

const getLabel = (key) => {
  const map = { happy: 'Vui vẻ', sad: 'Buồn bã', fear: 'Sợ hãi', angry: 'Giận dữ', surprised: 'Ngạc nhiên', disgust: 'Ghê tởm' };
  return map[key] || key;
};

const resetChallenge = () => {
  checkedEmotions.value = { happy: false, sad: false, angry: false };
  hasFinished.value = false;
};

const analyzeFrame = async () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.6);

    try {
      const response = await axios.post('http://localhost:5001/analyze', {
        image: imageData
      });
      if (response.data.status === 'success') {
        isConnected.value = true;
        emotionStats.value = response.data.emotions;

        // CHECKLIST MATCH LOGIC (Each emotion hits >= 80%)
        if (emotionStats.value.happy >= 80) {
          checkedEmotions.value.happy = true;
        }
        if (emotionStats.value.sad >= 80) {
          checkedEmotions.value.sad = true;
        }
        if (emotionStats.value.angry >= 80) {
          checkedEmotions.value.angry = true;
        }

        // Auto transition when all 3 checked
        if (checkedEmotions.value.happy && checkedEmotions.value.sad && checkedEmotions.value.angry) {
          if (!hasFinished.value) {
            hasFinished.value = true;
            setTimeout(() => {
              emit('next', true);
            }, 1800);
          }
        }
      }
    } catch (error) {
      console.error("Lỗi AI Server:", error);
      isConnected.value = false;
    }
  }
};

onMounted(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if(videoRef.value) videoRef.value.srcObject = stream;
    }).catch(e => console.log("Lỗi camera:", e));
  }
  analyzeInterval = setInterval(analyzeFrame, 500);
});

onUnmounted(() => {
  if(analyzeInterval) clearInterval(analyzeInterval);
  const videoEl = videoRef.value;
  if (videoEl && videoEl.srcObject) {
    videoEl.srcObject.getTracks().forEach(t => t.stop());
  }
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.hidden { display: none; }
</style>