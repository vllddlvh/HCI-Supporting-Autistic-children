<template>
  <div class="w-full max-w-xl mx-auto flex flex-col items-center justify-center relative">
    
    <Transition name="slide-fade" mode="out-in">
      
      <div :key="data.id" class="w-full flex flex-col items-center">
        
        <div class="relative w-56 h-56 md:w-64 md:h-64 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white ring-4 ring-blue-50/50 mb-4 transition-transform hover:scale-105 duration-300 flex items-center justify-center">
          <img v-if="data.image" :src="data.image" alt="Emotion" class="w-full h-full object-cover" />
          <div v-else class="flex flex-col items-center gap-4 text-slate-300">
             <i class="fas fa-image text-5xl"></i>
             <span class="text-[10px] font-bold uppercase tracking-widest">Đang tải ảnh...</span>
          </div>
          
          <button @click="playAudio" class="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition shadow-sm z-10">
            <i class="fas fa-volume-up text-lg"></i>
          </button>
        </div>

        <h2 class="text-xl font-black text-slate-700 mb-6 text-center animate-fade-in px-4">
          {{ data.question }}
        </h2>

        <div class="grid grid-cols-2 gap-4 w-full px-4">
          <button 
            v-for="opt in data.options" 
            :key="opt"
            @click="checkAnswer(opt)"
            :disabled="hasAnswered"
            :class="getButtonClass(opt)"
            class="kid-choice py-4 text-lg disabled:cursor-default"
          >
            <span class="text-3xl mb-1">{{ getEmoji(opt) }}</span>
            {{ opt }}
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
    if (text.includes('Vui')) return '😊';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😨';
    if (text.includes('Ngạc')) return '😲';
    if (text.includes('Ghê')) return '🤢';
    return '😐';
}

const getButtonClass = (opt) => {
    const base = "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1";
    
    if (!hasAnswered.value) return base; 
    if (opt === props.data.correct) {
        return "bg-green-500 border-green-700 text-white scale-105 shadow-md"; 
    }
    if (opt === selectedOpt.value && opt !== props.data.correct) {
        return "bg-red-500 border-red-700 text-white opacity-80"; 
    }
        return "bg-slate-100 border-slate-200 text-slate-300 opacity-40 grayscale"; 
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
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>