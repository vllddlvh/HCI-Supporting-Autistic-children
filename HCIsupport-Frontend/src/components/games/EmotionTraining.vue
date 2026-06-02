<template>
  <div class="w-full max-w-5xl mx-auto px-2 py-1 animate-fade-in font-quicksand select-none">
    
    <!-- Instruction Header -->
    <div class="text-center mb-4">
      <div class="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3.5 py-1 rounded-full font-black text-xs border border-amber-100 mb-1.5 shadow-sm">
        <i class="fas fa-magic"></i> Thử Thách Gương Thần AI
      </div>
      <h2 class="text-lg md:text-xl font-black text-slate-800 leading-snug">
        Quan sát hình mẫu và bắt chước biểu cảm để Gương Thần chấm điểm nhé!
      </h2>
    </div>

    <!-- Main Workspace: Side-by-side on desktop -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      
      <!-- LEFT COLUMN: Instruction Guide (lg:col-span-5) -->
      <div class="lg:col-span-5 bg-white rounded-[2.5rem] p-5 shadow-lg border-2 border-amber-100/50 flex flex-col justify-between h-[360px]">
        
        <!-- Header -->
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <span class="w-7 h-7 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-xs">
            <i class="fas fa-lightbulb"></i>
          </span>
          <span class="font-black text-slate-700 text-sm">Hình Ảnh Hướng Dẫn</span>
        </div>

        <!-- Guide Image with Polaroid/Claymorphic look -->
        <div class="flex-1 flex items-center justify-center py-4">
          <div class="w-[180px] h-[180px] bg-slate-50 p-2.5 rounded-[1.8rem] border-4 border-amber-200/60 shadow-md relative group overflow-hidden">
            <img 
              :src="data.guideImage || data.image || data.video_url" 
              class="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition duration-500" 
              alt="Guide"
            >
          </div>
        </div>

        <!-- Target Emotion Display Box -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 text-center border border-amber-150/40">
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cảm xúc cần làm</p>
          <p class="text-xl font-black text-amber-700 capitalize mt-0.5 animate-pulse">
             "{{ targetEmotionName }}"
          </p>
        </div>
      </div>

      <!-- RIGHT COLUMN: Camera and AI Scanner (lg:col-span-7) -->
      <div class="lg:col-span-7 flex flex-col gap-4 h-[360px]">
        
        <!-- Live Camera / Image Viewer Card -->
        <div class="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-slate-100 flex-1 flex items-center justify-center">
          
          <video 
            v-show="!capturedImage" 
            ref="videoRef" 
            class="w-full h-full object-cover transform -scale-x-100" 
            autoplay muted playsinline
          ></video>
          
          <img 
            v-if="capturedImage" 
            :src="capturedImage" 
            class="w-full h-full object-cover transform -scale-x-100" 
            alt="Bé đã chụp"
          />
          
          <canvas ref="canvasRef" class="hidden"></canvas>

          <!-- Scanning Line Effect when analyzing -->
          <div v-if="isAnalyzing" class="absolute left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-10 animate-scan"></div>

          <!-- Connecting / Analyzing overlay -->
          <div v-if="isAnalyzing" class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 backdrop-blur-sm gap-2">
            <i class="fas fa-magic fa-spin text-4xl text-cyan-400"></i>
            <p class="font-black text-base animate-pulse">Gương thần đang nhìn thật kỹ nhé... ✨</p>
          </div>

          <!-- Video source badge badge -->
          <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="capturedImage ? 'bg-amber-400' : 'bg-red-500 animate-pulse'"></span>
            {{ capturedImage ? 'Ảnh Đã Chụp' : 'Gương Thần Trực Tiếp' }}
          </div>
        </div>

        <!-- Camera Control Bar / Snapshot Action -->
        <div class="flex justify-center items-center py-1">
          
          <!-- Large Shutter Button -->
          <div v-if="!capturedImage" class="flex flex-col items-center gap-1">
            <button 
              @click="takePhoto" 
              :disabled="isAnalyzing" 
              class="w-16 h-16 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-90 transition group hover:border-red-400"
            >
              <div class="w-12 h-12 bg-red-500 rounded-full border-4 border-white group-hover:bg-red-600 transition shadow-inner"></div>
            </button>
            <p class="text-slate-400 font-black text-[10px] uppercase tracking-wider mt-1">Bấm để chụp</p>
          </div>

          <!-- Retake Actions -->
          <div v-else class="flex gap-4 w-full">
            <button @click="resetCamera" class="flex-1 bg-white hover:bg-slate-50 text-slate-600 font-black py-2.5 rounded-2xl border-2 border-slate-200 transition shadow-sm active:scale-95 text-xs flex items-center justify-center gap-2">
              <i class="fas fa-redo"></i> Chụp lại ảnh khác
            </button>
            <button v-if="aiResult && aiResult.isMatch" @click="$emit('next', true)" class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-2xl transition shadow-md border-b-4 border-emerald-700 active:scale-95 text-xs flex items-center justify-center gap-2">
              Tiếp tục bài học <i class="fas fa-arrow-right"></i>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- AI RESULT FEEDBACK PANEL -->
    <div v-if="aiResult" class="mt-4 bg-white rounded-[2rem] p-4 shadow-md border-2 animate-slide-up" 
         :class="aiResult.isMatch ? 'border-emerald-300 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/20'">
      <div class="flex items-start gap-4">
        <div class="text-4xl animate-bounce shrink-0 leading-none">{{ aiResult.emoji }}</div>
        <div class="flex-1">
          <h4 class="font-black text-base mb-0.5" :class="aiResult.isMatch ? 'text-emerald-700' : 'text-amber-700'">
            {{ aiResult.isMatch ? 'Chúc mừng con! 🎉' : 'Cố lên bé yêu! 💪' }}
          </h4>
          <p class="text-slate-700 font-bold text-xs leading-relaxed">"{{ aiResult.message }}"</p>
          
          <p v-if="aiResult.isMatch" class="text-[10px] text-emerald-600 font-black italic mt-1.5 flex items-center gap-1.5">
            <i class="fas fa-circle-notch fa-spin"></i> Đang tự chuyển sang câu tiếp theo...
          </p>
          
          <div v-if="aiResult.tip && !aiResult.isMatch" class="bg-white text-slate-600 px-3 py-1.5 rounded-xl text-[10.5px] font-bold border border-amber-100 flex items-center gap-2 mt-2 shadow-xs">
            <i class="fas fa-lightbulb text-yellow-500 text-xs"></i>
            Gợi ý: {{ aiResult.tip }}
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
    return "cảm xúc này"; 
});

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) videoRef.value.srcObject = stream;
  } catch (err) {
    console.error("Lỗi camera:", err);
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
      targetEmotion: targetEmotionName.value
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
        }, 2200);
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

const resetCamera = () => {
  capturedImage.value = null;
  aiResult.value = null;
};
</script>

<style scoped>
.animate-slide-up { animation: slideUp 0.5s ease-out; }
@keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* Scanner laser line animation */
@keyframes scanEffect {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
.animate-scan {
  animation: scanEffect 2s linear infinite;
}
</style>