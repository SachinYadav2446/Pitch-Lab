# ⚽ AI Sports Vision & Tactical Analytics Dashboard

A high-performance Deep Learning & Computer Vision application designed for football (soccer) match analysis. The system automatically tracks players and the ball across video frames, clusters players into teams via jersey color analysis, projects player positions onto a metric 2D tactical pitch radar using homography perspective transformations, and computes physical performance analytics (velocity, sprint distance, and possession).

---

## 🌟 Key Features

1. **Multi-Object Detection & Tracking:**
   - Powered by **YOLOv8** with **ByteTrack** for persistent player and ball identity tracking across frames.
   - Interpolated ball tracker to maintain smooth ball trajectories during fast passes.

2. **Automated Team Color Clustering (K-Means):**
   - Automatically crops the upper jersey region of tracked players and filters out pitch grass in HSV color space.
   - Applies K-Means clustering to distinguish **Team Alpha vs. Team Beta vs. Referees**.

3. **2D Tactical Pitch Radar (Homography Calibration):**
   - Camera perspective is transformed into a standardized 2D bird's-eye pitch ($105\text{m} \times 68\text{m}$).
   - Displays real-time synchronized player and ball positions on an interactive tactical minimap.

4. **Physical & Tactical Analytics Engine:**
   - **Speed (km/h):** Instantaneous velocity computed from ground plane displacement with rolling-window exponential smoothing.
   - **Cumulative Distance (Meters):** Total sprint and jog distance covered by each player.
   - **Ball Possession %:** Dynamic proximity-based ball possession tracking.
   - **Team Shape & Compactness:** Real-time geometric centroid calculation.

5. **Broadcast-Quality Visual Overlays:**
   - Tactical ellipses and glowing ground rings beneath players' feet.
   - Player ID and Speed HUD badges.
   - Inverted triangle ball indicator.
   - Side-by-side composite presentation (Broadcast View + 2D Radar).

6. **Interactive Web App (Streamlit):**
   - Upload match clips or run the pre-bundled 11v11 tactical match simulation.
   - Live speed leaderboards and distance covered bar charts.
   - 1-click export of tactical performance data to CSV.

---

## 🏗️ Architecture

```
Broadcast Match Video (3D Perspective)
                  │
                  ▼
   1. YOLOv8 + ByteTrack Tracker
      (Bounding boxes + Persistent IDs)
                  │
         ┌────────┴────────┐
         ▼                 ▼
2. Team Classifier    3. Pitch Homography
   (K-Means Jersey       (Perspective Transform:
    Color Clustering)     Camera ➔ 2D Pitch Metric Space)
         └────────┬────────┘
                  ▼
   4. Tactical & Physical Analytics
      (Speed km/h, Distance, Possession %, Centroids)
                  │
                  ▼
   5. Synchronized Dashboard
      - Left: Broadcast Match Overlays (Rings, HUD, Speeds)
      - Right: 2D Tactical Pitch Radar
      - Bottom: Performance Leaderboards & CSV Export
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Python 3.10+ installed. A dedicated GPU (e.g., NVIDIA GeForce RTX 4050) is supported for accelerated inference.

### 2. Launch the Application
Run the Streamlit web dashboard:
```powershell
streamlit run app.py
```

Open your browser at `http://localhost:8501`.

### 3. Running Analysis
1. In the sidebar, select **Pre-loaded Demo Match (sample_match.mp4)** or upload your own football match footage (`.mp4`).
2. Click **🚀 Run Tactical Analysis**.
3. Watch the live side-by-side broadcast tracking and 2D radar, view performance metrics, and download the match report!

---

## 📁 Project Structure

```
cvProject/
│
├── core/
│   ├── tracker.py         # YOLOv8 + ByteTrack object detection and tracking
│   ├── team_classifier.py # K-Means jersey color clustering
│   ├── homography.py      # Camera perspective transform to 2D pitch coordinates
│   └── pipeline.py        # End-to-end match analytics orchestrator
│
├── analytics/
│   ├── radar.py           # 2D pitch minimap renderer (105m x 68m)
│   ├── metrics.py         # Speed (km/h), distance covered, and possession logic
│   └── annotator.py       # Tactical ground rings, HUD, and side-by-side visualizer
│
├── generate_sample.py     # Script to generate tactical match video simulations
├── sample_match.mp4       # Pre-rendered 11v11 test match footage
├── app.py                 # Streamlit web dashboard
└── requirements.txt       # Project dependencies
```
