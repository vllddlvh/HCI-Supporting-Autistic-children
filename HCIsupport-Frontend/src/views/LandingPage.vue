<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'

const router = useRouter()

// Companion Selector state
const selectedCompanion = ref(0)
const COMPANIONS = [
  { 
    name: 'Cáo Nhỏ Thông Thái 🦊', 
    phrase: 'Bé yêu ơi, hôm nay bé thế nào? Hãy cùng tớ nhận biết những nụ cười rạng rỡ và tích lũy những ngôi sao may mắn nhé! Tớ sẽ luôn đi bên cạnh bé!', 
    seed: 'Felix',
    bg: 'bg-orange-50/80 text-orange-600 border-orange-100',
    color: '#f97316'
  },
  { 
    name: 'Thỏ Con Dịu Dàng 🐰', 
    phrase: 'Đừng lo lắng bé nhé! Mỗi khi bé thấy mệt hay buồn bã, hãy nhấp vào tớ. Tớ sẽ kể cho bé nghe những câu chuyện ấm áp và vỗ về bé thật nhẹ nhàng.', 
    seed: 'Bunny',
    bg: 'bg-rose-50/80 text-rose-600 border-rose-100',
    color: '#ec4899'
  },
  { 
    name: 'Gấu Trúc Ấm Áp 🐼', 
    phrase: 'Hít một hơi thật sâu... thở ra thật chậm nào... Đúng rồi! Gấu Trúc luôn ở đây để ôm bé thật chặt và giúp bé cảm thấy bình yên nhất.', 
    seed: 'Coco',
    bg: 'bg-emerald-50/80 text-emerald-600 border-emerald-100',
    color: '#10b981'
  },
  { 
    name: 'Khỉ Nhỏ Vui Vẻ 🐵', 
    phrase: 'Bíp bíp! Xe đua cảm xúc đã sẵn sàng xuất phát rồi! Hãy cùng tớ lái xe vượt qua những thử thách ghép hình cảm xúc cực kỳ vui nhộn nhé!', 
    seed: 'Milo',
    bg: 'bg-amber-50/80 text-amber-600 border-amber-100',
    color: '#f59e0b'
  }
]

const handleCompanionClick = (idx: number) => {
  selectedCompanion.value = idx
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0 }
  })
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1 }
  })
}

// Learning stations list
const STATIONS = [
  {
    step: 'Chương 1',
    title: 'Học Nhận Biết 📚',
    desc: 'Bé làm quen với các biểu cảm vui, buồn, giận, sợ qua những thẻ tranh vẽ tay mộc mạc, nét mặt to rõ ràng và vô cùng dịu mắt.',
    bg: 'bg-amber-50/60 border-amber-100 text-amber-700'
  },
  {
    step: 'Chương 2',
    title: 'Nối Cặp Cảm Xúc 🧩',
    desc: 'Bé chơi trò ghép những khuôn mặt có cùng biểu cảm, rèn luyện óc quan sát nhạy bén và ghi nhớ hình ảnh một cách tự nhiên.',
    bg: 'bg-rose-50/60 border-rose-100 text-rose-700'
  },
  {
    step: 'Chương 3',
    title: 'Câu Chuyện Nhỏ 💬',
    desc: 'Bé học cách thấu cảm qua câu chuyện đời thường gần gũi: khi bạn làm đổ kem, khi bé được tặng quà sinh nhật...',
    bg: 'bg-sky-50/60 border-sky-100 text-sky-700'
  },
  {
    step: 'Chương 4',
    title: 'Soi Gương Tự Luyện 🧘',
    desc: 'Bé tập biểu đạt cơ mặt trước ống kính gương thần, học cách cười thật tươi dưới sự cổ vũ ấm áp của bạn đồng hành.',
    bg: 'bg-emerald-50/60 border-emerald-100 text-emerald-700'
  },
  {
    step: 'Chương 5',
    title: 'Gương Thần Sao Vàng 🪞',
    desc: 'Gương thần diệu nhận diện nụ cười của bé và khích lệ bé bằng các ngôi sao vàng tích lũy đổi xe đua ngộ nghĩnh.',
    bg: 'bg-purple-50/60 border-purple-100 text-purple-700'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f0fdf4]/90 via-[#fffbeb]/70 to-[#e0f2fe]/80 text-slate-600 font-quicksand overflow-x-hidden relative">
    
    <!-- Vibrant Glowing Color Blobs (Gradient Mesh effect) -->
    <div class="absolute top-[-100px] left-[-150px] w-[550px] h-[550px] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse"></div>
    <div class="absolute top-[100px] right-[-150px] w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse delay-500"></div>
    <div class="absolute top-[800px] left-1/4 w-[600px] h-[600px] bg-sky-200/35 rounded-full blur-[140px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-[200px] right-10 w-[550px] h-[550px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

    <!-- Floating Cozy Cartoon Elements & Fairytale Mascots -->
    <div class="absolute top-32 left-[4%] text-5xl opacity-40 select-none pointer-events-none animate-float-1">🍃</div>
    <div class="absolute top-24 right-[5%] text-5xl opacity-40 select-none pointer-events-none animate-float-2">🌱</div>
    <div class="absolute top-48 left-[8%] text-4xl select-none pointer-events-none animate-float-2">🎈</div>
    <div class="absolute top-[350px] right-[10%] text-5xl select-none pointer-events-none animate-float-1">🦊</div>
    <div class="absolute top-[480px] left-[5%] text-5xl select-none pointer-events-none animate-float-3 animate-pulse">🌈</div>
    <div class="absolute top-[600px] right-[8%] text-4xl select-none pointer-events-none animate-spin-slow">🌸</div>
    <div class="absolute top-[180px] left-1/2 text-4xl select-none pointer-events-none animate-float-2">☁️</div>

    <nav class="container mx-auto px-6 py-6">
      <div class="flex justify-between items-center bg-white/95 backdrop-blur-md rounded-[2.5rem] border-2 border-emerald-100/60 px-10 py-5 shadow-md shadow-emerald-100/20">
        <div class="flex items-center gap-3.5 cursor-pointer group" @click="router.push('/')">
          <!-- Premium cloud heart logo image -->
          <img src="../assets/logo.png" 
               class="w-16 h-16 rounded-2xl object-cover shadow-sm bg-white border border-slate-50 transition duration-300 group-hover:scale-105 animate-pulse" 
               alt="Trạm Cảm Xúc" />
          <span class="text-3xl md:text-4xl font-black tracking-wider select-none drop-shadow-[0_3px_5px_rgba(16,185,129,0.12)] flex items-center gap-2">
            <span class="text-emerald-600">Trạm</span>
            <span class="text-[#007A5A]">Cảm Xúc</span>
          </span>
        </div>

        <div class="flex items-center gap-6">
          <router-link to="/login" class="font-extrabold text-slate-500 hover:text-emerald-500 transition duration-200">
            Đăng nhập
          </router-link>
          <router-link to="/register"
            class="bg-rose-450 hover:bg-rose-500 text-white px-7 py-4 rounded-2xl font-black shadow-lg transition duration-200 transform active:scale-95 border-b-4 border-emerald-700 animate-pulse text-base"
            style="box-shadow: 0 4px 0 #047857, 0 6px 12px rgba(16, 185, 129, 0.15)">
            Bắt đầu học thử 🚀
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ========================================== -->
    <!-- HERO SECTION: MODERN STORYBOOK LANDSCAPE -->
    <!-- ========================================== -->
    <header class="container mx-auto px-6 py-12 md:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <!-- Left: Cozy Poetic Description -->
        <div class="lg:col-span-6 space-y-8 text-center lg:text-left">
          
          <!-- Soft Calming Badge -->
          <div class="inline-flex items-center gap-2.5 bg-green-50 text-green-600 px-4 py-2 rounded-2xl font-extrabold text-sm border border-green-100 shadow-sm">
            <span class="text-base">🌱</span> Nâng niu cảm xúc đầu đời của bé
          </div>

          <h1 class="text-5xl md:text-6xl font-black text-slate-800 leading-tight tracking-wide">
            Nơi cùng bé <br>
            <span class="text-rose-500">học yêu thương</span> <br>
            qua từng biểu cảm
          </h1>

          <p class="text-lg md:text-xl text-slate-500 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
            Một không gian giáo dục trị liệu dịu nhẹ, kết hợp giữa những câu chuyện kể ấm áp và gương thần cảm xúc giúp trẻ đặc biệt dễ dàng hòa nhập.
          </p>

          <!-- 3D Bubble Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <router-link to="/register"
              class="bg-rose-450 hover:bg-rose-500 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-lg transition transform active:scale-95 text-center"
              style="box-shadow: 0 8px 0 #047857, 0 12px 20px rgba(16, 185, 129, 0.12)">
              Bé học thử miễn phí ngay 🚀
            </router-link>
            <router-link to="/login"
              class="px-10 py-5 rounded-[2rem] font-black text-lg text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 transition shadow-sm text-center">
              Tôi đã có tài khoản
            </router-link>
          </div>
        </div>

        <!-- Right: Premium Wooden Magic Tablet Mockup -->
        <div class="lg:col-span-6 flex flex-col items-center space-y-6">
          
          <!-- Tablet Frame -->
          <div class="w-full max-w-md bg-white rounded-[3rem] p-6 shadow-2xl border-4 border-white relative transition-all duration-300">
            <!-- Screen Header -->
            <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
              <span class="text-xs font-black uppercase text-slate-400 tracking-wider">Gương Thần Của Bé 🪞</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <!-- Companion display with dialogue -->
            <div class="space-y-6 flex flex-col items-center">
              <div class="w-36 h-36 rounded-full bg-slate-50 p-1 border border-slate-100 shadow-inner relative animate-bounce delay-300">
                <img :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${COMPANIONS[selectedCompanion].seed}`" 
                     class="w-full h-full rounded-full object-contain bg-white" 
                     alt="Companion Mascot" />
              </div>

              <!-- Cozy speech card -->
              <div class="w-full bg-[#fdfbf7] p-5 rounded-3xl border border-amber-100/50 shadow-sm text-left relative">
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fdfbf7] rotate-45 border-t border-l border-amber-100/50"></div>
                <h4 class="font-black text-sm mb-1.5" :style="{ color: COMPANIONS[selectedCompanion].color }">
                  {{ COMPANIONS[selectedCompanion].name }} nhắn nhủ:
                </h4>
                <p class="font-extrabold text-slate-700 text-sm leading-relaxed">
                  "{{ COMPANIONS[selectedCompanion].phrase }}"
                </p>
              </div>
            </div>
          </div>

          <!-- Cute Companion Selector -->
          <div class="space-y-2 text-center w-full max-w-sm">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
              🐾 Chạm để đổi bạn đồng hành của bé:
            </p>
            <div class="flex justify-center gap-3">
              <div v-for="(comp, idx) in COMPANIONS" :key="idx"
                @click="handleCompanionClick(idx)"
                class="w-14 h-14 rounded-2xl p-1 bg-white border-2 cursor-pointer transition duration-300 transform hover:scale-108 flex items-center justify-center relative shadow-sm"
                :class="selectedCompanion === idx ? 'border-emerald-400 bg-green-50 shadow-md' : 'border-slate-100 hover:border-slate-200'">
                <img :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${comp.seed}`" class="w-full h-full rounded-xl object-contain bg-white" />
                <div v-if="selectedCompanion === idx" class="absolute -top-1 -right-1 bg-rose-450 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] border border-white">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>

    <!-- ========================================== -->
    <!-- STATIONS CHAPTERS PATHWAY (MINIMAL TIMELINE) -->
    <!-- ========================================== -->
    <section class="py-24 bg-gradient-to-b from-white/95 via-emerald-50/30 to-white/95 rounded-t-[5rem] border-t-2 border-emerald-100/50 shadow-[0_-20px_50px_rgba(22,163,74,0.03)] relative z-20">
      <div class="container mx-auto px-6">
        
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 class="text-4xl md:text-5xl font-black text-slate-800 tracking-wide">
            Hành Trình Khám Phá Của Bé
          </h2>
          <p class="text-slate-500 text-lg font-bold">
            Mỗi bài học được thiết kế tự nhiên như từng chương truyện tranh ngập tràn niềm vui.
          </p>
          <div class="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full mt-3"></div>
        </div>

        <!-- Horizontal Minimal Timeline Deck -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="(st, idx) in STATIONS" :key="idx"
            class="p-6 rounded-[2rem] border-2 flex flex-col justify-between space-y-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            :class="st.bg">
            
            <div class="space-y-4">
              <span class="text-[10px] font-black uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-current/25 shadow-sm inline-block">
                {{ st.step }}
              </span>
              <h3 class="text-xl font-black text-slate-800 tracking-wide group-hover:text-emerald-500 transition-colors">
                {{ st.title }}
              </h3>
              <p class="text-sm font-bold text-slate-500 leading-relaxed">
                {{ st.desc }}
              </p>
            </div>
            
            <div class="pt-4 flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400 border-t border-dashed border-slate-200/50">
              <span>Khám phá 🚀</span>
              <span>Trạm {{ idx + 1 }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================== -->
    <!-- THE ROAD ADVENTURE SHOWCASE -->
    <!-- ========================================== -->
    <section class="py-24 bg-gradient-to-b from-white via-amber-50/25 to-white border-t border-b border-slate-100 relative z-20">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <!-- Left Text Details -->
          <div class="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span class="inline-block bg-green-50 text-green-600 px-4 py-1.5 rounded-full font-black text-xs border border-green-100">
              🏎️ Trò Chơi Đua Xe Cốt Lõi
            </span>
            <h2 class="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
              Đường Đua <br>Cảm Xúc Của Bé
            </h2>
            <p class="text-slate-500 font-bold text-lg leading-relaxed">
              Bé được lái xe vượt qua các chướng ngại vật bằng cách trả lời đúng câu hỏi cảm xúc trên con đường đua rực rỡ để mang về những cúp vàng danh giá.
            </p>

            <div class="flex gap-4 justify-center lg:justify-start pt-2">
              <div class="bg-white px-5 py-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span class="text-3xl">⭐</span>
                <h4 class="font-black text-slate-800 text-xs mt-2">Đổi Xe Đua</h4>
              </div>
              <div class="bg-white px-5 py-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span class="text-3xl">🏁</span>
                <h4 class="font-black text-slate-800 text-xs mt-2">Cột Mốc Vui</h4>
              </div>
              <div class="bg-white px-5 py-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span class="text-3xl">🎁</span>
                <h4 class="font-black text-slate-800 text-xs mt-2">Rương Báu</h4>
              </div>
            </div>
          </div>

          <!-- Right Racing Simulation Mockup -->
          <div class="lg:col-span-7 bg-white rounded-[3.5rem] p-6 border border-slate-200/60 shadow-2xl relative w-full max-w-lg mx-auto">
            <div class="flex items-center gap-3 border-b pb-4 mb-4">
              <div class="w-10 h-10 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-xl shadow-sm"><i class="fas fa-flag-checkered"></i></div>
              <div>
                <h4 class="font-black text-slate-850 text-sm leading-none">Con Đường Biểu Cảm</h4>
                <p class="text-slate-450 text-xs font-medium mt-1">Né tránh chướng ngại vật bằng cách giải đố cảm xúc</p>
              </div>
            </div>
            
            <!-- Racing track visual simulation -->
            <div class="bg-slate-900 rounded-2xl p-4 h-64 flex flex-col justify-between relative overflow-hidden">
              <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <!-- Finish Line -->
              <div class="flex justify-around text-slate-450 text-xs font-black uppercase tracking-widest border-b border-dashed border-slate-700 pb-2">
                <span>🏁 Trạm dừng kế tiếp</span>
                <span>💎 Nhận 100 sao</span>
              </div>

              <!-- Racing lanes representation -->
              <div class="flex-1 flex justify-around items-center relative">
                <!-- Lanes -->
                <div class="absolute inset-y-0 left-1/3 w-0.5 bg-slate-800"></div>
                <div class="absolute inset-y-0 right-1/3 w-0.5 bg-slate-800"></div>

                <!-- Active Obstacle -->
                <div class="absolute top-10 left-1/2 -translate-x-1/2 bg-rose-450 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                  🧩 Trắc Nghiệm Cảm Xúc
                </div>

                <!-- Racing Player Car -->
                <div class="absolute bottom-6 left-1/3 -translate-x-1/2 flex flex-col items-center gap-1">
                  <span class="text-3xl animate-pulse">🚗</span>
                  <span class="bg-white/90 text-slate-800 font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow">Bé Bi</span>
                </div>
              </div>

              <div class="border-t border-slate-800 pt-2 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>◀ Làn trái</span>
                <span class="text-amber-400">Di chuyển đổi làn bằng phím ◀ ▶</span>
                <span>Làn phải ▶</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Warm Call to Action Section (Celestial Gradient) -->
    <section class="py-24 bg-gradient-to-r from-green-200 via-emerald-100 to-green-100 relative overflow-hidden">
      <div class="absolute inset-0 opacity-15">
        <div class="absolute top-10 left-10 text-9xl text-green-400 rotate-12 animate-pulse"><i class="fas fa-star"></i></div>
        <div class="absolute bottom-10 right-12 text-[10rem] text-emerald-400 -rotate-12 animate-pulse"><i class="fas fa-heart"></i></div>
      </div>

      <div class="container mx-auto px-6 text-center relative z-10 space-y-8">
        <h2 class="text-4xl md:text-6xl font-black text-slate-850 leading-tight">
          Cùng Bé Học Cách Yêu Thương
        </h2>
        
        <p class="text-slate-650 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
          Đăng ký miễn phí ngay hôm nay để mang lại cho bé một người bạn đồng hành cảm xúc ấm áp, an toàn và gần gũi nhất.
        </p>

        <div class="pt-4 flex justify-center">
          <router-link to="/register"
            class="inline-block bg-rose-450 hover:bg-rose-500 text-white px-12 py-5 rounded-[2rem] font-black text-3xl shadow-2xl transition duration-150 transform hover:-translate-y-1 active:translate-y-1"
            style="box-shadow: 0 8px 0 #047857, 0 15px 25px rgba(16, 185, 129, 0.2)">
            Khám phá miễn phí ngay! ✨
          </router-link>
        </div>

        <p class="text-slate-505 text-sm font-extrabold tracking-wide">
          Bảo mật thông tin tuyệt đối • Không quảng cáo • Tự do hủy bỏ bất cứ lúc nào
        </p>
      </div>
    </section>

    <!-- Standard Footer -->
    <footer class="bg-slate-900 text-slate-400 py-16 text-sm border-t border-slate-850 relative z-20">
      <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <!-- Footer Custom Cloud Logo -->
          <img src="../assets/logo.png" class="w-12 h-12 rounded-xl bg-white object-cover shadow-sm" alt="Logo" />
          <span class="text-2xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(16,185,129,0.15)]">
            <span class="text-emerald-400">Trạm</span>
            <span class="text-[#34d399] ml-1">Cảm Xúc</span>
          </span>
        </div>

        <!-- Links -->
        <div class="flex gap-8 font-extrabold text-slate-350">
          <a href="#" class="hover:text-emerald-400 transition duration-200">Về chúng tôi</a>
          <a href="#" class="hover:text-emerald-400 transition duration-200">Liên hệ</a>
          <a href="#" class="hover:text-emerald-400 transition duration-200">Điều khoản</a>
        </div>

        <div class="text-center md:text-right space-y-1 font-bold">
          <p>© 2026 Trạm Cảm Xúc. Made with ❤️ for special kids.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.bg-rose-450 {
  background-color: #10b981;
}
.hover\:bg-rose-500:hover {
  background-color: #059669;
}
.text-rose-500 {
  color: #10b981;
}
.bg-rose-250 {
  background-color: #dcfce7;
}
.text-slate-850 {
  color: #1e293b;
}
.bg-emerald-450 {
  background-color: #10b981;
}
.bg-blue-450 {
  background-color: #3b82f6;
}
.bg-orange-450 {
  background-color: #f97316;
}
.bg-purple-450 {
  background-color: #8b5cf6;
}
.sky-250 {
  background-color: #bae6fd;
}

/* Playful Animations for Floating Surrounding Elements */
@keyframes float1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(15deg) scale(1.1); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-12deg) scale(1.05); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(8deg); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float-1 {
  animation: float1 8s ease-in-out infinite;
}
.animate-float-2 {
  animation: float2 6s ease-in-out infinite;
}
.animate-float-3 {
  animation: float3 7s ease-in-out infinite;
}
.animate-spin-slow {
  animation: spinSlow 15s linear infinite;
}
</style>