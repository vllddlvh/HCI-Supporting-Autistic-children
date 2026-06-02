<template>
  <div
    ref="containerRef"
    class="relative flex-1 h-full overflow-hidden select-none"
    style="font-family:'Quicksand',sans-serif;outline:none"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <!-- ═══ LAYOUT: Grass | Road | Grass ═══ -->
    <div class="absolute inset-0 flex">

      <!-- LEFT SIDE -->
      <div class="relative overflow-hidden flex-shrink-0 flex flex-col"
           style="width:13%">
        <!-- Tile background: top cap + repeating middle + bottom cap -->
        <img :src="sideL1" draggable="false"
             style="width:100%;display:block;flex-shrink:0;image-rendering:pixelated"/>
        <div class="flex-1" :style="{
          backgroundImage: `url('${sideL2}')`,
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat-y',
          imageRendering: 'pixelated'
        }"/>
        <img :src="sideL3" draggable="false"
             style="width:100%;display:block;flex-shrink:0;image-rendering:pixelated"/>
        <!-- Sprite overlays -->
        <img v-for="t in leftTrees" :key="'lt'+t.id"
             :src="t.src"
             class="absolute pointer-events-none"
             style="width:38px;height:auto;image-rendering:pixelated;display:block;z-index:1"
             draggable="false"
             :style="{ top: treeTop(t, 0) + '%', left: '30%' }"/>
      </div>

      <!-- ═══ ROAD ═══ -->
      <div class="relative flex-1 overflow-hidden" :style="roadBgStyle">

        <!-- Road surface shading -->
        <div class="absolute inset-0 pointer-events-none"
             style="background:linear-gradient(to right,rgba(0,0,0,.25) 0%,transparent 10%,transparent 90%,rgba(0,0,0,.25) 100%)"/>

        <!-- Lava lane dividers -->
        <template v-for="lx in ['33.33%','66.66%']" :key="lx">
          <div class="absolute top-0 bottom-0 overflow-hidden pointer-events-none"
               :style="{ left: lx, width: '14px', transform: 'translateX(-50%)' }">
            <div :style="{
              position: 'absolute',
              width: '100vmax',
              height: '30px',
              top: '50%', left: '50%',
              transformOrigin: 'center center',
              transform: 'translate(-50%,-50%) rotate(90deg)',
              backgroundImage: `url(${lavaImg})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '48px 100%',
              backgroundPositionX: lavaOffset + 'px',
              imageRendering: 'pixelated',
            }"/>
          </div>
        </template>

        <!-- Road edge lines -->
        <div class="absolute top-0 bottom-0 left-0 w-1 pointer-events-none" style="background:rgba(255,255,255,.5)"/>
        <div class="absolute top-0 bottom-0 right-0 w-1 pointer-events-none" style="background:rgba(255,255,255,.5)"/>

        <!-- ── GAME OBJECTS ── -->
        <div v-for="obj in visibleObjects" :key="obj.id"
             class="absolute pointer-events-none"
             :style="getObjStyle(obj)">

          <!-- CHECKPOINT BAR -->
          <template v-if="obj.type==='checkpoint'">
            <div class="flex items-center justify-center gap-2 w-full h-full px-3 rounded-2xl shadow-2xl"
                 :style="getCheckpointStyle(obj)">
              <div class="flex flex-col gap-1 opacity-70 flex-shrink-0">
                <div v-for="n in 3" :key="n" class="w-3 h-1 rounded-full bg-white"/>
              </div>
              <span class="text-2xl flex-shrink-0">{{ meta(obj.lessonType).emoji }}</span>
              <div class="text-white text-center leading-tight flex-1 min-w-0">
                <div class="text-[9px] font-bold uppercase tracking-widest opacity-80">🚧 Trạm Kiểm Tra</div>
                <div class="text-xs font-extrabold truncate">{{ meta(obj.lessonType).name }}</div>
              </div>
              <span class="text-2xl flex-shrink-0">{{ meta(obj.lessonType).emoji }}</span>
              <div class="flex flex-col gap-1 opacity-70 flex-shrink-0">
                <div v-for="n in 3" :key="n" class="w-3 h-1 rounded-full bg-white"/>
              </div>
            </div>
          </template>

          <!-- CHEST -->
          <template v-else-if="obj.type==='chest'">
            <img :src="treasureImg"
                 class="chest-float"
                 style="width:100%;height:100%;image-rendering:pixelated;display:block"
                 draggable="false"/>
          </template>

          <!-- OBSTACLE BLOCK -->
          <template v-else>
            <img :src="lavaObstacle"
                 class="obstacle-pulse"
                 style="width:100%;height:100%;image-rendering:pixelated;display:block"
                 draggable="false" />
          </template>
        </div>

        <!-- ── PLAYER CAR ── -->
        <div class="absolute z-20 transition-all duration-150 ease-out"
             :style="{ left: LANE_PCTS[playerLane]+'%', top: PLAYER_TOP+'%', transform:'translateX(-50%) translateY(-50%)' }">
          <div :class="isHit ? 'car-wiggle' : ''" style="position:relative">
            <!-- Exhaust smoke particles -->
            <div v-for="p in smokeParticles" :key="p.id"
                 class="absolute rounded-full pointer-events-none"
                 :style="{
                   left:    p.x + 'px',
                   bottom:  (-4 - p.y) + 'px',
                   width:   p.size + 'px',
                   height:  p.size + 'px',
                   opacity: p.opacity,
                   background: p.hot
                     ? `rgba(160,200,255,${p.opacity})`
                     : `rgba(190,190,200,${p.opacity})`,
                   transform: 'translateX(-50%)',
                   zIndex: 0,
                 }"/>
            <img ref="truckImgRef" :src="selectedCarImg"
                 style="width:54px;height:auto;image-rendering:pixelated;display:block;position:relative;z-index:1"
                 draggable="false"
                 @load="updateHitboxSizes" />
          </div>
        </div>

      </div><!-- end road -->

      <!-- RIGHT SIDE -->
      <div class="relative overflow-hidden flex-shrink-0 flex flex-col"
           style="width:13%">
        <!-- Tile background: top cap + repeating middle + bottom cap -->
        <img :src="sideR3" draggable="false"
             style="width:100%;display:block;flex-shrink:0;image-rendering:pixelated"/>
        <div class="flex-1" :style="{
          backgroundImage: `url('${sideR2}')`,
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat-y',
          imageRendering: 'pixelated'
        }"/>
        <img :src="sideR1" draggable="false"
             style="width:100%;display:block;flex-shrink:0;image-rendering:pixelated"/>
        <!-- Sprite overlays -->
        <img v-for="t in rightTrees" :key="'rt'+t.id"
             :src="t.src"
             class="absolute pointer-events-none"
             style="width:38px;height:auto;image-rendering:pixelated;display:block;z-index:1"
             draggable="false"
             :style="{ top: treeTop(t, 0.15) + '%', right: '30%' }"/>
      </div>

    </div><!-- end flex layout -->

    <!-- ═══ RAIN ═══ -->
    <canvas ref="rainCanvas"
            class="absolute inset-0 pointer-events-none"
            style="width:100%;height:100%;z-index:18"/>

    <!-- ═══ HUD ═══ -->
    <div class="absolute top-3 left-1/2 z-30 flex gap-2 items-center" style="transform:translateX(-50%)">
      <div class="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold shadow-lg"
           style="background:rgba(0,0,0,.35);color:#fff;backdrop-filter:blur(6px)">
        🏁 Màn {{ currentLevelLabel }}
      </div>
      <div class="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold shadow-lg"
           style="background:rgba(0,0,0,.35);color:#fde68a;backdrop-filter:blur(6px)">
        ⭐ {{ store.stars }}
      </div>
      <div class="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold shadow-lg"
           style="background:rgba(0,0,0,.35);color:#fdba74;backdrop-filter:blur(6px)">
        🔥 {{ store.currentStreak }}
      </div>
      <!-- PAUSE BUTTON -->
      <button v-if="gameStarted" @click="togglePause"
              class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-base shadow-lg transition active:scale-90"
              style="background:rgba(255,255,255,.22);color:#fff;backdrop-filter:blur(6px);border:1.5px solid rgba(255,255,255,.4)"
              :title="gamePaused ? 'Tiếp tục' : 'Tạm dừng'">
        {{ gamePaused ? '▶' : '⏸' }}
      </button>
    </div>


    <!-- ═══ START OVERLAY ═══ -->
    <Transition name="overlay-fade">
      <div v-if="!gameStarted"
           class="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5"
           style="background:rgba(15,23,42,.82);backdrop-filter:blur(6px)">
        <div class="text-center">
          <h2 class="text-white font-extrabold mb-1" style="font-size:1.6rem">Chọn xe của bạn!</h2>
          <p style="color:rgba(255,255,255,.6);font-size:.85rem;max-width:220px;text-align:center;line-height:1.5">
            Lái xe vượt qua các trạm học tập để tiến lên!
          </p>
        </div>

        <!-- Car picker -->
        <div class="flex flex-col items-center gap-5">

          <!-- Row 1: Model selector -->
          <div :class="['picker-row', carPickMode === 'model' && 'picker-row--active']"
               @click="carPickMode = 'model'">
            <button @click.stop="selectedModelIndex = (selectedModelIndex - 1 + CAR_MODELS.length) % CAR_MODELS.length"
                    class="picker-arrow-btn">◀</button>
            <span class="font-extrabold text-white" style="min-width:120px;text-align:center;font-size:.95rem;letter-spacing:.02em">
              {{ CAR_MODELS[selectedModelIndex].name }}
            </span>
            <button @click.stop="selectedModelIndex = (selectedModelIndex + 1) % CAR_MODELS.length"
                    class="picker-arrow-btn">▶</button>
          </div>

          <!-- Car image with bounce-on-change -->
          <div style="position:relative;width:160px;height:160px;display:flex;align-items:center;justify-content:center">
            <Transition name="car-swap">
              <img :key="`${selectedModelIndex}-${selectedColorIndex}`"
                   :src="selectedCarImg"
                   :style="{
                     width:'144px', height:'auto', imageRendering:'pixelated',
                     filter: currentCarUnlocked
                       ? 'drop-shadow(0 6px 20px rgba(0,0,0,.65))'
                       : 'drop-shadow(0 6px 20px rgba(0,0,0,.65)) grayscale(1) brightness(.55)',
                     position:'absolute',
                   }"
                   draggable="false"/>
            </Transition>
          </div>

          <!-- Row 2: Color selector -->
          <div :class="['picker-row', carPickMode === 'color' && 'picker-row--active']"
               @click="carPickMode = 'color'">
            <button @click.stop="selectedColorIndex = (selectedColorIndex - 1 + CAR_COLORS.length) % CAR_COLORS.length; carPickMode = 'color'"
                    class="picker-arrow-btn">◀</button>
            <span class="font-extrabold text-white" style="min-width:120px;text-align:center;font-size:.95rem;letter-spacing:.02em">
              {{ CAR_COLORS[selectedColorIndex].name }}
            </span>
            <button @click.stop="selectedColorIndex = (selectedColorIndex + 1) % CAR_COLORS.length; carPickMode = 'color'"
                    class="picker-arrow-btn">▶</button>
          </div>

        </div>
        <button v-if="currentCarUnlocked" @click="startGame" class="start-btn">
          BẮT ĐẦU!
        </button>
        <div v-else class="flex flex-col items-center gap-2">
          <button @click="buyCurrentCar" class="start-btn start-btn--buy">
            {{ currentCarPrice }} <i class="fas fa-star" style="color:#fde047;font-size:.95em"></i>
          </button>
          <Transition name="notif-pop">
            <div v-if="notEnoughStars" class="not-enough-notif">
              Không đủ sao! Bạn có {{ store.stars }} / {{ currentCarPrice }} <i class="fas fa-star" style="color:#fde047;font-size:.9em"></i>
            </div>
          </Transition>
        </div>

        <!-- Reset button -->
        <button @click="confirmReset = true" class="start-btn start-btn--blue"
                style="padding:.7rem 2.2rem;font-size:.95rem">
          Chơi lại từ đầu
        </button>

        <p style="color:rgba(255,255,255,.35);font-size:.75rem;text-align:center;line-height:1.7">
          Phím ▲ ▼ chuyển mẫu/màu &nbsp;·&nbsp; ◀ ▶ để chọn
          <br>Phím ◀ ▶ trong game để đổi làn
        </p>
      </div>
    </Transition>

    <!-- ═══ PAUSED OVERLAY ═══ -->
    <Transition name="overlay-fade">
      <div v-if="gameStarted && gamePaused && !showModal"
           class="absolute inset-0 z-35 flex flex-col items-center justify-center gap-4"
           style="background:rgba(15,23,42,.7);backdrop-filter:blur(4px)">
        <div style="font-size:3rem">⏸️</div>
        <h2 class="text-white font-extrabold" style="font-size:1.4rem">Tạm Dừng</h2>
        <button @click="togglePause" class="start-btn" style="padding:.7rem 2.5rem;font-size:1rem">
          Tiếp tục
        </button>
        <button @click="restartRace" class="start-btn start-btn--blue" style="padding:.6rem 2rem;font-size:1rem">
          Chơi lại
        </button>
      </div>
    </Transition>

    <!-- ═══ LESSON MODAL ═══ -->
    <Teleport to="body">
      <Transition name="modal-pop">
        <div v-if="showModal"
             class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
             style="background:rgba(0,0,0,.65);backdrop-filter:blur(5px)">

          <div class="bg-white rounded-3xl shadow-2xl w-full overflow-hidden"
               style="max-width:360px"
               :style="{ border: `4px solid ${meta(activeLesson?.lessonType).color}` }">

            <!-- Header -->
            <div class="px-6 py-5 flex items-center gap-4"
                 :style="{ background: meta(activeLesson?.lessonType).color }">
              <div style="font-size:3rem;line-height:1">{{ meta(activeLesson?.lessonType).emoji }}</div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold uppercase tracking-widest mb-0.5"
                     style="color:rgba(255,255,255,.85)">
                  <template v-if="activeLesson?.isCheckpoint">
                    {{ activeLesson?.lessonDone ? '✅ Đã Hoàn Thành' : '🚧 Trạm Bắt Buộc' }}
                  </template>
                  <template v-else>⚡ Nhiệm Vụ Bắt Buộc</template>
                </div>
                <div class="text-xl font-extrabold text-white leading-tight truncate">
                  {{ meta(activeLesson?.lessonType).name }}
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 pt-5 pb-6">
              <p class="text-sm leading-relaxed mb-5" style="color:#64748b">
                <!-- Checkpoint đã làm rồi -->
                <template v-if="activeLesson?.isCheckpoint && activeLesson?.lessonDone">
                  🎉 Bạn đã hoàn thành bài học này rồi! Muốn <strong style="color:#334155">ôn lại</strong> hay tiếp tục cuộc đua?
                </template>
                <!-- Checkpoint chưa làm -->
                <template v-else-if="activeLesson?.isCheckpoint">
                  🚧 Đây là <strong style="color:#334155">trạm kiểm tra bắt buộc</strong>.
                  Hoàn thành bài học để tiếp tục cuộc đua!
                </template>
                <!-- Obstacle -->
                <template v-else>
                  💥 Bạn đã va vào chướng ngại vật!
                  Phải hoàn thành <strong style="color:#334155">bài học này</strong> mới được đi tiếp nhé!
                </template>
              </p>

              <div class="flex gap-3">
                <!-- Nếu đã làm rồi: có nút "Đi tiếp" để bỏ qua -->
                <button v-if="activeLesson?.isCheckpoint && activeLesson?.lessonDone"
                        @click="continueRace"
                        class="flex-1 py-3 rounded-2xl font-bold text-sm transition active:scale-95"
                        style="border:2px solid #e2e8f0;color:#334155">
                  Đi tiếp ✅
                </button>
                <button @click="startLesson"
                        class="flex-1 py-3 rounded-2xl font-extrabold text-white text-sm shadow-lg active:scale-95 transition"
                        :style="{ background: meta(activeLesson?.lessonType).color, boxShadow: `0 6px 0 ${meta(activeLesson?.lessonType).shadow}` }">
                  {{ activeLesson?.isCheckpoint && activeLesson?.lessonDone ? 'Ôn lại 📖' : 'Bắt đầu!' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ CHEST MODAL ═══ -->
    <Teleport to="body">
      <Transition name="modal-pop">
        <div v-if="showChestModal"
             class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
             style="background:rgba(0,0,0,.65);backdrop-filter:blur(5px)">
          <div class="bg-white rounded-3xl shadow-2xl w-full overflow-hidden"
               style="max-width:340px">

            <!-- Header -->
            <div class="px-6 py-5 text-center" style="background:#00A6F4">
              <div class="text-white font-extrabold text-xl mt-2">Rương Báu!</div>
              <div class="text-sm mt-1" style="color:rgba(255,255,255,.85)">
                Màn {{ (activeChest?.levelIndex ?? 0) + 1 }} hoàn thành!
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 pt-5 pb-6">

              <!-- Before claim -->
              <template v-if="!chestClaimed">
                <div class="text-center mb-5">
                  <div class="font-extrabold text-slate-800" style="font-size:2.2rem">
                    +50 <i class="fas fa-star" style="color:#FDC700"/>
                  </div>
                  <div class="text-sm mt-2" style="color:#64748b">Phần thưởng hoàn thành màn!</div>
                </div>
                <button @click="openChest"
                        class="w-full py-3 rounded-2xl font-extrabold text-white text-base active:scale-95 transition"
                        style="background:#00A6F4;box-shadow:0 6px 0 #0080c0">
                  Mở Rương!
                </button>
              </template>

              <!-- After claim -->
              <template v-else>
                <div class="text-center mb-5">
                  <div class="font-extrabold text-slate-800 text-xl">
                    <i class="fas fa-star" style="color:#FDC700"/> {{ store.stars }}
                  </div>
                  <div class="text-sm mt-1 font-bold" style="color:#00A6F4">+50 sao đã nhận!</div>
                  <div class="text-sm mt-1" style="color:#64748b">Bạn muốn làm gì tiếp theo?</div>
                </div>
                <div class="flex flex-col gap-3">
                  <button v-if="(activeChest?.levelIndex ?? 0) < LEVEL_COUNT - 1"
                          @click="continueNextLevel"
                          class="w-full py-3 rounded-2xl font-extrabold text-white text-sm active:scale-95 transition"
                          style="background:#00A6F4;box-shadow:0 5px 0 #0080c0">
                    Chơi Màn {{ (activeChest?.levelIndex ?? 0) + 2 }} ▶
                  </button>
                  <button v-else
                          @click="continueNextLevel"
                          class="w-full py-3 rounded-2xl font-extrabold text-white text-sm active:scale-95 transition"
                          style="background:#00A6F4;box-shadow:0 5px 0 #0080c0">
                    🏆 Hoàn thành tất cả!
                  </button>
                  <button @click="replayCurrentLevel"
                          class="w-full py-3 rounded-2xl font-bold text-sm active:scale-95 transition"
                          style="border:2px solid #e2e8f0;color:#334155">
                    Chơi lại Màn {{ (activeChest?.levelIndex ?? 0) + 1 }}
                  </button>
                </div>
              </template>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ RESET CONFIRM POPUP ═══ -->
    <Teleport to="body">
      <Transition name="modal-pop">
        <div v-if="confirmReset"
             class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
             style="background:rgba(0,0,0,.65);backdrop-filter:blur(5px)">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden"
               style="max-width:340px;width:100%;border:4px solid #ef4444">
            <!-- Header -->
            <div class="px-6 py-5 flex items-center gap-3"
                 style="background:#ef4444">

              <div>
                <div class="text-xs font-bold uppercase tracking-widest mb-0.5"
                     style="color:rgba(255,255,255,.85)">Xác nhận hành động</div>
                <div class="text-lg font-extrabold text-white leading-tight">Chơi lại từ màn 1?</div>
              </div>
            </div>
            <!-- Body -->
            <div class="px-6 pt-5 pb-6">
              <p class="text-sm leading-relaxed mb-5" style="color:#64748b">
                Toàn bộ tiến trình sẽ bị <strong style="color:#ef4444">xóa vĩnh viễn</strong> và bạn sẽ bắt đầu lại từ màn 1. Hành động này <strong style="color:#334155">không thể hoàn tác</strong>!
              </p>
              <div class="flex gap-3">
                <button @click="doReset" :disabled="resetting"
                        class="flex-1 py-3 rounded-2xl font-extrabold text-white text-sm transition active:scale-95"
                        style="background:linear-gradient(135deg,#f87171,#ef4444);box-shadow:0 4px 0 #b91c1c;border:none;cursor:pointer;font-family:inherit">
                  {{ resetting ? 'Đang reset...' : 'Xác nhận' }}
                </button>
                <button @click="confirmReset = false"
                        class="flex-1 py-3 rounded-2xl font-bold text-sm transition active:scale-95"
                        style="border:2px solid #e2e8f0;color:#334155;background:transparent;cursor:pointer;font-family:inherit">
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProgressStore } from '../stores/progress';
const _carImgs = import.meta.glob('../assets/ezgif-split/*.png', { eager: true });
const getCarImg = (modelId, colorId) =>
  _carImgs[`../assets/ezgif-split/${modelId}_${colorId}.png`]?.default ?? '';
import tilesetImg   from '../assets/lava_map/ice_tileset.png';
import lavaImg      from '../assets/ice_map/IceBox.png';
import lavaObstacle from '../assets/ice_map/Stone.png';
import tree1Img     from '../assets/ice_map/SnowMan.png';
import tree2Img     from '../assets/lava_map/tree2.png';
import volcanoImg   from '../assets/ice_map/Igloo.png';
import rockImg      from '../assets/ice_map/Sign_1.png';
import sideL1       from '../assets/ice_map/L1.png';
import sideL2       from '../assets/ice_map/L2.png';
import sideL3       from '../assets/ice_map/L3.png';
import sideR1       from '../assets/ice_map/R1 (1).png';
import sideR2       from '../assets/ice_map/R1 (2).png';
import sideR3       from '../assets/ice_map/R1 (3).png';
import treasureImg  from '../assets/ice_map/treasure.png';

const router = useRouter();
const store  = useProgressStore();
const containerRef = ref(null);

// ── Constants ────────────────────────────────────────────────────────────────
const LANE_PCTS    = [16.66, 50, 83.33];
const PLAYER_TOP   = 78;
const COLLISION_Y  = 71;   // trigger at front of car (~7% above car center)
const GAME_SPEED   = 0.28; // % units scrolled per tick (16ms)
const LESSON_TYPES = ['flashcard', 'matching', 'context', 'emotion_training'];
const OBSTACLE_EMOJIS = ['❓', '💥', '⚡', '🎯', '🌟'];

// ── Lesson metadata ───────────────────────────────────────────────────────────
const LESSON_META = {
  flashcard:        { name: 'Thẻ Ghi Nhớ',          emoji: '📚', color: '#f59e0b', shadow: '#d97706' },
  matching:         { name: 'Ghép Hình',              emoji: '🧩', color: '#f43f5e', shadow: '#e11d48' },
  context:          { name: 'Ngữ Cảnh Xã Hội',       emoji: '💬', color: '#0ea5e9', shadow: '#0284c7' },
  emotion_training: { name: 'Luyện Tập Cảm Xúc',    emoji: '🏋️', color: '#f97316', shadow: '#ea580c' },
};

const OBSTACLE_COLORS = {
  flashcard: '#fde68a', matching: '#fecdd3',
  context: '#bae6fd', emotion_training: '#fed7aa',
};

const meta = (t) => LESSON_META[t] ?? { name: t ?? '?', emoji: '❓', color: '#94a3b8', shadow: '#64748b' };

// ── Game State ────────────────────────────────────────────────────────────────
const playerLane   = ref(1);
const cameraScroll = ref(0);
const gameStarted  = ref(false); // has user pressed Start
const gamePaused   = ref(false); // mid-game pause
const showModal    = ref(false);
const activeLesson = ref(null);
const isHit        = ref(false);
const gameObjects  = ref([]);
const confirmReset   = ref(false);
const resetting      = ref(false);
const showChestModal  = ref(false);
const activeChest     = ref(null);
const chestClaimed    = ref(false);
const trackLevelIndex = ref(0); // 0-based, tracks position on track (not DB progress)
const smokeParticles = ref([]);
let _smokeId = 0;
let smokeLoop = null;

const CAR_MODELS = [
  { id: 'Delivery Van',      name: 'Xe Tải',       price: 0  },
  { id: 'Hot Rod',           name: 'Xe độ',       price: 10 },
  { id: 'Le Mans Prototype', name: 'Le Mans',       price: 20 },
  { id: 'Minibus',           name: 'Xe Buýt Mini',  price: 30 },
  { id: 'Modern F1 Car',     name: 'Xe Đua F1',     price: 40 },
  { id: 'Muscle Car',        name: 'Xe Bắp',        price: 50 },
  { id: 'Pickup Truck',      name: 'Xe Bán Tải',   price: 60 },
  { id: 'Roadster',          name: 'Xe mui trần',      price: 70 },
  { id: 'Supercar',          name: 'Siêu Xe',       price: 80 },
  { id: 'Vintage F1',        name: 'F1 Cổ Điển',   price: 90 },
];
const CAR_COLORS = [
  { id: 'blue',   name: 'Xanh Dương', hex: '#3b82f6' },
  { id: 'green',  name: 'Xanh Lá',   hex: '#22c55e' },
  { id: 'purple', name: 'Tím',        hex: '#a855f7' },
  { id: 'red',    name: 'Đỏ',         hex: '#ef4444' },
  { id: 'yellow', name: 'Vàng',       hex: '#eab308' },
];
const selectedModelIndex = ref(0); // default: Delivery Van
const selectedColorIndex = ref(0);
const carPickMode = ref('model'); // 'model' | 'color'
const selectedCarImg = computed(() =>
  getCarImg(CAR_MODELS[selectedModelIndex.value].id, CAR_COLORS[selectedColorIndex.value].id)
);

// Car unlock system
const unlockedCars = ref(new Set(
  JSON.parse(localStorage.getItem('unlocked_cars') || '["Delivery Van"]')
));
const currentCarUnlocked = computed(() =>
  unlockedCars.value.has(CAR_MODELS[selectedModelIndex.value].id)
);
const currentCarPrice = computed(() => CAR_MODELS[selectedModelIndex.value].price);

const notEnoughStars = ref(false);
let _notEnoughTimer = null;
function buyCurrentCar() {
  const model = CAR_MODELS[selectedModelIndex.value];
  if (store.stars < model.price) {
    notEnoughStars.value = true;
    clearTimeout(_notEnoughTimer);
    _notEnoughTimer = setTimeout(() => { notEnoughStars.value = false; }, 2200);
    return;
  }
  store.addStars(-model.price);
  unlockedCars.value = new Set([...unlockedCars.value, model.id]);
  localStorage.setItem('unlocked_cars', JSON.stringify([...unlockedCars.value]));
}

const truckImgRef  = ref(null);
const carHalfHPct  = ref(5);    // half-height of truck in % of container — updated on load
const obstHalfHPct = ref(5.7);  // half-height of 80px obstacle — updated on mount

const updateHitboxSizes = () => {
  const container = containerRef.value;
  if (!container) return;
  const h = container.clientHeight;
  obstHalfHPct.value = (80 / h) * 50; // 80px obstacle → half in %
  const img = truckImgRef.value;
  if (img && img.naturalWidth) {
    const renderedH = 54 * (img.naturalHeight / img.naturalWidth);
    carHalfHPct.value = (renderedH / h) * 50;
  }
};

// Collision starts when obstacle bottom reaches car top
const getCollisionY = () => PLAYER_TOP - carHalfHPct.value - obstHalfHPct.value;

const TILE_SIZE = 78; // px — rendered size of each tile

const roadBgStyle = computed(() => {
  const h      = containerRef.value?.clientHeight ?? 700;
  const offset = ((cameraScroll.value / 100) * h) % TILE_SIZE;
  return {
    backgroundImage:    `url(${tilesetImg})`,
    backgroundRepeat:   'repeat',
    backgroundSize:     `${TILE_SIZE}px ${TILE_SIZE}px`,
    backgroundPosition: `0px ${offset}px`,
    imageRendering:     'pixelated',
  };
});

const lavaOffset = computed(() => {
  const h = containerRef.value?.clientHeight ?? 700;
  return ((cameraScroll.value / 100) * h) % 48;
});


const LEVEL_COUNT = 2;
const currentLevelLabel = computed(() => {
  if (!store.levels.length) return '…';
  return `${trackLevelIndex.value + 1}/${LEVEL_COUNT}`;
});

// ── Side decorations ──────────────────────────────────────────────────────────
const L_SPRITES = [tree1Img, volcanoImg, rockImg, tree1Img, volcanoImg, rockImg, tree1Img];
const R_SPRITES = [volcanoImg, rockImg, tree1Img, volcanoImg, tree1Img, rockImg, volcanoImg];
const leftTrees  = ref(Array.from({length:7}, (_,i)=>({ id:i,   worldY:i*16,   src:L_SPRITES[i%L_SPRITES.length] })));
const rightTrees = ref(Array.from({length:7}, (_,i)=>({ id:i+7, worldY:i*16+8, src:R_SPRITES[i%R_SPRITES.length] })));

const treeTop = (t, offset) => {
  const raw = ((t.worldY + cameraScroll.value * 0.35 + offset * 100) % 112 + 112) % 112;
  return raw - 6;
};

// ── Track building ────────────────────────────────────────────────────────────
let _id = 0;
const buildTrack = () => {
  const objs = [];
  let pos = -28;
  store.levels.slice(0, 2).forEach((level, lIdx) => {
    const levelStartPos = pos;
    LESSON_TYPES.forEach((lessonType, tIdx) => {
      const numObs = 2 + (tIdx % 2);
      for (let o = 0; o < numObs; o++) {
        pos -= 28 + o * 4;
        objs.push({
          id: ++_id, type: 'obstacle',
          startTop: pos, lane: (o + tIdx + lIdx) % 3,
          lessonType, levelId: level.id, levelIndex: lIdx,
          emojiIdx: (o + tIdx) % OBSTACLE_EMOJIS.length,
          triggered: false,
        });
      }
      pos -= 20;
      const done = !!level.lessons?.[lessonType];
      objs.push({
        id: ++_id, type: 'checkpoint',
        startTop: pos, lane: 'all',
        lessonType, levelId: level.id, levelIndex: lIdx,
        lessonDone: done, triggered: false,
      });
      pos -= 45;
    });
    // Treasure chests — 3 lanes simultaneously
    pos -= 30;
    const chestGroupId = `chest_${level.id}`;
    for (let lane = 0; lane < 3; lane++) {
      objs.push({
        id: ++_id, type: 'chest',
        startTop: pos, lane,
        levelId: level.id, levelIndex: lIdx,
        levelStartPos, groupId: chestGroupId,
        triggered: false,
      });
    }
    pos -= 50;
  });
  return objs;
};

// ── Computed visible objects ──────────────────────────────────────────────────
const visibleObjects = computed(() => {
  const s = cameraScroll.value;
  return gameObjects.value
    .filter(o => { const t = o.startTop + s; return t > -14 && t < 112; })
    .map(o => ({ ...o, screenTop: o.startTop + s }));
});

// ── Object styles ─────────────────────────────────────────────────────────────
const getObjStyle = (obj) => {
  if (obj.type === 'checkpoint')
    return { top: obj.screenTop+'%', left:'3%', right:'3%', height:'58px', transform:'translateY(-50%)', zIndex:15 };
  if (obj.type === 'chest')
    return { top: obj.screenTop+'%', left: LANE_PCTS[obj.lane]+'%', width:'100px', height:'100px', transform:'translateX(-50%) translateY(-50%)', zIndex:15 };
  return { top: obj.screenTop+'%', left: LANE_PCTS[obj.lane]+'%', width:'80px', height:'80px', transform:'translateX(-50%) translateY(-50%)', zIndex:10 };
};

const getCheckpointStyle = (obj) => ({
  background: meta(obj.lessonType).color,
  border: '4px solid rgba(255,255,255,.45)',
});

const getObstacleStyle = (obj) => ({
  background: OBSTACLE_COLORS[obj.lessonType] ?? '#e2e8f0',
  border: '4px solid rgba(255,255,255,.7)',
  boxShadow: '0 6px 16px rgba(0,0,0,.2)',
});

// ── Game loop (crossing-based collision) ──────────────────────────────────────
// Each object triggers when cameraScroll crosses `collideAt = COLLISION_Y - obj.startTop`.
// Using crossing detection (prev < threshold <= next) ensures no miss even if ticks batch.
let loopId = null;

const tick = () => {
  if (!gameStarted.value || gamePaused.value) return;

  const nextScroll = cameraScroll.value + GAME_SPEED;
  const carTop     = PLAYER_TOP - carHalfHPct.value;
  const carBottom  = PLAYER_TOP + carHalfHPct.value;
  let   hitSomething = false;

  for (const obj of gameObjects.value) {
    if (obj.triggered) continue;

    const screenCenter = obj.startTop + nextScroll;
    const objTop       = screenCenter - obstHalfHPct.value;
    const objBottom    = screenCenter + obstHalfHPct.value;

    // Obstacle completely past the car — clean up
    if (objTop > carBottom) {
      obj.triggered = true;
      continue;
    }

    // Obstacle not yet reached the car front
    if (objBottom < carTop) continue;

    // ── Y overlap with car ────────────────────────────────────
    if (obj.type === 'checkpoint') {
      obj.triggered      = true;
      hitSomething       = true;
      cameraScroll.value = nextScroll;
      gamePaused.value   = true;
      showModal.value    = true;
      activeLesson.value = { ...obj, isCheckpoint: true };
      break;
    } else if (obj.type === 'chest' && obj.lane === playerLane.value) {
      // Mark all 3 chests in this group as triggered
      gameObjects.value.forEach(o => { if (o.groupId === obj.groupId) o.triggered = true; });
      hitSomething         = true;
      cameraScroll.value   = nextScroll;
      gamePaused.value     = true;
      showChestModal.value = true;
      chestClaimed.value   = false;
      activeChest.value    = { ...obj };
      break;
    } else {
      if (obj.lane === playerLane.value) {
        // Same lane — hit
        obj.triggered      = true;
        hitSomething       = true;
        cameraScroll.value = nextScroll;
        triggerObstacleHit(obj);
        break;
      }
      // Different lane — stay alive until obstacle passes car bottom
    }
  }

  if (!hitSomething) {
    cameraScroll.value = nextScroll;
  }
};

const triggerObstacleHit = (obj) => {
  isHit.value = true;
  setTimeout(() => { isHit.value = false; }, 450);
  gamePaused.value = true;
  showModal.value  = true;
  activeLesson.value = { ...obj, isCheckpoint: false };
};

// ── Controls ──────────────────────────────────────────────────────────────────
const moveLeft  = () => { if (playerLane.value > 0) playerLane.value--; };
const moveRight = () => { if (playerLane.value < 2) playerLane.value++; };

const onKeyDown = (e) => {
  if (!gameStarted.value) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      carPickMode.value = carPickMode.value === 'model' ? 'color' : 'model';
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (carPickMode.value === 'model') {
        selectedModelIndex.value = (selectedModelIndex.value - 1 + CAR_MODELS.length) % CAR_MODELS.length;
      } else {
        selectedColorIndex.value = (selectedColorIndex.value - 1 + CAR_COLORS.length) % CAR_COLORS.length;
      }
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (carPickMode.value === 'model') {
        selectedModelIndex.value = (selectedModelIndex.value + 1) % CAR_MODELS.length;
      } else {
        selectedColorIndex.value = (selectedColorIndex.value + 1) % CAR_COLORS.length;
      }
    }
    if (e.key === 'Enter' || e.key === ' ') startGame();
    return;
  }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); moveLeft();  }
  if (e.key === 'ArrowRight') { e.preventDefault(); moveRight(); }
  if (e.key === 'Escape')     togglePause();
};

// ── Start / Pause ─────────────────────────────────────────────────────────────
const startGame = () => {
  gameStarted.value = true;
  containerRef.value?.focus();
};

const togglePause = () => {
  if (!gameStarted.value || showModal.value) return;
  gamePaused.value = !gamePaused.value;
  if (!gamePaused.value) containerRef.value?.focus();
};

const restartRace = () => {
  gamePaused.value  = false;
  gameStarted.value = false;
  cameraScroll.value = 0;
  playerLane.value   = 1;
  sessionStorage.removeItem('racing_resume');
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const startLesson = () => {
  const l = activeLesson.value;
  showModal.value    = false;
  gamePaused.value   = false;
  activeLesson.value = null;
  if (l) {
    sessionStorage.setItem('racing_resume', JSON.stringify({
      scroll:      cameraScroll.value + 18,
      lane:        playerLane.value,
      modelIndex:  selectedModelIndex.value,
      colorIndex:  selectedColorIndex.value,
    }));
    router.push(`/learn/${l.levelId}/${l.lessonType}`);
  }
};

// Close modal and resume race (only for already-completed checkpoints)
const continueRace = () => {
  showModal.value    = false;
  gamePaused.value   = false;
  activeLesson.value = null;
  containerRef.value?.focus();
};

// ── Chest ─────────────────────────────────────────────────────────────────────
const openChest = () => {
  store.addStars(50);
  chestClaimed.value = true;
};

const continueNextLevel = () => {
  const nextIdx = (activeChest.value?.levelIndex ?? 0) + 1;
  trackLevelIndex.value = Math.min(nextIdx, LEVEL_COUNT - 1);
  showChestModal.value  = false;
  activeChest.value     = null;
  gamePaused.value      = false;
  containerRef.value?.focus();
};

const replayCurrentLevel = () => {
  const chest = activeChest.value;
  if (!chest) return;
  trackLevelIndex.value = chest.levelIndex;
  cameraScroll.value    = -chest.levelStartPos;
  gameObjects.value.forEach(obj => {
    if (obj.startTop <= chest.levelStartPos) obj.triggered = false;
  });
  showChestModal.value = false;
  activeChest.value    = null;
  gamePaused.value     = false;
  containerRef.value?.focus();
};

// ── Rain ──────────────────────────────────────────────────────────────────────
const rainCanvas = ref(null);
let rainAnimId   = null;
const rainDrops  = [];

const initRain = () => {
  const canvas = rainCanvas.value;
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  rainDrops.length = 0;
  for (let i = 0; i < 120; i++) {
    rainDrops.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      len:     6 + Math.random() * 10,
      speed:   7 + Math.random() * 7,
      opacity: 0.25 + Math.random() * 0.45,
      width:   Math.random() > 0.5 ? 1 : 1.5,
    });
  }
};

const DX = Math.sin(12 * Math.PI / 180); // ~12° tilt
const DY = Math.cos(12 * Math.PI / 180);

const drawRain = () => {
  const canvas = rainCanvas.value;
  if (!canvas) { rainAnimId = requestAnimationFrame(drawRain); return; }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const d of rainDrops) {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + DX * d.len, d.y + DY * d.len);
    ctx.strokeStyle = `rgba(180,220,255,${d.opacity})`;
    ctx.lineWidth   = d.width;
    ctx.stroke();

    d.x += DX * d.speed;
    d.y += DY * d.speed;

    if (d.y > canvas.height || d.x > canvas.width) {
      d.x = Math.random() * canvas.width * 1.2 - canvas.width * 0.1;
      d.y = -d.len;
    }
  }

  rainAnimId = requestAnimationFrame(drawRain);
};

// ── Smoke particles ───────────────────────────────────────────────────────────
const EXHAUST_PIPES = [12, 40]; // x positions on 54px-wide truck

const tickSmoke = () => {
  if (!gameStarted.value || gamePaused.value) {
    smokeParticles.value = [];
    return;
  }
  // Age & move existing particles
  for (const p of smokeParticles.value) {
    p.age++;
    p.y  += p.vy;
    p.vy  = Math.max(0, p.vy - 0.18);
    p.x  += (Math.random() - 0.5) * 1.4;
    p.size   += 0.7;
    p.opacity = 0.9 * (1 - p.age / p.maxAge);
    if (p.age > 3) p.hot = false;
  }
  smokeParticles.value = smokeParticles.value.filter(p => p.age < p.maxAge);

  // Spawn new puffs from each exhaust pipe
  for (const px of EXHAUST_PIPES) {
    smokeParticles.value.push({
      id:     ++_smokeId,
      x:      px + (Math.random() - 0.5) * 3,
      y:      0,
      vy:     2.5 + Math.random() * 2,
      size:   3 + Math.random() * 3,
      opacity: 0.9,
      age:    0,
      maxAge: 12 + Math.floor(Math.random() * 7),
      hot:    true,
    });
  }
};

// ── Reset ─────────────────────────────────────────────────────────────────────
const doReset = async () => {
  resetting.value = true;
  try {
    await store.resetProgress();
    _id = 0;
    cameraScroll.value    = 0;
    playerLane.value      = 1;
    trackLevelIndex.value = 0;
    gameObjects.value     = buildTrack();
    confirmReset.value    = false;
  } finally {
    resetting.value = false;
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const isLevelDone = (lvl) => LESSON_TYPES.every(t => lvl.lessons?.[t]);

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([store.fetchLevelsFromAPI(), store.fetchReportData()]);
  gameObjects.value = buildTrack();
  updateHitboxSizes();
  // Init track level from DB progress
  const dbIdx = store.levels.slice(0, LEVEL_COUNT).findIndex(l => !l.locked && !isLevelDone(l));
  trackLevelIndex.value = dbIdx >= 0 ? dbIdx : LEVEL_COUNT - 1;

  const saved = sessionStorage.getItem('racing_resume');
  if (saved) {
    sessionStorage.removeItem('racing_resume');
    const { scroll, lane, modelIndex, colorIndex } = JSON.parse(saved);
    cameraScroll.value       = scroll;
    playerLane.value         = lane;
    selectedModelIndex.value = modelIndex ?? 0;
    selectedColorIndex.value = colorIndex ?? 0;
    // Mark everything at or before restored position as already triggered
    const cy = getCollisionY();
    gameObjects.value.forEach(obj => {
      if (cy - obj.startTop <= scroll + 1) obj.triggered = true;
    });
    gameStarted.value = true;
    containerRef.value?.focus();
  }

  loopId    = setInterval(tick,      16);
  smokeLoop = setInterval(tickSmoke, 50);
  initRain();
  drawRain();
  containerRef.value?.focus();
});

onUnmounted(() => {
  if (loopId)    clearInterval(loopId);
  if (smokeLoop) clearInterval(smokeLoop);
  if (rainAnimId) cancelAnimationFrame(rainAnimId);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');

/* Lane stripes */
.lane-stripe {
  --dash: 14px;
  --gap: 32px;
  width: 100%; height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #facc15 0px,
    #facc15 var(--dash),
    transparent var(--dash),
    transparent calc(var(--dash) + var(--gap))
  );
  background-position: 0 0;
  animation: stripeScroll 0.7s linear infinite;
}
.lane-stripe-stopped {
  --dash: 14px;
  --gap: 32px;
  width: 100%; height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    #facc15 0px,
    #facc15 var(--dash),
    transparent var(--dash),
    transparent calc(var(--dash) + var(--gap))
  );
  background-position: 0 0;
}
@keyframes stripeScroll {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(var(--dash) + var(--gap))); }
}

/* Obstacle subtle pulse */
@keyframes obsPulse {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.06); }
}
.obstacle-pulse { animation: obsPulse 1.2s ease-in-out infinite; }

/* Chest float */
@keyframes chestFloat {
  0%,100% { transform: translateY(0) scale(1); filter: drop-shadow(0 6px 12px rgba(251,191,36,.7)); }
  50%     { transform: translateY(-8px) scale(1.06); filter: drop-shadow(0 14px 20px rgba(251,191,36,.9)); }
}
@keyframes chestGlow {
  0%,100% { opacity: 1; }
  50%     { opacity: 0.85; }
}
.chest-float {
  animation: chestFloat 1.1s ease-in-out infinite, chestGlow 1.1s ease-in-out infinite;
  image-rendering: pixelated;
}

/* Control buttons */
.ctrl-btn {
  width:64px; height:64px; border-radius:18px;
  border:3px solid rgba(255,255,255,.45);
  background:rgba(255,255,255,.18); backdrop-filter:blur(8px);
  color:#fff; font-size:1.4rem; font-weight:800;
  box-shadow:0 6px 20px rgba(0,0,0,.3),0 2px 0 rgba(255,255,255,.2) inset;
  cursor:pointer; transition:transform .1s,box-shadow .1s;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
.ctrl-btn:active { transform:scale(.88) translateY(3px); box-shadow:0 2px 8px rgba(0,0,0,.3); }

/* Start button */
.start-btn {
  padding:.9rem 2.8rem; border-radius:22px; border:none;
  background:linear-gradient(135deg,#34d399,#059669);
  color:#fff; font-size:1.1rem; font-weight:800;
  box-shadow:0 6px 0 #047857,0 10px 24px rgba(5,150,105,.4);
  cursor:pointer; transition:transform .12s,box-shadow .12s;
  user-select:none; -webkit-tap-highlight-color:transparent;
  font-family:inherit;
}
.start-btn:active { transform:translateY(4px); box-shadow:0 2px 0 #047857,0 4px 12px rgba(5,150,105,.3); }
.start-btn--blue { background:linear-gradient(135deg,#60a5fa,#2563eb)!important; box-shadow:0 6px 0 #1d4ed8,0 10px 24px rgba(37,99,235,.4)!important; }
.start-btn--blue:active { box-shadow:0 2px 0 #1d4ed8,0 4px 12px rgba(37,99,235,.3)!important; }
.start-btn--buy { background:linear-gradient(135deg,#fbbf24,#f59e0b)!important; box-shadow:0 6px 0 #d97706,0 10px 24px rgba(245,158,11,.4)!important; color:#7c2d12!important; }
.start-btn--buy:active { box-shadow:0 2px 0 #d97706,0 4px 12px rgba(245,158,11,.3)!important; }

.not-enough-notif {
  background: rgba(239,68,68,.92);
  color: #fff;
  font-weight: 700;
  font-size: .8rem;
  padding: 6px 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,.3);
  white-space: nowrap;
}
.notif-pop-enter-active { transition: all .2s cubic-bezier(.34,1.56,.64,1); }
.notif-pop-leave-active { transition: all .15s ease; }
.notif-pop-enter-from   { opacity:0; transform:scale(.8) translateY(-6px); }
.notif-pop-leave-to     { opacity:0; transform:scale(.9); }

/* Car picker row */
.picker-row {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform .22s cubic-bezier(.34,1.56,.64,1);
}
.picker-row--active {
  transform: scale(1.12);
}
.picker-row--active .picker-arrow-btn {
  border-color: rgba(255,255,255,.85);
  background: rgba(255,255,255,.2);
}

/* Car picker arrow buttons */
.picker-arrow-btn {
  width:36px; height:36px; border-radius:50%;
  background:rgba(255,255,255,.15);
  border:2px solid rgba(255,255,255,.3);
  color:#fff; font-size:1.1rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:background .15s;
  font-family:inherit;
}
.picker-arrow-btn:hover { background:rgba(255,255,255,.3); }
.picker-arrow-btn:active { background:rgba(255,255,255,.4); transform:scale(.9); }

/* Car image swap transition */
.car-swap-enter-active { transition:all .22s cubic-bezier(.34,1.56,.64,1); }
.car-swap-leave-active { transition:all .1s ease; }
.car-swap-enter-from   { opacity:0; transform:scale(.55) translateY(10px); }
.car-swap-leave-to     { opacity:0; transform:scale(1.1); }

/* Car wiggle */
@keyframes wiggle {
  0%,100% { transform:translateX(0) rotate(0deg); }
  25%      { transform:translateX(-6px) rotate(-5deg); }
  75%      { transform:translateX(6px) rotate(5deg); }
}
.car-wiggle { animation:wiggle .45s ease; }

/* Modal */
.modal-pop-enter-active { transition:all .28s cubic-bezier(.34,1.56,.64,1); }
.modal-pop-leave-active { transition:all .18s ease; }
.modal-pop-enter-from   { opacity:0; transform:scale(.82) translateY(24px); }
.modal-pop-leave-to     { opacity:0; transform:scale(.92); }

/* Overlays */
.overlay-fade-enter-active { transition:opacity .3s ease; }
.overlay-fade-leave-active { transition:opacity .25s ease; }
.overlay-fade-enter-from,.overlay-fade-leave-to { opacity:0; }
</style>
