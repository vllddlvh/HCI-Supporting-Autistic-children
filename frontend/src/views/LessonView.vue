<template>
  <div :class="bgGradient" class="h-screen flex flex-col text-slate-700 overflow-hidden font-quicksand relative transition-colors duration-1000">

    <!-- Ambient Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-white/20 rounded-full blur-[100px] animate-pulse-soft"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[25rem] h-[25rem] bg-white/10 rounded-full blur-[80px] animate-pulse-soft" style="animation-delay: 1.5s"></div>
    </div>

    <!-- Header -->
    <header class="px-6 py-8 flex items-center gap-6 max-w-5xl mx-auto w-full z-50">
      <button @click="goBack"
        class="glass-panel text-slate-500 hover:text-rose-500 text-2xl transition-all p-4 rounded-3xl hover:scale-110 active:scale-90 group">
        <i class="fas fa-times group-hover:rotate-90 transition-transform"></i>
      </button>

      <div class="flex-1 glass-panel h-8 rounded-full overflow-hidden relative p-1.5">
        <div class="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-lg"
          :style="{ width: progress + '%' }">
          <!-- Sparkle at the end of progress -->
          <div v-if="progress > 0 && progress < 100" class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm animate-pulse"></div>
          <!-- Inner shine -->
          <div class="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      <div v-if="lessonType !== 'matching' && questions.length > 0"
        class="glass-panel font-black text-slate-600 text-sm px-5 py-3 rounded-2xl flex items-center gap-2">
        <span class="text-sky-500">{{ Math.min(currentIndex + 1, questions.length) }}</span>
        <span class="text-slate-300">/</span>
        <span>{{ questions.length }}</span>
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4 pb-12 w-full overflow-y-auto relative z-10 no-scrollbar">

      <div v-if="isLoading" class="text-center">
        <div class="glass-panel inline-flex flex-col items-center gap-6 px-12 py-10 rounded-[3rem] animate-float-gentle">
          <div class="relative">
            <div class="absolute inset-0 bg-sky-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <img src="/img/mascot.png" class="w-32 h-32 drop-shadow-2xl" alt="Mascot">
          </div>
          <div class="text-center space-y-2">
            <p class="text-2xl font-black text-slate-800">Đang chuẩn bị...</p>
            <p class="text-sm text-slate-400 font-bold uppercase tracking-widest">Chờ bé một xíu nha!</p>
          </div>
        </div>
      </div>

      <div v-else-if="questions.length === 0 && !isCompleted" class="text-center">
        <div class="glass-panel px-10 py-10 max-w-md mx-auto rounded-[3rem] space-y-6">
          <div class="text-7xl">🧩</div>
          <div class="space-y-2">
            <p class="font-black text-slate-800 text-2xl">Ôi, chưa có bài học!</p>
            <p class="text-slate-400 font-bold">Hãy thử tải lại xem sao nhé.</p>
          </div>
          <button @click="fetchQuestions" class="w-full py-4 bg-sky-500 text-white font-black rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-colors active:scale-95">
            TẢI LẠI NGAY
          </button>
        </div>
      </div>

      <template v-else>
        <!-- Game Components Wrapper -->
        <div class="w-full max-w-5xl mx-auto flex flex-col items-center justify-center transition-all duration-500" :class="isCompleted ? 'scale-0 opacity-0' : 'scale-100 opacity-100'">
            <FlashcardGame v-if="lessonType === 'flashcard' && !isCompleted && currentQuestion" :data="currentQuestion"
              @next="handleNext" />

            <MatchingGame v-if="lessonType === 'matching' && !isCompleted && questions.length > 0" :data="questions"
              @next="handleNext" />

            <ContextGame v-if="lessonType === 'context' && !isCompleted && currentQuestion" :data="currentQuestion"
              @next="handleNext" />

            <EmotionTraining v-if="lessonType === 'emotion_training' && !isCompleted" :data="questions[0]"
              @next="handleNext" />

            <AiGame v-if="lessonType === 'ai' && !isCompleted && currentQuestion" :data="currentQuestion"
              @next="handleNext" />
        </div>
      </template>

      <!-- Celebratory Finish Screen -->
      <div v-if="isCompleted" class="text-center animate-bounce-in z-50">
        <div class="glass-panel p-12 rounded-[4rem] relative overflow-hidden group">
          <!-- Background Glow -->
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-amber-400/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div class="relative z-10 space-y-8">
            <div class="relative inline-block">
               <div class="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
               <div class="w-48 h-48 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center text-8xl text-white mx-auto shadow-2xl border-8 border-white relative z-10">
                 🏆
               </div>
               <!-- Floating Stars around trophy -->
               <div class="absolute -top-4 -right-4 text-4xl animate-bounce" style="animation-delay: 0.2s">⭐</div>
               <div class="absolute -bottom-2 -left-6 text-3xl animate-bounce" style="animation-delay: 0.5s">✨</div>
            </div>

            <div class="space-y-3">
              <h2 class="text-5xl font-black text-slate-800 tracking-tight">Tuyệt đỉnh luôn!</h2>
              <p class="text-slate-500 font-bold text-lg">Con đã xuất sắc hoàn thành bài học này rồi.</p>
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-star text-yellow-400 text-2xl"></i>
                        <span class="text-2xl font-black text-slate-700">+5 Sao</span>
                    </div>
                    <div class="w-px h-8 bg-slate-200"></div>
                    <div class="flex items-center gap-2">
                        <i class="fas fa-fire text-orange-500 text-2xl"></i>
                        <span class="text-2xl font-black text-slate-700">Tiếp tục chuỗi!</span>
                    </div>
                </div>

                <button @click="goBack" class="w-full py-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-2xl font-black rounded-3xl shadow-2xl shadow-sky-200 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                  Về bản đồ hành trình
                </button>
            </div>
          </div>
        </div>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { useProgressStore } from '../stores/progress';

// Import Components
import FlashcardGame from '../components/games/FlashcardGame.vue';
import ContextGame from '../components/games/ContextGame.vue';
import MatchingGame from '../components/games/MatchingGame.vue';
import EmotionTraining from '../components/games/EmotionTraining.vue';
import AiGame from '../components/games/AiGame.vue';

// Init Hooks
const route = useRoute();
const router = useRouter();
const store = useProgressStore();

// Params
const levelId = route.params.levelId;
const lessonType = route.params.lessonType;

// State
const currentIndex = ref(0);
const isCompleted = ref(false);
const questions = ref([]);
const isLoading = ref(true);

// Computed Props
const currentQuestion = computed(() => questions.value[currentIndex.value]);

const bgGradient = computed(() => {
  if (isCompleted.value) return 'bg-gradient-to-br from-amber-50 via-white to-orange-50';
  
  const gradients = {
    flashcard: 'bg-gradient-to-br from-amber-50 via-white to-sky-50',
    matching: 'bg-gradient-to-br from-rose-50 via-white to-indigo-50',
    context: 'bg-gradient-to-br from-sky-50 via-white to-emerald-50',
    emotion_training: 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50',
    ai: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
  };
  return gradients[lessonType] || 'bg-slate-50';
});

const progress = computed(() => {
  if (isCompleted.value) return 100;
  if (questions.value.length === 0) return 0;
  if (lessonType === 'matching') return 0;
  return ((currentIndex.value) / questions.value.length) * 100;
});

// --- API FETCHING ---
const fetchQuestions = async () => {
  isLoading.value = true;
  try {
    let endpoint = '';
    const currentLevel = levelId;

    const baseUrl = `http://localhost:3000/api/${lessonType}/${currentLevel}`;

    switch (lessonType) {
      case 'flashcard':
      case 'matching':
      case 'context': 
        endpoint = `${baseUrl}`;
        break;
      case 'emotion_training': 
        endpoint = `http://localhost:3000/api/emotion-training/${currentLevel}`;
        break;  
      case 'ai': 
        endpoint = `http://localhost:3000/api/ai/${currentLevel}`;
        break;  
      default:
        console.warn('Chưa hỗ trợ loại bài học này:', lessonType);
    }

    if (endpoint) {
      const response = await axios.get(endpoint);
      questions.value = response.data;
    } else {
      questions.value = [];
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bài học:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchQuestions();
});

// --- METHODS ---
const goBack = () => {
  router.push('/app');
};

const logLessonActivity = async (isCorrect, questionId = null, chosenEmotionId = null, duration = null, stats = null) => {
    try {
        const payload = {
            lessonType: lessonType,
            levelId: Number(levelId),
            isCorrect: isCorrect,
            questionId: questionId,
            chosenEmotionId: chosenEmotionId,
            duration: duration,
            totalAttempts: stats ? stats.totalAttempts : 0,
            correctCount: stats ? stats.correctCount : 0
        };
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/progress-map/log', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
    } catch (error) {
        console.error("Lỗi khi ghi log tiến trình:", error);
    }
};

const handleNext = async (result, logData = {}) => {
    let isCorrect = result;
    let stats = null;

    if (typeof result === 'object' && result !== null) {
        isCorrect = result.isCorrect;
        stats = result.stats;
    }

    if (lessonType === 'flashcard' || lessonType === 'context') {
        if (currentQuestion.value) {
            await logLessonActivity(
                isCorrect, 
                currentQuestion.value.id, 
                logData.chosenEmotionId
            );
        }

        if (currentIndex.value < questions.value.length - 1) {
            setTimeout(() => {
                currentIndex.value++;
            }, 500); 
        } else {
            finishLesson();
        }
    } 
    else {
        if (isCorrect) {
            await logLessonActivity(true, 0, null, null, stats);
            finishLesson();
        }
    }
};

const finishLesson = async () => {
    isCompleted.value = true;
    
    // Premium Confetti Burst
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#34d399', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#34d399', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    store.addStars(5);
    store.completeLesson(Number(levelId), lessonType);
};

</script>

<style scoped>
@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}

.animate-bounce-in {
  animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>