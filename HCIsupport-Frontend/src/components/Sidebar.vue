<template>
    <aside
        class="hidden md:flex flex-col w-64 h-screen bg-white border-r-2 border-slate-100 p-6 fixed left-0 top-0 z-20">
        <div class="flex items-center gap-2 mb-8 cursor-pointer" @click="$router.push('/')">
            <div
                class="w-10 h-10 bg-rose-300 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                E</div>
            <span class="text-2xl font-bold text-rose-400">Empathy<span class="text-sky-400">Kids</span></span>
        </div>

        <nav class="flex flex-col gap-2 flex-1 overflow-y-auto">
            <router-link to="/app" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-home text-xl w-8 text-center"></i>
                <span>Trò chơi</span>
            </router-link>

            <!-- Học tập accordion -->
            <div>
                <button @click="learningOpen = !learningOpen"
                    class="w-full flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-sky-50/60 rounded-2xl font-bold transition-all"
                    :class="learningOpen ? 'text-sky-500' : ''">
                    <i class="fas fa-book-open text-xl w-8 text-center"></i>
                    <span class="flex-1 text-left">Học tập</span>
                    <i class="fas text-xs text-slate-400 transition-transform duration-200"
                       :class="learningOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </button>

                <div v-show="learningOpen" class="flex flex-col gap-1 mt-1 ml-3 pl-3 border-l-2 border-sky-100">
                    <router-link to="/learn/1/flashcard"
                        active-class="bg-sky-50 text-sky-500 border-sky-200"
                        class="flex items-center gap-3 px-3 py-2 text-slate-500 border-2 border-transparent hover:bg-sky-50/50 rounded-xl font-bold transition-all text-sm">
                        <i class="fas fa-clone text-base w-6 text-center"></i>
                        <span>Học thẻ</span>
                    </router-link>

                    <router-link to="/learn/1/matching"
                        active-class="bg-sky-50 text-sky-500 border-sky-200"
                        class="flex items-center gap-3 px-3 py-2 text-slate-500 border-2 border-transparent hover:bg-sky-50/50 rounded-xl font-bold transition-all text-sm">
                        <i class="fas fa-puzzle-piece text-base w-6 text-center"></i>
                        <span>Ghép nối</span>
                    </router-link>

                    <router-link to="/learn/1/context"
                        active-class="bg-sky-50 text-sky-500 border-sky-200"
                        class="flex items-center gap-3 px-3 py-2 text-slate-500 border-2 border-transparent hover:bg-sky-50/50 rounded-xl font-bold transition-all text-sm">
                        <i class="fas fa-comments text-base w-6 text-center"></i>
                        <span>Xử lý tình huống</span>
                    </router-link>

                    <router-link to="/learn/1/emotion_training"
                        active-class="bg-sky-50 text-sky-500 border-sky-200"
                        class="flex items-center gap-3 px-3 py-2 text-slate-500 border-2 border-transparent hover:bg-sky-50/50 rounded-xl font-bold transition-all text-sm">
                        <i class="fas fa-heart text-base w-6 text-center"></i>
                        <span>Luyện tập cảm xúc</span>
                    </router-link>
                </div>
            </div>

            <router-link to="/report" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-chart-pie text-xl w-8 text-center"></i>
                <span>Báo cáo</span>
            </router-link>

            <router-link to="/emotion" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-smile text-xl w-8 text-center"></i>
                <span>Kiểm tra cảm xúc</span>
            </router-link>

            <router-link to="/profile" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-user text-xl w-8 text-center"></i>
                <span>Hồ sơ</span>
            </router-link>
        </nav>

        <div class="border-t border-slate-100 pt-4">
            <button @click="handleLogout"
                class="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-bold transition-all">
                <i class="fas fa-sign-out-alt text-xl w-8 text-center"></i>
                <span>Đăng xuất</span>
            </button>
        </div>
    </aside>

    <div
        class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <router-link to="/app" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-home text-2xl"></i></router-link>
        <router-link to="/learn/1/flashcard" active-class="text-sky-500" class="text-slate-400 hover:text-sky-500 transition"><i
                class="fas fa-book-open text-2xl"></i></router-link>
        <router-link to="/report" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-chart-pie text-2xl"></i></router-link>
        <router-link to="/emotion" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-smile text-2xl"></i></router-link>
        <router-link to="/profile" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-user text-2xl"></i></router-link>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();

const learningOpen = ref(false);

const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
        store.logout();
        router.push('/');
    }
}
</script>
