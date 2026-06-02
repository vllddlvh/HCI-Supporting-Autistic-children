import os
import re
import cv2
import torch
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import transforms
from transformers import ViTForImageClassification
from PIL import Image


def remap_state_dict_keys(old_sd):
    """Convert old transformers key names to new naming convention."""
    new_sd = {}
    for k, v in old_sd.items():
        new_k = re.sub(r'vit\.encoder\.layer\.(\d+)\.', lambda m: f'vit.layers.{m.group(1)}.', k)
        new_k = new_k.replace('.attention.attention.query', '.attention.q_proj')
        new_k = new_k.replace('.attention.attention.key', '.attention.k_proj')
        new_k = new_k.replace('.attention.attention.value', '.attention.v_proj')
        new_k = new_k.replace('.attention.output.dense', '.attention.o_proj')
        new_k = new_k.replace('.intermediate.dense', '.mlp.fc1')
        new_k = new_k.replace('.output.dense', '.mlp.fc2')
        new_sd[new_k] = v
    return new_sd

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'ER_model')

YUNET_PATH = os.path.join(MODEL_DIR, 'face_detection_yunet_2023mar.onnx')
VIT_PATH = os.path.join(MODEL_DIR, 'vit_model.pth')


RAW_LABELS = [
    'dg', # 0: Genuine Disgust
    'ds', # 1: Posed Disgust
    'fg', # 2: Genuine Happiness
    'fs', # 3: Posed Happiness
    'pg', # 4: Genuine Fear
    'ps', # 5: Posed Fear
    'rg', # 6: Genuine Anger
    'rs', # 7: Posed Anger
    'sg', # 8: Genuine Surprise
    'ss', # 9: Posed Surprise
    'tg', # 10: Genuine Sadness
    'ts'  # 11: Posed Sadness
]

# Map từ mã tắt về tên tiếng Anh chuẩn mà Frontend VueJS đang dùng
MERGE_MAPPING = {
    'dg': 'disgust',   'ds': 'disgust',   # Ghê tởm
    'fg': 'happy',     'fs': 'happy',     # Vui vẻ
    'pg': 'fear',      'ps': 'fear',      # Sợ hãi
    'rg': 'angry',     'rs': 'angry',     # Giận dữ
    'sg': 'surprised', 'ss': 'surprised', # Ngạc nhiên
    'tg': 'sad',       'ts': 'sad'        # Buồn bã
}

# --- 2. LOAD MODELS ---
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"🔄 Đang khởi động trên thiết bị: {device}")

# Load Face Detector
try:
    face_detector = cv2.FaceDetectorYN.create(
        model=YUNET_PATH, config="", input_size=(320, 320),
        score_threshold=0.8, nms_threshold=0.3, top_k=5000
    )
    print("✅ YuNet loaded successfully!")
except Exception as e:
    print(f"❌ Lỗi load YuNet: {e}")

try:
    # Khởi tạo model với 12 đầu ra
    base_model = ViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224',
        num_labels=12,
        ignore_mismatched_sizes=True
    )
    
    # Load trọng số (remap keys cho tương thích transformers mới)
    state_dict = torch.load(VIT_PATH, map_location=device)
    state_dict = remap_state_dict_keys(state_dict)
    base_model.load_state_dict(state_dict)
    
    # Wrapper class
    class ViT_Wrapper(torch.nn.Module):
        def __init__(self, hf_model):
            super().__init__()
            self.vit = hf_model.vit
            self.classifier = hf_model.classifier
        def forward(self, x):
            outputs = self.vit(x)
            cls_output = outputs.last_hidden_state[:, 0, :]
            return self.classifier(cls_output)

    model = ViT_Wrapper(base_model)
    model.to(device)
    model.eval()
    print("✅ ViT Emotion Model (12 Classes) loaded successfully!")

except Exception as e:
    print(f"❌ Lỗi load ViT: {e}")

# Transform ảnh
val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.json:
        return jsonify({"status": "error", "message": "No image data"}), 400

    try:
        # Decode ảnh
        image_data = request.json['image']
        if "," in image_data: image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Detect khuôn mặt
        h, w, _ = img.shape
        face_detector.setInputSize((w, h))
        _, faces = face_detector.detect(img)

        if faces is None or len(faces) == 0:
            return jsonify({"status": "no_face", "emotions": {}})

        # Crop khuôn mặt
        box = faces[0][:4].astype(int)
        x, y, w_box, h_box = box
        
        # Crop an toàn
        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(w, x + w_box), min(h, y + h_box)
        face_crop = img[y1:y2, x1:x2]

        if face_crop.size == 0:
            return jsonify({"status": "error"})

        # Dự đoán (12 Classes)
        face_pil = Image.fromarray(cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB))
        input_tensor = val_transforms(face_pil).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            probs_np = probs.cpu().numpy()[0]

        # --- GỘP 12 NHÃN VỀ 6 NHÃN ---
        final_scores = {
            'happy': 0.0, 'sad': 0.0, 'fear': 0.0, 
            'angry': 0.0, 'surprised': 0.0, 'disgust': 0.0
        }

        for i, raw_score in enumerate(probs_np):
            raw_label = RAW_LABELS[i]
            target_label = MERGE_MAPPING.get(raw_label)
            if target_label:
                final_scores[target_label] += raw_score

        # Chuyển về % (Integer)
        response_emotions = {k: int(v * 100) for k, v in final_scores.items()}
        dominant_emotion = max(response_emotions, key=response_emotions.get)

        # Log kiểm tra
        print(f"Detected: {dominant_emotion} (Raw: {response_emotions})")

        return jsonify({
            "status": "success",
            "dominant": dominant_emotion,
            "emotions": response_emotions
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)