<template>
  <div class="w-full max-w-4xl mx-auto relative min-h-[400px]">
    
    <Transition name="bounce" mode="out-in">
      <div :key="question.id" class="w-full flex flex-col gap-6 pt-4 pb-2">
        
        <!-- Story Card -->
        <div class="relative w-full max-w-3xl mx-auto group z-20">
          <!-- Background Decoration -->
          <div class="absolute inset-0 bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 rounded-3xl rotate-2 group-hover:rotate-3 transition-transform duration-500 shadow-lg z-0"></div>
          
          <!-- Main Card -->
          <div class="relative bg-white p-5 md:p-6 rounded-3xl shadow-md border-[4px] border-white transform -rotate-1 group-hover:rotate-0 transition-transform duration-500 z-10 flex flex-col gap-3">
            
            <!-- Cute Quote Icon -->
            <div class="absolute -top-5 -left-4 w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-md border-[3px] border-white rotate-12 z-20">
              <i class="fas fa-quote-left text-white text-xl"></i>
            </div>
            
            <p class="text-lg md:text-xl text-slate-700 font-bold leading-relaxed indent-6">
              {{ question.story }}
            </p>

            <div class="flex justify-end mt-1">
                <button @click="playStory" class="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black text-base flex items-center gap-2 px-5 py-2 rounded-full shadow-md border-[3px] border-white hover:scale-105 active:scale-95 transition-all group/audio">
                  <i class="fas fa-volume-up text-xl group-hover/audio:animate-bounce"></i> Nghe kể chuyện
                </button>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col items-center relative z-10">
          
          <!-- Question Title -->
          <div class="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-4 border-[3px] border-white inline-block transform -rotate-1">
            <h3 class="text-xl md:text-2xl font-black text-rose-500 text-center flex items-center gap-2">
              <span class="text-2xl animate-pulse">🤔</span>
              {{ question.question }}
              <span class="text-2xl animate-pulse">❓</span>
            </h3>
          </div>

          <!-- Options Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl px-2">
            <button 
              v-for="(opt, index) in question.options" 
              :key="opt"
              @click="checkAnswer(opt)"
              :disabled="isProcessing"
              class="relative overflow-hidden group py-4 px-5 rounded-2xl font-black text-lg md:text-xl transition-all duration-300 flex items-center justify-between disabled:cursor-default active:mt-1"
              :class="getButtonClass(opt, index)"
            >
              <!-- Background Decoration -->
              <div class="absolute -left-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-md group-hover:scale-150 transition-transform"></div>
              <div class="absolute -right-4 -bottom-4 w-12 h-12 bg-white/10 rounded-full blur-lg group-hover:scale-150 transition-transform delay-100"></div>
              
              <span class="relative z-10 drop-shadow-sm tracking-wide">{{ opt }}</span>
              <span class="text-4xl md:text-5xl relative z-10 drop-shadow-md group-hover:scale-110 transition-transform origin-bottom">
                  {{ getEmoji(opt) }}
              </span>
            </button>
          </div>

        </div>

      </div>
    </Transition>

    <div v-if="showSuccessFeedback" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none whitespace-nowrap">
       <div class="bg-green-500 text-white text-3xl md:text-5xl font-black px-12 py-6 rounded-[3rem] shadow-[0_20px_40px_rgba(34,197,94,0.4)] border-8 border-white flex items-center gap-4 animate-feedback-pop">
         <span>Chính xác!</span> <i class="fas fa-star text-yellow-300 animate-spin-slow text-5xl"></i>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['next']);

const isProcessing = ref(false);
const selectedOpt = ref(null);
const showSuccessFeedback = ref(false);

const question = computed(() => props.data);

const getEmoji = (text) => {
    if (text.includes('Vui')) return '😄';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😱';
    if (text.includes('Ngạc')) return '😲';
    if (text.includes('Ghê')) return '🤢';
    return '🤔';
}

const colors = [
  'bg-emerald-400 text-white border-b-[6px] border-emerald-600 hover:bg-emerald-300 hover:border-emerald-500',
  'bg-sky-400 text-white border-b-[6px] border-sky-600 hover:bg-sky-300 hover:border-sky-500',
  'bg-amber-400 text-white border-b-[6px] border-amber-600 hover:bg-amber-300 hover:border-amber-500',
  'bg-rose-400 text-white border-b-[6px] border-rose-600 hover:bg-rose-300 hover:border-rose-500'
];

const getButtonClass = (opt, index) => {
    if (selectedOpt.value && opt === question.value.correct) {
        return "bg-green-500 text-white border-b-[6px] border-green-700 scale-105 shadow-[0_0_30px_rgba(34,197,94,0.6)] z-10 animate-bounce"; 
    }

    if (selectedOpt.value === opt && opt !== question.value.correct) {
        return "bg-red-500 text-white border-b-0 translate-y-1 opacity-80 scale-95"; 
    }

    if (selectedOpt.value) {
        return "bg-slate-200 text-slate-400 border-b-[3px] border-slate-300 opacity-50 scale-95 grayscale-[50%]"; 
    }
    
    return `${colors[index % colors.length]} hover:-translate-y-1 active:translate-y-1 active:border-b-0`; 
}

const checkAnswer = (opt) => {
    if (isProcessing.value) return; 

    selectedOpt.value = opt;
    isProcessing.value = true; 

    if (opt === question.value.correct) {
        showSuccessFeedback.value = true;
        setTimeout(() => {
            emit('next', true); 
            resetState();
        }, 1500);
    } else {
        setTimeout(() => {
            emit('next', false); 
            resetState();
        }, 1500);
    }
}

const resetState = () => {
    isProcessing.value = false;
    selectedOpt.value = null;
    showSuccessFeedback.value = false;
}

const playStory = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); 
    const speech = new SpeechSynthesisUtterance(question.value.story);
    speech.lang = 'vi-VN';
    speech.rate = 0.9; 
    window.speechSynthesis.speak(speech);
  } else {
    alert("Trình duyệt của bạn không hỗ trợ đọc tiếng Việt ạ.");
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bounce-leave-active {
  animation: bounce-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes bounce-in {
  0% { 
    transform: scale(0.8) translateY(50px); 
    opacity: 0; 
  }
  60% {
    transform: scale(1.05) translateY(-10px);
    opacity: 1;
  }
  100% { 
    transform: scale(1) translateY(0); 
    opacity: 1; 
  }
}

@keyframes feedbackPop {
  0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
}

.animate-feedback-pop { 
  animation: feedbackPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; 
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spinSlow 3s linear infinite; }
</style>