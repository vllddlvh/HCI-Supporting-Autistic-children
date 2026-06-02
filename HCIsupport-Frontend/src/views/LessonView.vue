<template>
  <div class="h-screen flex flex-col bg-slate-50 text-slate-700 overflow-hidden font-quicksand relative">

    <header class="px-6 py-6 flex items-center gap-6 max-w-5xl mx-auto w-full z-50">
      <button @click="goBack"
        class="text-slate-400 hover:text-slate-600 text-2xl transition p-2 rounded-full hover:bg-slate-100">
        <i class="fas fa-times"></i>
      </button>

      <div class="flex-1 bg-slate-200 h-5 rounded-full overflow-hidden relative shadow-inner">
        <div class="bg-emerald-400 h-full transition-all duration-500 ease-out relative"
          :style="{ width: progress + '%' }">
          <div class="absolute top-1 left-0 w-full h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      <div v-if="lessonType !== 'matching' && questions.length > 0"
        class="font-bold text-slate-400 text-sm bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
        {{ Math.min(currentIndex + 1, questions.length) }} / {{ questions.length }}
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4 pb-20 w-full overflow-y-auto relative">

      <div v-if="isLoading" class="text-center text-slate-400 mt-10">
        <div class="animate-spin text-4xl mb-4 text-emerald-400"><i class="fas fa-spinner"></i></div>
        <p class="text-lg font-medium">Đang tải bài học...</p>
      </div>

      <div v-else-if="questions.length === 0 && !isCompleted" class="text-center text-slate-400">
        <p>Không tìm thấy dữ liệu bài học.</p>
        <button @click="fetchQuestions" class="mt-4 text-emerald-500 underline">Thử lại</button>
      </div>

      <template v-else>
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
      </template>

      <div v-if="isCompleted" class="text-center animate-bounce-in z-50">
        <div
          class="w-32 h-32 bg-amber-300 rounded-full flex items-center justify-center text-6xl text-white mx-auto mb-6 shadow-xl border-4 border-amber-100">
          🏆
        </div>
        <h2 class="text-3xl font-bold text-amber-500 mb-2">Tuyệt vời!</h2>
        <p class="text-slate-500 mb-8">Con đã hoàn thành bài học này.</p>
        <button @click="goBack"
          class="bg-sky-400 hover:bg-sky-500 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition">
          Về bản đồ
        </button>
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
    const currentLevel = levelId; // Lấy ID cấp độ

    // 🔥 BASE URL Backend nên được định nghĩa chung cho tất cả game
    const baseUrl = `http://localhost:3000/api/${lessonType}/${currentLevel}`;

    // Chọn API dựa trên loại bài học
    switch (lessonType) {
      case 'flashcard':
      case 'matching':
      case 'context': 
        // Gọi API dạng /api/flashcards/1
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
  router.push('/journey');
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
            // Gửi thêm stats nếu có (cho Matching)
            totalAttempts: stats ? stats.totalAttempts : 0,
            correctCount: stats ? stats.correctCount : 0
        };
        
        await axios.post('http://localhost:3000/api/progress-map/log', payload);
        
    } catch (error) {
        console.error("Lỗi khi ghi log tiến trình:", error);
    }
};

const handleNext = async (result, logData = {}) => {
    // result có thể là boolean (Flashcard/Context) hoặc Object (Matching)
    let isCorrect = result;
    let stats = null;

    // Xử lý dữ liệu từ Matching Game gửi lên
    if (typeof result === 'object' && result !== null) {
        isCorrect = result.isCorrect;
        stats = result.stats; // { totalAttempts, correctCount }
    }

    // 1. Flashcard & Context: Log từng câu
    if (lessonType === 'flashcard' || lessonType === 'context') {
        if (currentQuestion.value) {
            // Log dù đúng hay sai
            await logLessonActivity(
                isCorrect, 
                currentQuestion.value.id, 
                logData.chosenEmotionId
            );
        }

        // Luôn chuyển câu tiếp theo (không cho retry)
        if (currentIndex.value < questions.value.length - 1) {
            setTimeout(() => {
                currentIndex.value++;
            }, 500); 
        } else {
            finishLesson();
        }
    } 
    
    // 2. Matching / Training / AI: Log 1 lần khi xong
    else {
        if (isCorrect) {
            // Truyền stats vào hàm log
            await logLessonActivity(true, 0, null, null, stats);
            finishLesson();
        }
    }
};

const finishLesson = async (duration = null) => {
    // Nếu là Flashcard/Context, tính điểm tổng kết tại đây nếu cần
    // ...
    
    // Hiển thị màn hình chúc mừng
    isCompleted.value = true;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    
    // Cộng sao (Chỉ cộng nếu đạt tiêu chí nào đó, hoặc cộng ít hơn nếu sai nhiều)
    // Ở đây tạm thời vẫn cộng 5 sao hoàn thành bài
    store.addStars(5);
    store.completeLesson(Number(levelId), lessonType);
};

</script>

<style>
@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  80% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>