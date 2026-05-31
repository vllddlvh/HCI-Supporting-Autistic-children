<template>
  <div class="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start animate-fade-in min-h-[500px]">
    
    <div class="w-full lg:w-1/3 flex flex-col items-center text-center space-y-4">
      <div class="kid-card p-4 w-full">
        <h3 class="text-lg font-bold text-blue-600 mb-2">🎥 Hướng dẫn</h3>
        <div class="aspect-square rounded-2xl overflow-hidden border-4 border-yellow-300 shadow-sm mb-3 relative group">
           <img :src="data.guideImage || data.image || data.video_url" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" alt="Guide">
        </div>
        <p class="text-slate-600 font-bold text-lg">
            Hãy làm mặt: <span class="text-blue-600 uppercase">"{{ targetEmotionName }}"</span>
        </p>
      </div>
    </div>

    <div class="w-full lg:w-2/3 flex flex-col gap-4">
      
      <div class="relative bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-slate-200 aspect-[4/3]">
        <video v-show="!capturedImage" ref="videoRef" class="w-full h-full object-cover transform -scale-x-100" autoplay muted playsinline></video>
        <img v-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover transform -scale-x-100" />
        <canvas ref="canvasRef" class="hidden"></canvas>

        <div v-if="isAnalyzing" class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 backdrop-blur-sm">
          <div class="animate-spin text-5xl mb-4">✨</div>
          <p class="font-bold text-xl animate-pulse">AI đang nhìn kỹ...</p>
        </div>
      </div>

      <div class="flex justify-center items-center gap-6">
        <div v-if="!capturedImage" class="relative group">
           <button @click="takePhoto" :disabled="isAnalyzing" class="w-20 h-20 bg-white/90 rounded-full border-4 border-slate-200 flex items-center justify-center shadow-lg active:scale-90 transition group-hover:border-sky-400">
             <div class="w-16 h-16 bg-red-500 rounded-full border-4 border-white group-hover:bg-red-600 transition"></div>
           </button>
           <p class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-slate-400 font-bold text-sm whitespace-nowrap">Bấm để chụp</p>
        </div>

        <div v-else class="flex gap-4 w-full">
           <button @click="resetCamera" class="flex-1 kid-btn kid-btn-secondary text-slate-700">
             <i class="fas fa-redo mr-2"></i> Chụp lại
           </button>
           
           <button v-if="aiResult && aiResult.isMatch" @click="$emit('next', true)" class="flex-1 kid-btn kid-btn-primary">
             Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
           </button>
        </div>
      </div>

      <div v-if="aiResult" class="kid-card rounded-2xl p-6 border-2 animate-slide-up" 
           :class="aiResult.isMatch ? 'border-green-400 bg-green-50' : 'border-orange-200'">
        <div class="flex items-start gap-4">
          <div class="text-5xl animate-bounce">{{ aiResult.emoji }}</div>
          <div class="flex-1">
            <h4 class="font-extrabold text-xl mb-1" :class="aiResult.isMatch ? 'text-green-600' : 'text-orange-500'">
              {{ aiResult.isMatch ? 'Chính xác!' : 'Cố lên nhé!' }}
            </h4>
            <p class="text-slate-700 font-bold text-lg mb-2">"{{ aiResult.message }}"</p>
            <p v-if="aiResult.isMatch" class="text-sm text-green-600 font-bold italic animate-pulse mt-2">
                <i class="fas fa-spinner fa-spin mr-2"></i> Đang chuyển bài tiếp theo...
            </p>
            <div v-if="aiResult.tip && !aiResult.isMatch" class="bg-white/60 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 flex items-center gap-2">
              <i class="fas fa-lightbulb text-yellow-500"></i>
              Gợi ý: {{ aiResult.tip }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';

// props.data chính là dòng dữ liệu từ bảng lesson_training_ai lấy từ DB
const props = defineProps(['data']);
const emit = defineEmits(['next']);

const videoRef = ref(null);
const canvasRef = ref(null);
const capturedImage = ref(null);
const isAnalyzing = ref(false);
const aiResult = ref(null);

const targetEmotionName = computed(() => {
    if (props.data && props.data.emotion_name) {
        return props.data.emotion_name;
    }
    if (props.data && props.data.target_emotion_name) {
        return props.data.target_emotion_name;
    }
    console.warn("⚠️ Thiếu emotion_name trong props data!", props.data);
    return "cảm xúc này"; 
});

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) videoRef.value.srcObject = stream;
  } catch (err) {
    console.error("Lỗi camera:", err);
    alert("Không thể mở camera. Hãy kiểm tra quyền truy cập!");
  }
};

onMounted(() => {
  startCamera();
});

onUnmounted(() => {
  if (videoRef.value && videoRef.value.srcObject) {
    videoRef.value.srcObject.getTracks().forEach(track => track.stop());
  }
});

const takePhoto = async () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageBase64 = canvas.toDataURL('image/png');
  capturedImage.value = imageBase64;

  await analyzeImage(imageBase64);
};

const analyzeImage = async (imageBase64) => {
  isAnalyzing.value = true;
  aiResult.value = null;

  try {
    const response = await axios.post('http://localhost:3000/api/gemini/analyze', {
      imageBase64: imageBase64,
      targetEmotion: targetEmotionName.value // 🔥 Gửi tên cảm xúc lấy từ DB lên
    });

    const data = response.data;
    
    aiResult.value = {
        isMatch: data.isMatch,
        emoji: data.emoji || '😐',
        message: data.message,
        tip: data.tip
    };

    if (data.isMatch) {
        setTimeout(() => {
            emit('next', true); 
        }, 2000);
    }

  } catch (error) {
    console.error("Lỗi phân tích AI:", error);
    aiResult.value = {
        isMatch: false,
        emoji: '⚠️',
        message: "Có lỗi kết nối. Con thử lại nhé!",
        tip: "Kiểm tra mạng internet của con."
    };
  } finally {
    isAnalyzing.value = false;
  }
};

// 4. RESET
const resetCamera = () => {
  capturedImage.value = null;
  aiResult.value = null;
};
</script>

<style scoped>
.animate-slide-up { animation: slideUp 0.5s ease-out; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>