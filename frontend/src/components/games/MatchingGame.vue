<template>
  <div class="w-full max-w-4xl mx-auto text-center py-4">
    
    <div class="mb-4">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-700 mb-2 animate-bounce-slow">
        Tìm cặp giống nhau 🧩
        </h2>
        <p class="text-blue-500 font-bold text-lg">
            Vòng {{ currentRoundIndex + 1 }} / {{ rounds.length }}
        </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 min-h-[300px]">
      
      <TransitionGroup name="list">
        <div 
            v-for="card in activeCards" 
            :key="card.uuid"
            class="aspect-square relative cursor-pointer transition-all duration-300 rounded-3xl overflow-hidden border-4 shadow-[0_14px_30px_rgba(15,23,42,0.12)] bg-white/80"
            :class="getCardClass(card)"
            @click="selectCard(card)"
        >
            <img :src="card.image" class="w-full h-full object-cover" />
            
            <div v-if="card.isMatched" class="absolute inset-0 bg-white/60 flex items-center justify-center">
                <i class="fas fa-check-circle text-green-500 text-5xl drop-shadow-lg animate-scale-in"></i>
            </div>

            <div v-if="card.isError" class="absolute inset-0 border-4 border-red-500 rounded-xl animate-shake"></div>
        </div>
      </TransitionGroup>

    </div>

    <div class="mt-8 flex justify-center gap-2">
      <span v-for="n in totalPairs" :key="n" 
            class="w-3 h-3 rounded-full transition-all duration-500"
            :class="n <= totalCorrectMatches ? 'bg-green-500 scale-125' : 'bg-slate-200'">
      </span>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['data']); 
const emit = defineEmits(['next']);

// State quản lý vòng chơi
const rounds = ref([]); // Mảng chứa các mảng con [[card1,2,3,4], [card5,6,7,8]]
const currentRoundIndex = ref(0);

const selectedCards = ref([]);
const isProcessing = ref(false);

// Stats toàn cục
const totalAttempts = ref(0);
const totalCorrectMatches = ref(0);

// Helper tạo ID
const generateUUID = () => Math.random().toString(36).substring(2, 15);

// Tính tổng số cặp trong toàn bộ bài (để hiển thị dot)
const totalPairs = computed(() => {
    return rounds.value.reduce((acc, round) => acc + (round.length / 2), 0);
});

// Lấy danh sách thẻ của vòng hiện tại
const activeCards = computed(() => {
    return rounds.value[currentRoundIndex.value] || [];
});

onMounted(() => {
  if (props.data && Array.isArray(props.data)) {
    initGameRounds(props.data);
  }
});

// 1. LOGIC CHIA VÒNG (QUAN TRỌNG)
const initGameRounds = (rawData) => {
    // 1. Gán UUID cho từng thẻ trước
    const allCards = rawData.map(item => ({
      ...item,
      uuid: generateUUID(),
      isMatched: false,
      isError: false
    }));

    // 2. Gom nhóm theo pair_key
    // Kết quả: { 'VUI_1': [cardA, cardB], 'BUON_1': [cardC, cardD], ... }
    const pairsMap = {};
    allCards.forEach(card => {
        if (!pairsMap[card.pair_key]) {
            pairsMap[card.pair_key] = [];
        }
        pairsMap[card.pair_key].push(card);
    });

    // Chuyển thành mảng các cặp: [[cardA, cardB], [cardC, cardD], ...]
    // Lúc này thứ tự vẫn là VUI_1, BUON_1, VUI_2... do Backend đã sort ID
    const pairsList = Object.values(pairsMap);

    // 3. Tạo vòng chơi: Mỗi vòng lấy đúng 2 cặp (4 thẻ)
    const chunkedRounds = [];
    const PAIRS_PER_ROUND = 2; // Số cặp trong 1 vòng (2 cặp = 4 thẻ)

    for (let i = 0; i < pairsList.length; i += PAIRS_PER_ROUND) {
        // Lấy 2 cặp tiếp theo
        const currentPairs = pairsList.slice(i, i + PAIRS_PER_ROUND);
        
        // Gộp (Flatten) thành 1 mảng các thẻ (4 thẻ)
        let roundCards = currentPairs.flat();

        shuffleArray(roundCards);
        
        chunkedRounds.push(roundCards);
    }

    rounds.value = chunkedRounds;
    currentRoundIndex.value = 0;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// ... Các hàm getCardClass, selectCard giữ nguyên logic cũ ...

const getCardClass = (card) => {
    if (card.isMatched) return 'border-green-400 opacity-80 scale-95 cursor-default grayscale-[0.3]';
    if (selectedCards.value.find(c => c.uuid === card.uuid)) return 'border-sky-500 ring-4 ring-sky-200 scale-105 z-10';
    return 'border-white hover:border-sky-200 hover:scale-105';
};

const selectCard = (card) => {
  if (isProcessing.value || card.isMatched) return;

  // Bỏ chọn nếu click lại
  if (selectedCards.value.length === 1 && selectedCards.value[0].uuid === card.uuid) {
      selectedCards.value = [];
      return;
  }

  selectedCards.value.push(card);

  if (selectedCards.value.length === 2) {
    isProcessing.value = true;
    totalAttempts.value++;
    checkMatch();
  }
};

// 2. LOGIC CHECK MATCH & CHUYỂN VÒNG
const checkMatch = () => {
    const [card1, card2] = selectedCards.value;

    // So sánh (dùng pair_key để chính xác nhất, hoặc emotion)
    // Nếu dùng pair_key thì VUI_1 chỉ khớp VUI_1 (đúng ý bạn)
    const isMatch = card1.pair_key === card2.pair_key; 

    if (isMatch) {
        setTimeout(() => {
            card1.isMatched = true;
            card2.isMatched = true;
            totalCorrectMatches.value++;
            
            selectedCards.value = [];
            isProcessing.value = false;

            // Kiểm tra xem vòng hiện tại đã xong chưa
            const currentRoundCards = rounds.value[currentRoundIndex.value];
            if (currentRoundCards.every(c => c.isMatched)) {
                
                // Nếu ĐÃ XONG VÒNG HIỆN TẠI
                setTimeout(() => {
                    if (currentRoundIndex.value < rounds.value.length - 1) {
                        // CHUYỂN SANG VÒNG TIẾP THEO
                        currentRoundIndex.value++;
                    } else {
                        // HOÀN THÀNH TOÀN BỘ GAME
                        emit('next', { 
                            isCorrect: true, 
                            stats: { 
                                totalAttempts: totalAttempts.value, 
                                correctCount: totalCorrectMatches.value 
                            } 
                        });
                    }
                }, 1000);
            }
        }, 500);
    } else {
        card1.isError = true;
        card2.isError = true;
        setTimeout(() => {
            card1.isError = false;
            card2.isError = false;
            selectedCards.value = [];
            isProcessing.value = false;
        }, 1000);
    }
};
</script>

<style scoped>
/* Animation cho danh sách thẻ (Vue TransitionGroup) */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Các animation cũ */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
</style>