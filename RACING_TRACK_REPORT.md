# Báo Cáo: Thiết Kế Lại Dashboard Thành Minigame Đua Xe
**Dự án:** EmpathyKids — Ứng dụng giáo dục cảm xúc cho trẻ em  
**Ngày thực hiện:** 01/06/2026  
**Stack:** Vue 3 (Composition API) + Pinia + Tailwind CSS + Vite

---

## 1. Hiện Trạng Trước Khi Thay Đổi

Dashboard (`/app`) có 3 vùng:
- **Sidebar trái** (w-64): menu điều hướng — `Sidebar.vue`
- **Vùng giữa** (flex-1): lộ trình học tập dạng zigzag tĩnh — 300 dòng template trong `Dashboard.vue`
- **Panel phải** (w-80): streak, sao, nhiệm vụ hôm nay — giữ nguyên

Lộ trình zigzag hiển thị các node bài học (flashcard / matching / context / emotion_training / ai) sắp xếp theo đường cong SVG. Click vào node → router.push đến `/learn/:levelId/:lessonType`.

---

## 2. Yêu Cầu Thay Đổi

Giữ nguyên Sidebar và Panel phải. Thay toàn bộ vùng giữa bằng **minigame đua xe top-down** với logic:

| Thành phần | Mô tả |
|---|---|
| Đường đua | 3 làn dọc, nhìn từ trên xuống |
| Xe người chơi | Luôn ở dưới màn hình, di chuyển trái/phải |
| Chướng ngại vật | Xuất hiện ngẫu nhiên trên 1 làn — bắt buộc làm bài nếu va chạm |
| Trạm kiểm tra | Bar ngang toàn bộ 3 làn — luôn dừng xe, luôn hiện modal |
| Phong cách | Kids-friendly, màu sắc tươi sáng, bo tròn |

---

## 3. Các File Đã Thay Đổi

### 3.1 Tạo mới: `frontend/src/components/RacingTrack.vue`

Component tự chứa toàn bộ game logic. **Không** nhận prop từ ngoài — tự lấy dữ liệu từ `useProgressStore`.

### 3.2 Sửa: `frontend/src/views/Dashboard.vue`

Xóa ~300 dòng template zigzag, thêm `<RacingTrack />` và import tương ứng. Sidebar và Panel phải giữ nguyên 100%.

---

## 4. Kiến Trúc Kỹ Thuật Chi Tiết

### 4.1 Hệ Tọa Độ Game

```
cameraScroll (ref): tăng dần theo thời gian, đơn vị = % chiều cao màn hình
startTop (mỗi object): vị trí cố định trong "world space" (số âm = trên màn hình)

screenTop(obj) = obj.startTop + cameraScroll
  → âm = object còn trên màn hình chưa vào
  → = 78 → object đang ở vị trí xe (collision zone)
  → > 100 → object đã qua xe, thoát khỏi màn hình
```

Xe người chơi **luôn cố định** tại `top: 78%`. Thay vì xe di chuyển lên, ta tăng `cameraScroll` để các object cuộn xuống.

### 4.2 Sinh Track (buildTrack)

```
pos = -28 (bắt đầu ngay trên màn hình)

Với mỗi level × 5 loại bài:
  ├── 2–3 obstacles (pos -= 28~36 mỗi object)
  ├── gap (pos -= 35)
  ├── 1 checkpoint (pos -= 35)
  └── khoảng cách đến nhóm tiếp theo (pos -= 105)

Khoảng cách checkpoint-to-checkpoint ≈ 140 units
Thời gian xe đi qua: 140 / 0.28 * 16ms ≈ 8 giây
```

Tất cả object có `triggered: false`. **Không** pre-trigger object nào, kể cả bài đã hoàn thành.

### 4.3 Game Loop (Crossing Detection)

Dùng `setInterval(tick, 16)` — 60fps.

```javascript
// Nguyên tắc: thay vì check "object có trong zone không?"
// → check "object có VƯỢT qua đường collision lần này không?"

const prevScroll = cameraScroll.value;
const nextScroll = prevScroll + GAME_SPEED;
const collideAt  = COLLISION_Y - obj.startTop; // = 78 - startTop

if (prevScroll < collideAt && nextScroll >= collideAt) {
  // Kích hoạt va chạm
}
```

**Lý do dùng crossing detection thay vì range check:**  
Range check (`top >= Y-tol && top <= Y+tol`) có thể bỏ lỡ nếu browser throttle nhiều ticks cùng lúc, khiến object "nhảy" qua vùng kiểm tra mà không được phát hiện. Crossing detection kiểm tra khoảng liên tục `(prevScroll, nextScroll]` nên không bao giờ bỏ sót.

### 4.4 Logic Va Chạm

```
Checkpoint (type='checkpoint'):
  → Luôn trigger modal dù bài đã làm hay chưa
  → lessonDone=false → "Trạm bắt buộc" + nút "Bắt đầu!"
  → lessonDone=true  → "Đã hoàn thành" + nút "Đi tiếp" + "Ôn lại"

Obstacle (type='obstacle'):
  → Chỉ trigger nếu obj.lane === playerLane.value
  → Nếu xe khác làn → obj.triggered = true (dodge thành công)
  → Luôn bắt buộc làm bài, không có nút bỏ qua
```

### 4.5 Visible Objects (Performance)

Chỉ render các object có `screenTop ∈ (-14, 112)` — khoảng nhìn thấy của màn hình cộng thêm buffer 14% trên và dưới. Tránh render hàng trăm object ngoài màn hình.

```javascript
const visibleObjects = computed(() => {
  const s = cameraScroll.value;
  return gameObjects.value
    .filter(o => { const t = o.startTop + s; return t > -14 && t < 112; })
    .map(o => ({ ...o, screenTop: o.startTop + s }));
});
```

### 4.6 Cây Parallax (Side Decorations)

Cây hai bên cuộn với tốc độ 35% so với đường đua, tạo hiệu ứng chiều sâu.

```javascript
const treeTop = (t, offset) => {
  // Modulo có xử lý số âm (JavaScript % có thể trả về âm)
  const raw = ((t.worldY - cameraScroll.value * 0.35 + offset * 100) % 112 + 112) % 112;
  return raw - 6; // offset nhỏ để cây không bị cắt ở đỉnh
};
```

---

## 5. Các Bug Đã Phát Hiện và Fix

### Bug 1: Checkpoint xuyên qua không hiện modal (nghiêm trọng)

**Nguyên nhân:** Trong `buildTrack`, checkpoint của bài đã làm được set `triggered: done`. Vòng lặp `tick` có `if (obj.triggered) continue` nên bỏ qua hoàn toàn — checkpoint xuất hiện trên màn hình nhưng không bao giờ được kiểm tra va chạm.

**Fix:** Đổi `triggered: done` → `triggered: false`. Checkpoint luôn chờ xe đến. Modal phân biệt nội dung qua `lessonDone`.

### Bug 2: Collision detection có thể bỏ lỡ (tiềm ẩn)

**Nguyên nhân:** Range check `top >= Y - tol && top <= Y + tol` không đảm bảo khi browser batch nhiều ticks.

**Fix:** Crossing detection — kiểm tra `prevScroll < collideAt && nextScroll >= collideAt`.

### Bug 3: Obstacle có nút "Bỏ qua"

**Fix:** Xóa nút skip, tất cả va chạm đều bắt buộc làm bài. Label đổi thành "⚡ Nhiệm Vụ Bắt Buộc".

---

## 6. Cấu Trúc State Game

```javascript
// Refs chính
playerLane:   ref(1)      // 0=trái, 1=giữa, 2=phải
cameraScroll: ref(0)      // tăng liên tục
gameStarted:  ref(false)  // false = hiện Start overlay
gamePaused:   ref(false)  // true khi modal hoặc user bấm pause
showModal:    ref(false)  // hiện/ẩn lesson modal
activeLesson: ref(null)   // object được va chạm { lessonType, levelId, isCheckpoint, lessonDone }
gameObjects:  ref([])     // toàn bộ obstacles + checkpoints của track
```

---

## 7. Điều Khiển

| Phương thức | Hành động |
|---|---|
| Nút ◀ / ▶ trên màn hình | Đổi làn (click + touch) |
| Phím ArrowLeft / ArrowRight | Đổi làn |
| Phím Escape | Toggle pause |
| Nút ⏸/▶ trên HUD | Toggle pause |

---

## 8. Prompt Tái Hiện

Dưới đây là prompt đầy đủ để yêu cầu AI tạo lại toàn bộ tính năng này từ đầu trên cùng stack:

---

```
Vai trò: Bạn là Senior Frontend Developer chuyên Vue 3.

Dự án: Ứng dụng web giáo dục "EmpathyKids" (Vue 3 Composition API, Pinia, Tailwind CSS,
Vue Router 4, Vite). Font: Quicksand (Google Fonts).

Cấu trúc hiện tại của Dashboard.vue (/app route):
  - Flex container h-screen overflow-hidden
  - LEFT: <Sidebar /> — w-64, cố định, KHÔNG SỬA
  - CENTER: flex-1 h-full — THAY THẾ HOÀN TOÀN
  - RIGHT: Panel w-80 với streak/sao/nhiệm vụ — cố định, KHÔNG SỬA

Pinia store (useProgressStore) cung cấp:
  - store.levels: mảng các level, mỗi level có:
      { id, name, locked, lessons: { flashcard, matching, context, emotion_training, ai } }
      lessons[type] là truthy nếu đã hoàn thành
  - store.stars: số sao của người dùng
  - store.currentStreak: chuỗi ngày học
  - store.fetchLevelsFromAPI(): async, gọi trong onMounted
Router: router.push('/learn/:levelId/:lessonType') để vào bài học

NHIỆM VỤ: Tạo component RacingTrack.vue và cập nhật Dashboard.vue.

=== YÊU CẦU RACINGTRACK.VUE ===

LAYOUT (absolute inset-0 flex):
  - Cỏ trái (13% width, xanh gradient): cây emoji cuộn parallax 0.35× tốc độ xe
  - Đường (flex-1, nền #3d4f5c): 3 làn, 2 vạch kẻ vàng dashed animated
  - Cỏ phải (13% width): tương tự cỏ trái

HỆ TỌA ĐỘ:
  - cameraScroll tăng dần (GAME_SPEED = 0.28 per 16ms tick)
  - screenTop(obj) = obj.startTop + cameraScroll
  - Xe cố định tại top: 78% (COLLISION_Y = 78, PLAYER_TOP = 78)
  - Chỉ render object khi screenTop ∈ (-14, 112)

XE NGƯỜI CHƠI (CSS top-down, không dùng emoji):
  - Thân đỏ (#f43f5e) bo tròn 38×56px, border #fb7185
  - Kính trước màu trời (#bae6fd) ở top
  - Kính sau nhỏ hơn ở bottom
  - 2 đèn vàng (#fef08a) ở mũi xe
  - 4 bánh đen (#1e293b) nhô ra 4 góc
  - LANE_PCTS = [16.66, 50, 83.33] — % từ trái của road
  - Transition 150ms khi đổi làn

SINH TRACK (buildTrack):
  pos bắt đầu = -28
  Với mỗi level (store.levels) × mỗi lessonType ['flashcard','matching','context','emotion_training','ai']:
    1. Thêm 2–3 obstacles (pos -= 28+o*4 mỗi object):
       { id, type:'obstacle', startTop:pos, lane:(o+tIdx+lIdx)%3,
         lessonType, levelId, levelIndex, emojiIdx, triggered:false }
    2. pos -= 35
    3. Thêm 1 checkpoint (pos -= 35 trước đó):
       { id, type:'checkpoint', startTop:pos, lane:'all',
         lessonType, levelId, levelIndex,
         lessonDone: !!level.lessons?.[lessonType],
         triggered: false }   ← QUAN TRỌNG: luôn false, không pre-trigger
    4. pos -= 105

GAME LOOP (setInterval 16ms) — CROSSING DETECTION:
  const prevScroll = cameraScroll.value;
  const nextScroll = prevScroll + GAME_SPEED;
  for (obj of gameObjects) {
    if (obj.triggered) continue;
    const collideAt = COLLISION_Y - obj.startTop;
    if (prevScroll < collideAt && nextScroll >= collideAt) {
      if (obj.type === 'checkpoint') {
        obj.triggered = true;
        // LUÔN trigger modal (không check lessonDone ở đây)
        pause game + show modal + activeLesson = {...obj, isCheckpoint:true}; break;
      } else if (obj.lane === playerLane) {
        obj.triggered = true;
        car wiggle + pause + show modal + activeLesson = {...obj, isCheckpoint:false}; break;
      } else {
        obj.triggered = true; // dodge
      }
    } else if (nextScroll > collideAt + 8) {
      obj.triggered = true; // cleanup
    }
  }
  if (!hitSomething) cameraScroll.value = nextScroll;

LESSON MODAL (Teleport to body, Transition):
  Header màu theo lesson type, icon emoji + tên bài
  Checkpoint + lessonDone=false → "🚧 Trạm Bắt Buộc" → chỉ nút "Bắt đầu! 🚀"
  Checkpoint + lessonDone=true  → "✅ Đã Hoàn Thành" → nút "Đi tiếp ✅" + "Ôn lại 📖"
  Obstacle                      → "⚡ Nhiệm Vụ Bắt Buộc" → chỉ nút "Bắt đầu! 🚀"
  KHÔNG có nút bỏ qua cho obstacle.
  startLesson() → router.push('/learn/levelId/lessonType')
  continueRace() → chỉ đóng modal, resume game (cho checkpoint đã làm)

STATE:
  gameStarted = ref(false) — hiện Start overlay khi false
  gamePaused  = ref(false) — pause giữa game
  Tick: if (!gameStarted || gamePaused) return;

START OVERLAY (khi gameStarted=false):
  Nền tối + blur, emoji 🏎️, preview 3 làn, nút "BẮT ĐẦU! 🚀" (xanh lá)
  Ghi chú phím điều khiển

PAUSE OVERLAY (khi gameStarted && gamePaused && !showModal):
  Nền tối + blur, icon ⏸️, nút "▶ Tiếp tục"

HUD (top center, z-30):
  Màn X/Y | ⭐ stars | 🔥 streak | nút ⏸/▶ (chỉ hiện khi gameStarted)

CONTROLS (bottom center, z-30):
  Nút ◀ và ▶: click + touchstart.prevent
  Keyboard: ArrowLeft, ArrowRight, Escape (toggle pause)
  tabindex="0" @keydown trên root div

LANE STRIPES (CSS animation):
  div height:200%, repeating-linear-gradient vạch vàng 22px/46px
  animation: translateY(0→50%) 0.65s linear infinite
  Dừng animation khi game chưa start hoặc đang pause

LESSON METADATA:
  flashcard:        { name:'Thẻ Ghi Nhớ',        emoji:'📚', color:'#f59e0b', shadow:'#d97706' }
  matching:         { name:'Ghép Hình',            emoji:'🧩', color:'#f43f5e', shadow:'#e11d48' }
  context:          { name:'Ngữ Cảnh Xã Hội',     emoji:'💬', color:'#0ea5e9', shadow:'#0284c7' }
  emotion_training: { name:'Luyện Tập Cảm Xúc',  emoji:'🏋️', color:'#f97316', shadow:'#ea580c' }
  ai:               { name:'Nhận Diện Khuôn Mặt', emoji:'🤖', color:'#8b5cf6', shadow:'#7c3aed' }

CHECKPOINT STYLE: nền = color, border: rgba(255,255,255,.45) bo tròn 2xl
OBSTACLE STYLE: nền pastel (amber/rose/sky/orange/violet), bo tròn, pulse animation

=== CẬP NHẬT DASHBOARD.VUE ===

Giữ nguyên cấu trúc flex 3 cột.
Xóa toàn bộ vùng giữa (div flex-1 h-full overflow-y-auto ... và mọi nội dung trong đó).
Thay bằng <RacingTrack />.
Import RacingTrack từ '../components/RacingTrack.vue'.
Xóa các hàm không còn dùng: getLessonState, getNodeClass, goToLesson,
  handleOpenChest, createFlyingStar, isLevelDone, onMounted, useRouter.
Giữ: store = useProgressStore(), starBump = ref(false).
```

---

## 9. Ghi Chú Quan Trọng Khi Tái Hiện

1. **`triggered: false` cho tất cả checkpoint** — đây là fix quan trọng nhất. Nếu dùng `triggered: done`, mọi checkpoint của bài đã làm sẽ bị bỏ qua vĩnh viễn.

2. **Crossing detection, không phải range check** — `prevScroll < collideAt && nextScroll >= collideAt` đảm bảo không bao giờ bỏ lỡ dù browser throttle.

3. **Không filter `triggered` trong `visibleObjects`** — để object bị triggered vẫn hiển thị cho đến khi cuộn off-screen (tự nhiên hơn).

4. **`tabindex="0"` + `.focus()` trên root div** — bắt buộc để nhận keydown event trên div.

5. **Vạch làn dùng `height: 200%` + `translateY(0→50%)`** — kỹ thuật loop seamless không cần JavaScript.

6. **Modulo cây hai bên** — `((x % 112) + 112) % 112` xử lý số âm trong JavaScript (JavaScript `%` có thể trả về âm).
