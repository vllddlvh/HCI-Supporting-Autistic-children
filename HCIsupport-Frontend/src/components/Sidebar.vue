<template>
    <aside
        class="hidden md:flex flex-col w-64 h-screen bg-[#fdfbf8] border-r-2 border-amber-100/50 p-6 fixed left-0 top-0 z-20 font-quicksand select-none">
        
        <!-- Pinned Brand Title -->
        <div class="flex items-center gap-2.5 mb-6 cursor-pointer group" @click="$router.push('/')">
            <img src="../assets/logo.png" class="w-11 h-11 rounded-xl bg-white object-cover border border-amber-100 shadow-sm group-hover:rotate-6 transition duration-300 shrink-0" alt="Logo" />
            <span class="text-[23px] font-black tracking-normal drop-shadow-[0_2px_4px_rgba(16,185,129,0.12)] whitespace-nowrap">
                <span class="text-emerald-600">Trạm</span>
                <span class="text-[#007A5A] ml-1">Cảm Xúc</span>
            </span>
        </div>

        <!-- Baby Polaroid Pinned Photo Card (Cozy customization!) -->
        <div class="relative bg-white p-3 rounded-3xl border-2 border-amber-100/40 shadow-md shadow-rose-50/50 rotate-[-1.5deg] hover:rotate-0 transition duration-300 mb-8 flex flex-col items-center">
            <!-- Little red heart pin at the top -->
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-rose-500 text-lg drop-shadow animate-pulse">📌</div>
            
            <div class="w-20 h-20 rounded-full bg-slate-50 p-1 border border-slate-100 shadow-inner overflow-hidden mb-2.5">
                <img :src="store.userInfo.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'" 
                     class="w-full h-full object-contain bg-white rounded-full" />
            </div>
            
            <div class="text-center w-full min-w-0">
                <p class="font-black text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">Bé yêu của Trạm</p>
                <p class="font-black text-sm text-slate-700 truncate px-2">{{ store.userInfo.childName || 'Bé Bi' }}</p>
            </div>
        </div>

        <!-- Stickers Navigation Deck -->
        <nav class="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
            <router-link to="/app" active-class="custom-theme-sidebar-active"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-white hover:border-amber-100/40 rounded-2xl font-black transition-all hover:scale-103 hover:rotate-1">
                <i class="fas fa-gamepad text-xl w-8 text-center text-amber-500 animate-pulse"></i>
                <span>Trò chơi</span>
            </router-link>

            <router-link to="/journey" active-class="custom-theme-sidebar-active"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-white hover:border-amber-100/40 rounded-2xl font-black transition-all hover:scale-103 hover:rotate-1">
                <i class="fas fa-map text-xl w-8 text-center text-emerald-500 animate-pulse"></i>
                <span>Hành trình học</span>
            </router-link>

            <router-link to="/report" active-class="custom-theme-sidebar-active"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-white hover:border-amber-100/40 rounded-2xl font-black transition-all hover:scale-103 hover:rotate-1">
                <i class="fas fa-medal text-xl w-8 text-center text-purple-450"></i>
                <span>Báo cáo</span>
            </router-link>

            <router-link to="/emotion" active-class="custom-theme-sidebar-active"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-white hover:border-amber-100/40 rounded-2xl font-black transition-all hover:scale-103 hover:rotate-1">
                <i class="fas fa-smile text-xl w-8 text-center text-yellow-500"></i>
                <span>Thử cảm xúc</span>
            </router-link>

            <router-link to="/profile" active-class="custom-theme-sidebar-active"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-white hover:border-amber-100/40 rounded-2xl font-black transition-all hover:scale-103 hover:rotate-1">
                <i class="fas fa-user text-xl w-8 text-center text-sky-500"></i>
                <span>Hồ sơ bé</span>
            </router-link>
        </nav>

        <div class="border-t border-slate-100 pt-4">
            <button @click="handleLogout"
                class="w-full flex items-center gap-4 px-4 py-3 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-2xl font-black transition-all">
                <i class="fas fa-sign-out-alt text-xl w-8 text-center"></i>
                <span>Đăng xuất</span>
            </button>
        </div>
    </aside>

    <!-- Mobile minimal bottom navigation menu -->
    <div
        class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <router-link to="/app" active-class="text-emerald-500" class="text-slate-400 hover:text-emerald-500 transition"><i
                class="fas fa-gamepad text-2xl"></i></router-link>
        <router-link to="/journey" active-class="text-emerald-500" class="text-slate-400 hover:text-emerald-500 transition"><i
                class="fas fa-map text-2xl"></i></router-link>
        <router-link to="/report" active-class="text-emerald-500" class="text-slate-400 hover:text-emerald-500 transition"><i
                class="fas fa-medal text-2xl"></i></router-link>
        <router-link to="/emotion" active-class="text-emerald-500" class="text-slate-400 hover:text-emerald-500 transition"><i
                class="fas fa-smile text-2xl"></i></router-link>
        <router-link to="/profile" active-class="text-emerald-500" class="text-slate-400 hover:text-emerald-500 transition"><i
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
