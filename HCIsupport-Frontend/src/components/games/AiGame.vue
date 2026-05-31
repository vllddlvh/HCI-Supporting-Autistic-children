<template>
  <div class="w-full max-w-6xl mx-auto p-2 animate-fade-in">
    
    <div class="text-center mb-6">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
        {{ data.instruction || "Quan sát và thể hiện cảm xúc nhé!" }}
      </h2>
      <p class="text-slate-500 text-lg">Hãy nhìn vào camera và bắt chước biểu cảm trong video</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
      
      <div class="lg:col-span-2 h-full flex flex-col gap-4">
        <div class="relative w-full flex-1 bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200">
          <iframe 
            v-if="data.videoThumbnail"
            class="w-full h-full object-cover"
            :src="data.videoThumbnail" 
            title="Video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
          <div v-else class="w-full h-full flex items-center justify-center text-white">
            Đang tải video...
          </div>
        </div>

        <div class="flex justify-center gap-4 h-12 shrink-0">
             <button class="kid-btn kid-btn-secondary px-6 text-slate-700 flex items-center gap-2">
               <i class="fas fa-redo"></i> Xem lại
             </button>
             <button @click="$emit('next', true)" class="kid-btn kid-btn-primary px-8 flex items-center gap-2">
               <i class="fas fa-check"></i> Hoàn thành
             </button>
        </div>
      </div>

      <div class="lg:col-span-1 h-full flex flex-col gap-4">
        
        <div class="h-[40%] bg-slate-800 rounded-3xl overflow-hidden shadow-lg border-4 border-slate-200 relative">
          <video id="user-camera" ref="videoRef" class="w-full h-full object-cover transform -scale-x-100" autoplay muted playsinline></video>
          <canvas ref="canvasRef" class="hidden"></canvas>
          
          <div class="absolute top-3 right-3 flex items-center gap-2 bg-black/40 px-2 py-1 rounded-md backdrop-blur">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-white text-[10px] font-bold tracking-widest">AI REC</span>
          </div>

          <div v-if="!isConnected" class="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
             <span class="text-white text-xs animate-pulse">Đang kết nối AI...</span>
          </div>
        </div>

        <div class="kid-card p-4 flex flex-col">
          
          <div class="flex justify-between items-center mb-2 border-b pb-2">
            <h3 class="font-bold text-slate-700 text-sm">📊 Cảm xúc Real-time</h3>
            <span class="text-xs font-bold" :class="isConnected ? 'text-green-600' : 'text-red-400'">
                {{ isConnected ? 'Online' : 'Offline' }}
            </span>
          </div>

          <div class="flex-1 flex items-end justify-between gap-2 px-1 pb-2">
            <div v-for="(value, key) in emotionStats" :key="key" class="flex flex-col items-center gap-1 flex-1 group h-full justify-end">
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{{ value }}%</span>
              
              <div class="w-full bg-slate-100 rounded-t-md relative overflow-hidden transition-all duration-500 ease-out" style="height: 100%">
                 <div 
                    class="absolute bottom-0 left-0 w-full rounded-t-md transition-all duration-300"
                    :class="getColorClass(key)"
                    :style="{ height: value + '%' }"
                 ></div>
              </div>

              <div class="text-center" :title="getLabel(key)">
                <div class="text-lg leading-none">{{ getEmoji(key) }}</div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 rounded-2xl p-3 text-center mt-auto border border-slate-100">
            <p class="text-xs text-slate-400">Cảm xúc chủ đạo</p>
            <p class="text-lg font-bold text-blue-600 capitalize animate-pulse">{{ currentDominantEmotion }}</p>
          </div>

        </div>

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
let analyzeInterval = null;

// State chứa dữ liệu cảm xúc thật (Initial = 0)
const emotionStats = ref({
  happy: 0, sad: 0, fear: 0, angry: 0, surprised: 0, disgust: 0
});

// Helper màu sắc & nhãn
const getColorClass = (key) => {
  const map = {
    happy: 'bg-green-500', sad: 'bg-blue-400', fear: 'bg-purple-500',
    angry: 'bg-red-500', surprised: 'bg-yellow-400', disgust: 'bg-emerald-700'
  };
  return map[key] || 'bg-slate-400';
};

const getEmoji = (key) => {
  const map = { happy: '😄', sad: '😢', fear: '😨', angry: '😡', surprised: '😲', disgust: '🤢' };
  return map[key];
};

const getLabel = (key) => {
  const map = { happy: 'Vui vẻ', sad: 'Buồn bã', fear: 'Sợ hãi', angry: 'Giận dữ', surprised: 'Ngạc nhiên', disgust: 'Ghê tởm' };
  return map[key];
};

// --- HÀM GỬI ẢNH LÊN PYTHON SERVER ---
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
      // GỌI API PYTHON (Port 5000)
      const response = await axios.post('http://localhost:5000/analyze', {
        image: imageData
      });

      if (response.data.status === 'success') {
        isConnected.value = true;
        emotionStats.value = response.data.emotions;
      } else {
        // console.log("Không tìm thấy khuôn mặt");
      }
    } catch (error) {
      console.error("Lỗi AI Server:", error);
      isConnected.value = false;
    }
  }
};

// Lifecycle
onMounted(() => {
  // 1. Mở Camera
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

const currentDominantEmotion = computed(() => {
  let maxKey = 'happy';
  let maxValue = -1;
  // Tìm key có value lớn nhất trong emotionStats
  for (const [key, value] of Object.entries(emotionStats.value)) {
    if (value > maxValue) { 
        maxValue = value; 
        maxKey = key; 
    }
  }
  return getLabel(maxKey);
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.hidden { display: none; }
</style>