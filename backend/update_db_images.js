import db from './config/db.js';
// hình ảnh mock data để test 
const imageMappings = {
  // --- LEVEL 1 ---
  "https://example.com/images/flashcard/happy_1.jpg": "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg",
  "https://example.com/images/flashcard/sad_1.jpg": "https://img.freepik.com/free-photo/sad-boy-looking-down_23-2148156754.jpg",
  "https://example.com/images/flashcard/happy_2.jpg": "https://img.freepik.com/free-photo/cheerful-kid-holding-arms-chest-smiling_23-2148156763.jpg",
  "https://example.com/images/flashcard/sad_2.jpg": "https://img.freepik.com/free-photo/upset-little-boy-sitting-floor_23-2148156738.jpg",
  "https://example.com/images/flashcard/angry_1.jpg": "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg",

  "https://example.com/images/context/gift.jpg": "https://img.freepik.com/free-vector/happy-boy-opening-birthday-gifts_1308-133444.jpg",
  "https://example.com/images/context/ice_cream_fall.jpg": "https://img.freepik.com/free-vector/sad-boy-crying-because-ice-cream-fell-down_1308-133823.jpg",
  "https://example.com/images/context/broken_toy.jpg": "https://img.freepik.com/free-vector/sad-crying-boy-with-broken-toy-airplane-cartoon-vector-illustration_1196-857.jpg",

  "https://example.com/images/matching/vui_1_face.jpg": "https://img.freepik.com/free-vector/face-boy-with-happy-expression_1308-133454.jpg",
  "https://example.com/images/matching/vui_1_text.jpg": "https://img.freepik.com/free-vector/hand-drawn-happy-word-concept_23-2149021612.jpg",
  "https://example.com/images/matching/buon_1_face.jpg": "https://img.freepik.com/free-vector/face-boy-with-sad-expression_1308-133455.jpg",
  "https://example.com/images/matching/buon_1_text.jpg": "https://img.freepik.com/free-vector/flat-hand-drawn-sadness-concept-illustration_23-2148842189.jpg",
  "https://example.com/images/matching/vui_2_face.jpg": "https://img.freepik.com/free-vector/happy-girl-cartoon-character_1308-133445.jpg",
  "https://example.com/images/matching/vui_2_text.jpg": "https://img.freepik.com/free-vector/cute-font-design-happy-word_1308-124971.jpg",
  "https://example.com/images/matching/buon_2_face.jpg": "https://img.freepik.com/free-vector/little-girl-crying-cartoon-character_1308-140026.jpg",
  "https://example.com/images/matching/buon_2_text.jpg": "https://img.freepik.com/free-vector/flat-sad-girl-concept-illustration_23-2148834522.jpg",
  "https://example.com/images/matching/gian_1_face.jpg": "https://img.freepik.com/free-vector/angry-boy-cartoon-character_1308-135541.jpg",
  "https://example.com/images/matching/gian_1_text.jpg": "https://img.freepik.com/free-vector/flat-hand-drawn-anger-concept-illustration_23-2148838382.jpg",

  "https://example.com/images/training/guide_vui.jpg": "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg",

  // --- LEVEL 2 ---
  "https://example.com/images/flashcard/angry_2.jpg": "https://img.freepik.com/free-photo/portrait-irritated-angry-boy-white-background_23-2148156762.jpg",
  "https://example.com/images/flashcard/fear_1.jpg": "https://img.freepik.com/free-photo/little-boy-hiding-behind-bed_23-2148156751.jpg",
  "https://example.com/images/flashcard/angry_3.jpg": "https://img.freepik.com/free-photo/portrait-screaming-angry-boy-isolated-white-background_23-2148156760.jpg",
  "https://example.com/images/flashcard/fear_2.jpg": "https://img.freepik.com/free-photo/scared-little-boy-covering-his-face-blanket_23-2148156753.jpg",

  "https://example.com/images/context/thunder.jpg": "https://img.freepik.com/free-vector/cute-little-kid-frightened-by-thunderstorm_97632-1596.jpg",
  "https://example.com/images/context/broken_vase.jpg": "https://img.freepik.com/free-vector/clumsy-little-boy-breaking-porcelain-vase_1308-142010.jpg",
  "https://example.com/images/context/dark_room.jpg": "https://img.freepik.com/free-vector/frightened-boy-bed-dark-bedroom_1308-143029.jpg",

  "https://example.com/images/matching/gian_2_face.jpg": "https://img.freepik.com/free-vector/cute-girl-angry-expression_1308-135898.jpg",
  "https://example.com/images/matching/gian_2_text.jpg": "https://img.freepik.com/free-vector/font-design-word-angry_1308-124976.jpg",
  "https://example.com/images/matching/so_1_face.jpg": "https://img.freepik.com/free-vector/scared-little-boy-cartoon_1308-136585.jpg",
  "https://example.com/images/matching/so_1_text.jpg": "https://img.freepik.com/free-vector/hand-drawn-fear-word-concept_23-2149021617.jpg",
  "https://example.com/images/matching/gian_3_face.jpg": "https://img.freepik.com/free-vector/boy-screaming-angry-face-expression_1308-135876.jpg",
  "https://example.com/images/matching/gian_3_text.jpg": "https://img.freepik.com/free-vector/flat-anger-concept-illustration_23-2148834521.jpg",
  "https://example.com/images/matching/so_2_face.jpg": "https://img.freepik.com/free-vector/scared-little-girl-cartoon_1308-136587.jpg",
  "https://example.com/images/matching/so_2_text.jpg": "https://img.freepik.com/free-vector/flat-hand-drawn-fear-concept-illustration_23-2148838385.jpg",

  "https://example.com/images/training/guide_gian.jpg": "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg",

  // --- LEVEL 3 ---
  "https://example.com/images/flashcard/surprise_1.jpg": "https://img.freepik.com/free-photo/surprised-little-boy-portrait_23-2148156741.jpg",
  "https://example.com/images/flashcard/disgust_1.jpg": "https://img.freepik.com/free-photo/disgusted-boy-portrait-white-background_23-2148156749.jpg",
  "https://example.com/images/flashcard/surprise_2.jpg": "https://img.freepik.com/free-photo/surprised-little-girl-portrait_23-2148156743.jpg",
  "https://example.com/images/flashcard/disgust_2.jpg": "https://img.freepik.com/free-photo/portrait-disgusted-little-boy_23-2148156746.jpg",

  "https://example.com/images/context/surprise_party.jpg": "https://img.freepik.com/free-vector/kids-birthday-party-illustration_1308-133419.jpg",
  "https://example.com/images/context/bad_food.jpg": "https://img.freepik.com/free-vector/disgusted-kid-looking-moldy-bread_1308-140023.jpg",
  "https://example.com/images/context/gift_box.jpg": "https://img.freepik.com/free-vector/kid-opening-magic-gift-box_1308-136412.jpg",

  "https://example.com/images/matching/ngac_1_face.jpg": "https://img.freepik.com/free-vector/surprised-boy-cartoon-character_1308-136001.jpg",
  "https://example.com/images/matching/ngac_1_text.jpg": "https://img.freepik.com/free-vector/cute-font-design-surprise-word_1308-124978.jpg",
  "https://example.com/images/matching/ghe_1_face.jpg": "https://img.freepik.com/free-vector/boy-feeling-nauseated-cartoon-character_1308-138402.jpg",
  "https://example.com/images/matching/ghe_1_text.jpg": "https://img.freepik.com/free-vector/hand-drawn-disgust-word-concept_23-2149021619.jpg",
  "https://example.com/images/matching/ngac_2_face.jpg": "https://img.freepik.com/free-vector/surprised-girl-cartoon-character_1308-136002.jpg",
  "https://example.com/images/matching/ngac_2_text.jpg": "https://img.freepik.com/free-vector/flat-hand-drawn-surprise-concept-illustration_23-2148838388.jpg",
  "https://example.com/images/matching/ghe_2_face.jpg": "https://img.freepik.com/free-vector/girl-feeling-nauseated-cartoon-character_1308-138403.jpg",
  "https://example.com/images/matching/ghe_2_text.jpg": "https://img.freepik.com/free-vector/flat-hand-drawn-disgust-concept-illustration_23-2148834524.jpg",

  "https://example.com/images/training/guide_ngac.jpg": "https://img.freepik.com/free-photo/surprised-little-boy-portrait_23-2148156741.jpg"
};

async function main() {
  console.log("🚀 Đang bắt đầu cập nhật đường dẫn ảnh trong CSDL...");
  let updatedCount = 0;

  try {
    for (const [oldUrl, newUrl] of Object.entries(imageMappings)) {
      const [res] = await db.query(
        "UPDATE media_asset SET url = ? WHERE url = ?",
        [newUrl, oldUrl]
      );
      if (res.affectedRows > 0) {
        updatedCount += res.affectedRows;
        console.log(`✅ Đã cập nhật ảnh thành công: ${oldUrl.substring(oldUrl.lastIndexOf('/') + 1)}`);
      }
    }

    console.log(`\n🎉 HOÀN THÀNH! Đã cập nhật tổng cộng ${updatedCount} bản ghi ảnh.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi trong quá trình cập nhật:", error);
    process.exit(1);
  }
}

main();
