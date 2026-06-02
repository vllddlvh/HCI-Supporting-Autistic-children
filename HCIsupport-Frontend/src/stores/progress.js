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
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
  });

  const theme = ref(localStorage.getItem('app_theme') || 'default');

  // --- ACTIONS ---

  function changeTheme(newTheme) {
    theme.value = newTheme;
    localStorage.setItem('app_theme', newTheme);
  }

  async function updateProfile(childName, parentName, avatar) {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/user/profile', {
        childName,
        parentName,
        avatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userInfo.value = {
        childName,
        parentName,
        email: userInfo.value.email,
        avatar
      };
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      throw error;
    }
  }

  // 1. Hàm LOGOUT
  function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('stars_local');
      localStorage.removeItem('app_theme');

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
        
        const claimedChests = JSON.parse(localStorage.getItem('chests_claimed_local') || '[]');
        levels.value = response.data.map(lvl => ({
            ...lvl,
            chestClaimed: claimedChests.includes(lvl.id)
        }));
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
        
        // DB stars = SUM(score) từ activity log (0-100/câu) — KHÔNG dùng làm game stars
        // Game stars chỉ được quản lý qua addStars() và localStorage
        const localStars = parseInt(localStorage.getItem('stars_local') || '0');
        stars.value      = localStars;
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

  async function resetProgress() {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/api/progress-map/reset', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('chests_claimed_local');
      await fetchLevelsFromAPI();
      localStorage.removeItem('stars_local');
      stars.value = 0;
      currentStreak.value = 0;
    } catch (error) {
      console.error('Lỗi reset progress:', error);
      throw error;
    }
  }

  function addStars(count) {
      stars.value += count;
      localStorage.setItem('stars_local', String(stars.value));
  }

  // 5. Xử lý Mở Rương
  async function claimChest(levelId) {
      try {
          const level = levels.value.find(l => l.id === levelId);
          if (!level || level.chestClaimed) return;

          // Cộng sao thưởng (15 sao cho rương thần kỳ!)
          const rewardStars = 15;
          addStars(rewardStars);

          // Lưu trạng thái đã mở rương vào localStorage
          const claimedChests = JSON.parse(localStorage.getItem('chests_claimed_local') || '[]');
          if (!claimedChests.includes(levelId)) {
              claimedChests.push(levelId);
              localStorage.setItem('chests_claimed_local', JSON.stringify(claimedChests));
          }

          level.chestClaimed = true; 

          // Cố gắng gọi API, nếu backend chưa hỗ trợ thì bỏ qua không báo lỗi
          try {
              const token = localStorage.getItem('token');
              await axios.post(`http://localhost:3000/api/progress-map/claim-chest`, {
                  levelId: levelId
              }, {
                  headers: { Authorization: `Bearer ${token}` }
              });
          } catch (apiError) {
              console.warn("Backend api/progress-map/claim-chest chưa được định nghĩa. Đã lưu trạng thái rương cục bộ thành công.");
          }

      } catch (error) {
          console.error("Lỗi khi mở rương:", error);
      }
  }

  async function completeLesson(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    if (level && level.lessons) {
      level.lessons[lessonType] = true;
    }
    try {
      await fetchLevelsFromAPI();
    } catch (error) {
      console.error("Lỗi sync levels sau hoàn thành bài học:", error);
    }
  }

  return {
    stars, currentStreak, levels, userInfo, reportData, isLoading, theme, changeTheme, updateProfile,
    fetchLevelsFromAPI, fetchReportData, isLessonLocked, claimChest, logout, addStars, resetProgress, completeLesson
  };
});