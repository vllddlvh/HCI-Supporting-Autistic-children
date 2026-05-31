<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Image paths - in a real app these would be assets, but here I'll use the generated one
const heroImageUrl = "/images/hero.png"

const features = [
  {
    title: 'Nhận diện cảm xúc',
    description: 'Bộ sưu tập Flashcard sinh động giúp trẻ gọi tên và phân biệt các trạng thái cảm xúc từ cơ bản đến phức tạp.',
    icon: 'fa-face-smile-beam',
    color: 'bg-sky-400',
    bgColor: 'bg-sky-50'
  },
  {
    title: 'Giao tiếp xã hội',
    description: 'Các câu chuyện tình huống thực tế giúp trẻ học cách ứng xử và thấu hiểu người xung quanh một cách tự nhiên.',
    icon: 'fa-comments',
    color: 'bg-violet-400',
    bgColor: 'bg-violet-50'
  },
  {
    title: 'Công nghệ Camera AI',
    description: 'Công nghệ phân tích biểu cảm giúp trẻ luyện tập biểu đạt cảm xúc qua gương kỹ thuật số thông minh.',
    icon: 'fa-robot',
    color: 'bg-emerald-400',
    bgColor: 'bg-emerald-50'
  },
  {
    title: 'Trò chơi tư duy',
    description: 'Kho trò chơi đa dạng từ ghép hình đến phân loại, kích thích sự tò mò và phát triển trí tuệ của trẻ.',
    icon: 'fa-puzzle-piece',
    color: 'bg-amber-400',
    bgColor: 'bg-amber-50'
  },
  {
    title: 'Báo cáo tiến độ',
    description: 'Hệ thống theo dõi chi tiết giúp phụ huynh và giáo viên đồng hành sát sao cùng lộ trình phát triển của con.',
    icon: 'fa-chart-line',
    color: 'bg-rose-400',
    bgColor: 'bg-rose-50'
  },
  {
    title: 'Môi trường an toàn',
    description: 'Giao diện không quảng cáo, âm thanh dịu nhẹ và màu sắc được thiết kế tối ưu cho trẻ có nhu cầu đặc biệt.',
    icon: 'fa-shield-heart',
    color: 'bg-teal-400',
    bgColor: 'bg-teal-50'
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#FDFEFF] text-slate-700 font-quicksand overflow-x-hidden">
    
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div class="container mx-auto flex justify-between items-center bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg shadow-slate-200/20 rounded-[2rem] px-6 py-3">
        <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/')">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
            style="background: linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%);">
            E
          </div>
          <div class="flex flex-col -space-y-1">
            <span class="text-xl font-black text-slate-800 tracking-tight">Empathy<span class="text-sky-500">Kids</span></span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nâng cánh ước mơ</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <router-link to="/login" class="hidden md:block font-bold text-slate-500 hover:text-sky-600 transition-colors">
            Đăng nhập
          </router-link>
          <router-link to="/register" class="kid-btn kid-btn-primary shadow-sky-200/50">
            Khám phá ngay
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <!-- Background Blobs -->
      <div class="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div class="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-rose-100/40 rounded-full blur-[100px] -z-10 animation-delay-2000"></div>
      
      <div class="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <div class="lg:w-1/2 text-center lg:text-left space-y-8 z-10">
          <div class="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-5 py-2 rounded-full font-black text-sm shadow-sm border border-sky-100/50 animate-bounce-subtle">
            <i class="fa-solid fa-sparkles"></i>
            Đồng hành cùng trẻ đặc biệt
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight">
            Nơi Mọi <span class="text-sky-500 relative">Cảm Xúc<svg class="absolute -bottom-2 left-0 w-full h-3 text-sky-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg></span><br>Đều Được Lắng Nghe
          </h1>
          
          <p class="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Nền tảng giáo dục thông minh được thiết kế chuyên biệt, giúp trẻ tự kỷ rèn luyện nhận thức cảm xúc và kỹ năng xã hội thông qua các trò chơi tương tác vui nhộn.
          </p>

          <div class="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
            <router-link to="/register" class="kid-btn kid-btn-primary text-xl px-10 py-6 scale-110 hover:scale-115 transition-transform">
              Bắt đầu hành trình miễn phí
            </router-link>
            <router-link to="/login" class="kid-btn kid-btn-secondary text-xl px-10 py-6 border-2 border-slate-100 hover:bg-slate-50 transition-colors">
              Xem bản dùng thử
            </router-link>
          </div>

          <div class="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-70">
            <div class="flex -space-x-3">
              <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                <img :src="`https://i.pravatar.cc/100?u=${i}`" alt="User">
              </div>
              <div class="w-10 h-10 rounded-full border-4 border-white bg-sky-100 flex items-center justify-center text-[10px] font-black text-sky-600 shadow-sm">
                +2k
              </div>
            </div>
            <p class="text-sm font-bold text-slate-400">Được tin dùng bởi hơn <span class="text-slate-600">2,000+</span> phụ huynh</p>
          </div>
        </div>

        <div class="lg:w-1/2 relative group">
          <!-- Decorative elements -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl animate-blob"></div>
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          
          <div class="relative z-10 transition-all duration-700 transform group-hover:scale-[1.03] group-hover:-rotate-1">
            <div class="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="bg-white p-4 rounded-[3.5rem] shadow-2xl shadow-sky-200/40 border border-slate-100">
              <img :src="heroImageUrl" alt="Kids Learning" class="rounded-[2.8rem] w-full h-auto object-cover">
            </div>
            
            <!-- Floating Achievement -->
            <div class="absolute -bottom-6 -right-6 md:right-0 bg-white p-5 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 animate-float">
              <div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl text-amber-500">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Huy hiệu hôm nay</p>
                <p class="text-sm font-black text-slate-700">Nhà thông thái nhí</p>
              </div>
            </div>

            <!-- Floating Emotion -->
            <div class="absolute top-10 -left-6 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 animate-float animation-delay-2000">
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl text-emerald-500">
                <i class="fa-solid fa-face-smile"></i>
              </div>
              <p class="text-xs font-black text-slate-700">Con đang thấy vui!</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white relative">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 class="text-sky-500 font-black uppercase tracking-[0.2em] text-sm">Tính năng nổi bật</h2>
          <h3 class="text-4xl md:text-5xl font-black text-slate-800">Cùng con phát triển toàn diện</h3>
          <p class="text-slate-500 text-lg font-medium">Hệ sinh thái được xây dựng dựa trên các phương pháp giáo dục khoa học, giúp trẻ từng bước làm quen và làm chủ thế giới cảm xúc.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" 
            class="group p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/30"
            :class="feature.bgColor">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-current/20"
              :class="feature.color">
              <i :class="`fa-solid ${feature.icon}`"></i>
            </div>
            <h4 class="text-2xl font-black text-slate-800 mb-4">{{ feature.title }}</h4>
            <p class="text-slate-500 leading-relaxed font-medium">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Journey Section -->
    <section class="py-24 bg-slate-50 relative overflow-hidden">
      <div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="lg:w-1/2 space-y-10">
            <div class="space-y-4">
              <h2 class="text-sky-500 font-black uppercase tracking-[0.2em] text-sm">Học mà chơi</h2>
              <h3 class="text-4xl md:text-5xl font-black text-slate-800">Lộ trình học tập như một cuộc phiêu lưu</h3>
              <p class="text-slate-500 text-lg font-medium">Chúng tôi biến những bài học khó nhãn thành những thử thách thú vị trong một thế giới đầy màu sắc.</p>
            </div>

            <div class="space-y-6">
              <div v-for="(step, i) in [
                { t: 'Khám phá thế giới cảm xúc', d: 'Bắt đầu với những cảm xúc cơ bản qua hình ảnh sinh động.' },
                { t: 'Luyện tập tương tác', d: 'Nhập vai vào các tình huống xã hội để rèn luyện phản xạ.' },
                { t: 'Làm chủ biểu cảm', d: 'Sử dụng AI để điều chỉnh và thể hiện cảm xúc chính xác.' }
              ]" :key="i" class="flex gap-6 items-start group">
                <div class="w-12 h-12 flex-shrink-0 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center font-black text-sky-500 text-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  {{ i + 1 }}
                </div>
                <div class="space-y-1">
                  <h4 class="text-xl font-black text-slate-800">{{ step.t }}</h4>
                  <p class="text-slate-500 font-medium">{{ step.d }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2">
            <div class="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
              <div class="aspect-video bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden group cursor-pointer">
                <img src="https://img.freepik.com/free-vector/video-game-concept-illustration_114360-1282.jpg" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="App interface">
                <div class="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl text-sky-500 shadow-2xl animate-pulse">
                    <i class="fa-solid fa-play ml-1"></i>
                  </div>
                </div>
              </div>
              
              <!-- App interface mock elements -->
              <div class="mt-8 flex justify-between items-center px-4">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div class="text-xs font-black text-slate-400 uppercase tracking-widest">EmpathyKids Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 relative overflow-hidden px-6">
      <div class="container mx-auto">
        <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-sky-200">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div class="relative z-10 space-y-8">
            <h2 class="text-4xl md:text-6xl font-black leading-tight">Sẵn Sàng Để Con <br> Tỏa Sáng?</h2>
            <p class="text-sky-50 text-xl font-medium max-w-2xl mx-auto opacity-90">
              Hãy cùng chúng tôi tạo nên một môi trường học tập hạnh phúc, nơi mỗi đứa trẻ đều được thấu hiểu và phát triển theo cách riêng của mình.
            </p>
          </div>
        
          <div class="flex flex-col items-center gap-6 pt-10 relative z-10">
            <router-link to="/register" class="kid-btn bg-white text-sky-600 text-2xl px-16 py-8 hover:bg-sky-50 transition-all hover:scale-105 shadow-2xl shadow-sky-900/20">
              Bắt đầu miễn phí ngay
            </router-link>
            <p class="text-sky-100/80 font-bold text-sm tracking-wide uppercase">
              KHÔNG CẦN THẺ TÍN DỤNG • TRẢI NGHIỆM ĐẦY ĐỦ TÍNH NĂNG
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white pt-20 pb-10 border-t border-slate-100">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-1 md:col-span-2 space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                style="background: linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%);">
                E
              </div>
              <span class="text-2xl font-black text-slate-800">Empathy<span class="text-sky-500">Kids</span></span>
            </div>
            <p class="text-slate-500 font-medium max-w-sm leading-relaxed">
              Dẫn đầu xu hướng giáo dục cảm xúc ứng dụng công nghệ cho trẻ tự kỷ tại Việt Nam.
            </p>
            <div class="flex gap-4">
              <a href="#" v-for="social in ['facebook', 'youtube', 'instagram']" :key="social" class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all">
                <i :class="`fa-brands fa-${social}`"></i>
              </a>
            </div>
          </div>
          
          <div class="space-y-6">
            <h5 class="text-lg font-black text-slate-800">Khám phá</h5>
            <ul class="space-y-4 font-bold text-slate-400">
              <li><a href="#" class="hover:text-sky-500 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Tính năng</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Giá cả</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Cộng đồng</a></li>
            </ul>
          </div>

          <div class="space-y-6">
            <h5 class="text-lg font-black text-slate-800">Hỗ trợ</h5>
            <ul class="space-y-4 font-bold text-slate-400">
              <li><a href="#" class="hover:text-sky-500 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Bảo mật thông tin</a></li>
              <li><a href="#" class="hover:text-sky-500 transition-colors">Liên hệ</a></li>
            </ul>
          </div>
        </div>
        
        <div class="pt-10 border-t border-slate-50 flex flex-col md:row justify-between items-center gap-4">
          <p class="text-slate-400 font-bold text-xs">© 2024 EmpathyKids. Made with ❤️ for very special souls.</p>
          <div class="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>Việt Nam</span>
            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>Tiếng Việt</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
@reference "../style.css";

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom transitions for the redesigned elements */
.router-link-active {
  @apply text-sky-600;
}
</style>