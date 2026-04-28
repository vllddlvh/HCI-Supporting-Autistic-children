<template>
  <div class="w-full max-w-2xl mx-auto flex flex-col items-center justify-center relative">
    
    <Transition name="bounce" mode="out-in">
      
      <div :key="data.id" class="w-full flex flex-col items-center pt-8">
        
        <!-- Question Bubble -->
        <div class="bg-white/90 backdrop-blur-sm px-6 md:px-10 py-4 md:py-5 rounded-[2rem] shadow-xl mb-12 relative border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform z-20">
           <h2 class="text-2xl md:text-3xl font-black text-sky-600 text-center flex items-center justify-center gap-3">
             <span class="text-3xl animate-pulse">✨</span>
             {{ data.question }}
             <span class="text-3xl animate-pulse">✨</span>
           </h2>
           <!-- Little pointer triangle for the bubble -->
           <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-t-[24px] border-t-white border-r-[20px] border-r-transparent drop-shadow-md"></div>
        </div>

        <!-- Image Container - Playful Shape -->
        <div class="relative w-64 h-64 md:w-72 md:h-72 mb-10 group">
          <div class="absolute inset-0 bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-400 rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-xl"></div>
          <div class="absolute inset-0 bg-white rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg overflow-hidden border-8 border-white">
            <img v-if="data.image" :src="data.image" alt="Emotion" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div v-else class="w-full h-full bg-sky-50 flex flex-col items-center justify-center gap-4 text-sky-300">
               <i class="fas fa-image text-6xl"></i>
               <span class="text-sm font-bold uppercase tracking-widest">Đang tải ảnh...</span>
            </div>
          </div>
          
          <!-- Fun Audio Button -->
          <button @click="playAudio" class="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl border-4 border-white group/btn z-30">
            <i class="fas fa-volume-up text-2xl md:text-3xl group-hover/btn:animate-bounce"></i>
          </button>
        </div>

        <!-- Options Grid -->
        <div class="grid grid-cols-2 gap-4 md:gap-6 w-full px-4 max-w-lg">
          <button 
            v-for="(opt, index) in data.options" 
            :key="opt"
            @click="checkAnswer(opt)"
            :disabled="hasAnswered"
            :class="getButtonClass(opt, index)"
            class="relative overflow-hidden group py-6 px-4 rounded-3xl font-black text-xl md:text-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 disabled:cursor-default active:mt-2"
          >
            <!-- Background Decoration -->
            <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-md group-hover:scale-150 transition-transform"></div>
            <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg group-hover:scale-150 transition-transform delay-100"></div>
            
            <span class="text-5xl md:text-6xl drop-shadow-md group-hover:scale-110 transition-transform">{{ getEmoji(opt) }}</span>
            <span class="z-10 drop-shadow-sm tracking-wide">{{ opt }}</span>
          </button>
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['data']); 
const emit = defineEmits(['next']);

const hasAnswered = ref(false); 
const selectedOpt = ref(null);  

const getEmoji = (text) => {
    if (text.includes('Vui')) return '😄';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😨';
    if (text.includes('Ngạc')) return '😲';
    if (text.includes('Ghê')) return '🤢';
    return '😐';
}

const colors = [
  'bg-emerald-400 text-white border-b-[8px] border-emerald-600 hover:bg-emerald-300 hover:border-emerald-500',
  'bg-sky-400 text-white border-b-[8px] border-sky-600 hover:bg-sky-300 hover:border-sky-500',
  'bg-amber-400 text-white border-b-[8px] border-amber-600 hover:bg-amber-300 hover:border-amber-500',
  'bg-rose-400 text-white border-b-[8px] border-rose-600 hover:bg-rose-300 hover:border-rose-500'
];

const getButtonClass = (opt, index) => {
    if (!hasAnswered.value) {
       return `${colors[index % colors.length]} hover:-translate-y-1 active:translate-y-2 active:border-b-0`; 
    }
    
    if (opt === props.data.correct) {
        return "bg-green-500 text-white border-b-[8px] border-green-700 scale-105 shadow-[0_0_40px_rgba(34,197,94,0.6)] z-10 animate-bounce"; 
    }
    if (opt === selectedOpt.value && opt !== props.data.correct) {
        return "bg-red-500 text-white border-b-0 translate-y-2 opacity-80 scale-95"; 
    }
    return "bg-slate-200 text-slate-400 border-b-4 border-slate-300 opacity-50 scale-95 grayscale-[50%]"; 
}

const checkAnswer = (opt) => {
    if (hasAnswered.value) return; 
    
    hasAnswered.value = true;
    selectedOpt.value = opt;
    
    const isCorrect = (opt === props.data.correct);

    setTimeout(() => {
        emit('next', isCorrect); 
    }, 1500); 
}

watch(() => props.data, () => {
    hasAnswered.value = false;
    selectedOpt.value = null;
});

const playAudio = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(props.data.question);
    speech.lang = 'vi-VN';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
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
</style>