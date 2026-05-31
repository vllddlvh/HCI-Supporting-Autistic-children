import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 

export const useProgressStore = defineStore('progress', () => {
  const router = useRouter();


  // --- STATE ---
  const stars = ref(0);
  const currentStreak = ref(0);
  const levels = ref([]);
  const isLoading = ref(false); 

  // State riêng cho Report
  const reportData = ref({
    accuracy: 0,
    dominantEmotion: '...',
    // 🔥 SỬA: Để mảng rỗng để hứng dữ liệu object {label, score} từ API
    radarData: [], 
    skillData: [], 
    recentLogs: []
  });

  const userInfo = ref({
    parentName: "Phụ Huynh",
    childName: "Bé Bi",
    avatar: "/default-avatar.png"
  });

  // Tải thông tin từ localStorage nếu có
  function loadUserInfo() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        userInfo.value = {
            parentName: user.parent_name || user.parentName || "Phụ Huynh",
            childName: user.child_name || user.childName || "Bé Bi",
            avatar: user.avatar || "/default-avatar.png"
        };
    }
  }

  // --- ACTIONS ---

  // 1. Hàm LOGOUT
  function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      
      stars.value = 0;
      currentStreak.value = 0;
      reportData.value = { 
          accuracy: 0, 
          dominantEmotion: '...', 
          radarData: [], 
          skillData: [],
          recentLogs: [] 
      };

      window.location.href = '/login';

  }

  // 2. Lấy Map (Danh sách bài học)
  async function fetchLevelsFromAPI() {
    try {


        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/progress-map', {
            headers: { Authorization: `Bearer ${token}` }
        });
        levels.value = response.data;
    } catch (error) {
        console.error("Lỗi tải tiến trình:", error);
    }
  }

  // 3. Lấy dữ liệu Báo cáo
  async function fetchReportData() {
    isLoading.value = true; 
    try {


        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("Chưa đăng nhập, không thể tải báo cáo");
            return; 
        }

        const response = await axios.get('http://localhost:3000/api/report', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        
        // Cập nhật State từ API
        stars.value = data.stats.stars;
        currentStreak.value = data.stats.streak;
        
        reportData.value.accuracy = data.stats.accuracy;
        reportData.value.dominantEmotion = data.stats.dominantEmotion;
        
        // Dữ liệu Radar (Mảng object: [{label: 'Level 1', score: 100}, ...])
        reportData.value.radarData = data.radar; 
        
        // Dữ liệu Kỹ năng (Mảng object: [{code: 'FLASHCARD', score: 80}, ...])
        reportData.value.skillData = data.skills; 
        
        reportData.value.recentLogs = data.logs;

    } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
        if (error.response && error.response.status === 401) {
            logout();
        }
    } finally {
        isLoading.value = false; 
    }
  }

  // 4. Logic Check Khóa bài học
  function isLessonLocked(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    if (!level) return true;
    if (level.locked) return true;

    // Thứ tự bài học bắt buộc
    const lessonOrder = ['flashcard', 'matching', 'context', 'emotion_training', 'ai'];
    const typeIndex = lessonOrder.indexOf(lessonType);

    if (typeIndex === 0) return false; // Bài đầu tiên luôn mở nếu level mở
    
    // Kiểm tra bài trước đó đã xong chưa
    const prevType = lessonOrder[typeIndex - 1];
    if (!level.lessons) return true;
    
    return !level.lessons[prevType]; // Nếu bài trước chưa xong -> Khóa bài này
  }

  function addStars(count) {
      stars.value += count;
  }

  // 5. Đánh dấu hoàn thành bài học (để mở khóa bài tiếp theo)
  function completeLesson(levelId, lessonType) {
      const level = levels.value.find(l => l.id == levelId);
      if (!level) return;

      if (!level.lessons) level.lessons = {};

      // Đánh dấu bài hiện tại là đã hoàn thành
      level.lessons[lessonType] = true;

      // Nếu level đang bị khóa mà người dùng hoàn thành bài (trường hợp mock/dev), mở khóa luôn
      if (level.locked) level.locked = false;
  }

  // 5. Xử lý Mở Rương
  async function claimChest(levelId) {
      try {
          const level = levels.value.find(l => l.id === levelId);
          if (!level || level.chestClaimed) return;

          const token = localStorage.getItem('token');
          const response = await axios.post(`http://localhost:3000/api/progress-map/claim-chest`, {
              levelId: levelId
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          const rewardStars = response.data.reward || 10; 
          addStars(rewardStars);
          level.chestClaimed = true; 

      } catch (error) {
          console.error("Lỗi khi mở rương:", error);
      }
  }

  return { 
    stars, currentStreak, levels, userInfo, reportData, isLoading,
    fetchLevelsFromAPI, fetchReportData, isLessonLocked, claimChest, logout, addStars, completeLesson, loadUserInfo
  };
});