# HCI - Supporting Autistic children
[![Docs](https://img.shields.io/readthedocs/avocado-classifier?label=docs)](https://drive.google.com/drive/u/0/folders/1LkMgMfr8FI4MI738oRIxvh_SExdhCOuv)

## About
**Trạm Cảm Xúc (Emotion Station)** is a web-based e-learning platform designed to assist children with Autism Spectrum Disorder (ASD) in recognizing, understanding, and expressing facial emotions. Developed as a major project for the Human-Computer Interaction course (INT2041-2) at the University of Engineering and Technology, VNU Hanoi, under the instruction of Dr. Ngo Thi Duyen. The system provides a safe, game-based learning environment featuring interactive modules such as emotion quizzes, memory matching, contextual reasoning, a 3-lane race mini-game, and an **AI Mirror** that utilizes deep learning models (YuNet/SFace) to provide real-time pedagogical feedback on facial expressions.

## Installation and Usage

### 1. System Requirements:
* **Node.js**: Version 18.x or newer[cite: 2].
* **Python**: Version 3.9 or newer (for the AI Service).
* **MySQL**: Version 8.0 or newer.
* **Hardware**: A working webcam for AI Mirror and tracking features.

### 2. Installation

#### Database Setup
1. Open your MySQL client and create a new schema named: `autism_learning_v2`.
2. Import the `HCIsupport-Database/db2.sql` script to initialize the relational tables and data.

#### Backend Setup
1. Navigate to the backend directory:

```bash
cd HCIsupport-Backend
npm install
```

#### AI Service Setup
Ensure the required ONNX models:

- `face_detection_yunet_2023mar.onnx`
- `face_recognition_sface_2021dec.onnx`

are placed in the `HCIsupport-Backend/ER_model/` directory.

Create and activate a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install required packages:

```bash
pip install flask flask-cors torch torchvision transformers opencv-python pillow numpy
```

#### Frontend Setup
Navigate to the frontend directory:

```bash
cd HCIsupport-Frontend
```

Install dependencies:

```bash
npm install
```

---

### 3. Usage

To run the system, open three separate terminal windows and execute the following commands concurrently.

#### Terminal 1 (AI Service - Port 5001)

```bash
cd HCIsupport-Backend
python app.py
```

#### Terminal 2 (Backend API - Port 3000)

```bash
cd HCIsupport-Backend
  npm run dev
```
#### Terminal 3 (Frontend UI - Port 5173):

```bash
  cd HCIsupport-Frontend
  npm run dev
