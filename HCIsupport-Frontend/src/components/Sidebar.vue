<template>
    <!-- Desktop Sidebar -->
    <aside
        class="hidden md:flex flex-col w-72 h-[calc(100vh-3rem)] m-6 glass-panel rounded-[3rem] p-10 fixed left-0 top-0 z-[100] transition-all">
        
        <div class="flex items-center gap-4 mb-14 cursor-pointer group" @click="$router.push('/')">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br from-sky-400 to-indigo-500">
                <i class="fas fa-brain"></i>
            </div>
            <div class="flex flex-col -space-y-1">
                <span class="text-2xl font-black text-slate-800 tracking-tight">Trạm <span class="text-sky-500">cảm xúc</span></span>
                <span class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Học mà chơi</span>
            </div>
        </div>

        <nav class="flex flex-col gap-4 flex-1">
            <router-link v-for="item in navItems" :key="item.to" :to="item.to" 
                active-class="nav-active"
                class="nav-item group">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm bg-white border border-slate-100 group-hover:scale-110 group-hover:bg-sky-50 group-hover:border-sky-200">
                    <i :class="item.icon"></i>
                </div>
                <span class="text-sm font-black uppercase tracking-widest">{{ item.label }}</span>
                <div v-if="$route.path === item.to" class="ml-auto w-2 h-8 bg-sky-500 rounded-full shadow-lg shadow-sky-200"></div>
            </router-link>
        </nav>

        <div class="mt-auto pt-8 border-t border-slate-200/50">
            <button @click="handleLogout"
                class="w-full flex items-center gap-5 px-6 py-5 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-3xl font-black transition-all group">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all bg-white border border-slate-100 group-hover:text-rose-500 group-hover:border-rose-200 group-hover:shadow-lg">
                    <i class="fas fa-door-open"></i>
                </div>
                <span class="text-sm uppercase tracking-widest">Đăng xuất</span>
            </button>
        </div>
    </aside>

    <!-- Mobile Bottom Nav -->
    <div
        class="md:hidden fixed bottom-6 left-6 right-6 h-22 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] flex justify-around items-center z-[100] shadow-2xl shadow-slate-300/40 px-4">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" 
            active-class="text-sky-500 scale-110 bg-sky-50 rounded-2xl" 
            class="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-sky-500 transition-all duration-300 w-16 h-16">
            <i :class="item.icon" class="text-2xl"></i>
            <span class="text-[9px] font-black uppercase tracking-tighter">{{ item.label }}</span>
        </router-link>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();

const navItems = [
    { to: '/app', label: 'Học tập', icon: 'fas fa-map-marked-alt' },
    { to: '/report', label: 'Tiến độ', icon: 'fas fa-chart-pie' },
    { to: '/profile', label: 'Của con', icon: 'fas fa-user-astronaut' }
];

const handleLogout = () => {
    if (confirm("Con có chắc muốn nghỉ học một chút không?")) {
        store.logout();
        router.push('/');
    }
}
</script>

<style scoped>
@reference "../style.css";

.nav-item {
    @apply flex items-center gap-4 px-5 py-5 text-slate-500 rounded-[2rem] transition-all duration-300 border border-transparent hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-slate-200/50;
}

.nav-active {
    @apply bg-white border-white shadow-2xl shadow-sky-100/50 text-sky-600;
}

.nav-active div {
    @apply bg-sky-500 text-white border-transparent shadow-xl shadow-sky-200;
}
</style>

