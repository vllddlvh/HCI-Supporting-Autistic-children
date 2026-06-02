<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50">
    <Sidebar />

    <div class="max-w-4xl mx-auto px-6 pb-20">

      <div class="mb-6">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <i class="fas fa-smile text-rose-400"></i> Kiểm tra cảm xúc
        </h2>
        <p class="text-slate-500 text-sm mt-1">
          Nhìn vào camera — AI sẽ nhận diện cảm xúc của bạn theo thời gian thực.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Camera feed -->
        <div class="bg-slate-800 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-200 relative aspect-video">
          <video ref="videoRef"
                 class="w-full h-full object-cover transform -scale-x-100"
                 autoplay muted playsinline/>
          <canvas ref="canvasRef" class="hidden"/>

          <!-- REC badge -->
          <div class="absolute top-3 right-3 flex items-center gap-2 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
            <span class="text-white text-[10px] font-bold tracking-widest">AI REC</span>
          </div>

          <!-- Offline overlay -->
          <div v-if="!isConnected"
               class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-2">
            <i class="fas fa-circle-notch fa-spin text-white text-2xl"/>
            <span class="text-white text-sm">Đang kết nối AI...</span>
          </div>
        </div>

        <!-- Emotion bars + dominant -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">

          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-700 flex items-center gap-2">
              <i class="fas fa-chart-bar text-rose-400"/>
              Cảm xúc Real-time
            </h3>
            <span class="text-xs font-bold px-2 py-1 rounded-full"
                  :class="isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'">
              {{ isConnected ? '● Online' : '● Offline' }}
            </span>
          </div>

          <!-- Bar chart -->
          <div class="flex items-end justify-between gap-3 flex-1" style="min-height:160px">
            <div v-for="(value, key) in emotionStats" :key="key"
                 class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
              <span class="text-[11px] font-bold text-slate-400">{{ value }}%</span>
              <div class="w-full bg-slate-100 rounded-t-lg relative overflow-hidden" style="height:120px">
                <div class="absolute bottom-0 left-0 w-full rounded-t-lg transition-all duration-300"
                     :class="getColorClass(key)"
                     :style="{ height: value + '%' }"/>
              </div>
              <div class="text-xl leading-none" :title="getLabel(key)">{{ getEmoji(key) }}</div>
              <span class="text-[10px] text-slate-400 font-medium">{{ getLabel(key) }}</span>
            </div>
          </div>

          <!-- Dominant emotion -->
          <div class="bg-slate-50 rounded-2xl p-4 text-center">
            <p class="text-xs text-slate-400 mb-1">Cảm xúc chủ đạo</p>
            <p class="text-2xl font-extrabold text-rose-500">
              {{ dominantEmoji }} {{ dominantLabel }}
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';

const videoRef  = ref(null);
const canvasRef = ref(null);
const isConnected = ref(false);
let analyzeInterval = null;

const emotionStats = ref({
  happy: 0, sad: 0, fear: 0, angry: 0, surprised: 0, disgust: 0,
});

const getColorClass = (key) => ({
  happy: 'bg-green-400', sad: 'bg-blue-400', fear: 'bg-purple-500',
  angry: 'bg-red-500', surprised: 'bg-yellow-400', disgust: 'bg-emerald-600',
})[key] ?? 'bg-slate-400';

const getEmoji = (key) => ({
  happy: '😄', sad: '😢', fear: '😨', angry: '😡', surprised: '😲', disgust: '🤢',
})[key] ?? '❓';

const getLabel = (key) => ({
  happy: 'Vui vẻ', sad: 'Buồn bã', fear: 'Sợ hãi',
  angry: 'Giận dữ', surprised: 'Ngạc nhiên', disgust: 'Ghê tởm',
})[key] ?? key;

const dominantKey = computed(() => {
  let best = 'happy', bestVal = -1;
  for (const [k, v] of Object.entries(emotionStats.value)) {
    if (v > bestVal) { bestVal = v; best = k; }
  }
  return best;
});
const dominantEmoji = computed(() => getEmoji(dominantKey.value));
const dominantLabel = computed(() => getLabel(dominantKey.value));

const analyzeFrame = async () => {
  if (!videoRef.value || !canvasRef.value) return;
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  try {
    const res = await axios.post('http://localhost:5000/analyze', {
      image: canvas.toDataURL('image/jpeg', 0.6),
    });
    if (res.data.status === 'success') {
      isConnected.value  = true;
      emotionStats.value = res.data.emotions;
    }
  } catch {
    isConnected.value = false;
  }
};

onMounted(() => {
  navigator.mediaDevices?.getUserMedia({ video: true })
    .then(stream => { if (videoRef.value) videoRef.value.srcObject = stream; })
    .catch(e => console.warn('Camera error:', e));
  analyzeInterval = setInterval(analyzeFrame, 500);
});

onUnmounted(() => {
  clearInterval(analyzeInterval);
  videoRef.value?.srcObject?.getTracks().forEach(t => t.stop());
});
</script>
