import streamlit as st
import cv2
import tempfile
import os
import time
import pandas as pd
import numpy as np
import torch
from core.pipeline import MatchAnalyticsPipeline

# Streamlit Page Configuration
st.set_page_config(
    page_title="PITCHLAB | AI Tactical Sports Intelligence",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling: Refined Beige, Brown, and Forest Green Aesthetic
st.markdown("""
<style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');

    /* Global Colors & Typography */
    :root {
        --bg-beige: #FBF8F3;
        --card-beige: #FFFFFF;
        --card-subtle: #F5EFE6;
        --border-beige: #E6DDCF;
        --border-dark: #CEBFAB;
        --text-espresso: #281D17;
        --text-brown: #5C473B;
        --text-muted: #8E7A6E;
        --forest-green: #245235;
        --forest-green-hover: #1A3E27;
        --sage-green: #4D7A5C;
        --light-sage: #E8F0EA;
        --warm-terracotta: #A65A42;
        --gold-amber: #D49A3D;
    }

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: var(--text-espresso);
    }

    .stApp {
        background-color: var(--bg-beige);
    }

    /* Sidebar Customization */
    section[data-testid="stSidebar"] {
        background-color: #F4EDE2 !important;
        border-right: 1px solid var(--border-beige);
    }

    section[data-testid="stSidebar"] h1, 
    section[data-testid="stSidebar"] h2, 
    section[data-testid="stSidebar"] h3 {
        color: var(--text-espresso) !important;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.05rem !important;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    /* Top Brand Header */
    .brand-pill {
        display: inline-block;
        background-color: var(--light-sage);
        color: var(--forest-green);
        border: 1px solid #CADBCF;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: 20px;
        margin-bottom: 0.6rem;
    }

    .main-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 2.3rem;
        font-weight: 800;
        color: var(--text-espresso);
        letter-spacing: -0.5px;
        margin-bottom: 0.2rem;
        line-height: 1.2;
    }

    .main-title span {
        color: var(--forest-green);
    }

    .sub-title {
        font-size: 1.02rem;
        color: var(--text-brown);
        font-weight: 400;
        margin-bottom: 1.8rem;
    }

    /* Metric Cards */
    .metric-card {
        background-color: var(--card-beige);
        border-radius: 12px;
        padding: 18px 14px;
        border: 1px solid var(--border-beige);
        box-shadow: 0 2px 8px rgba(60, 45, 35, 0.04);
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(60, 45, 35, 0.08);
        border-color: var(--border-dark);
    }

    .metric-val {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.9rem;
        font-weight: 700;
        color: var(--forest-green);
        line-height: 1.1;
        margin-bottom: 4px;
    }

    .metric-label {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.8px;
    }

    /* Primary Action Buttons */
    .stButton > button[kind="primary"], .stButton > button {
        background-color: var(--forest-green) !important;
        color: #FDFBF7 !important;
        border: 1px solid #1E462D !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        padding: 0.6rem 1.2rem !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 6px rgba(36, 82, 53, 0.2) !important;
    }

    .stButton > button:hover {
        background-color: var(--forest-green-hover) !important;
        color: #FFFFFF !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 10px rgba(36, 82, 53, 0.3) !important;
    }

    /* Sliders and Input Controls */
    div[data-testid="stSlider"] label {
        color: var(--text-espresso) !important;
        font-weight: 600 !important;
    }

    /* Section Subheaders */
    h2, h3 {
        font-family: 'Space Grotesk', sans-serif !important;
        color: var(--text-espresso) !important;
        font-weight: 700 !important;
    }

    /* Tab navigation styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 12px;
        border-bottom: 1px solid var(--border-beige);
        margin-bottom: 1.2rem;
    }

    .stTabs [data-baseweb="tab"] {
        padding: 8px 18px;
        background-color: transparent;
        color: var(--text-brown);
        font-weight: 600;
        font-size: 0.95rem;
        border-radius: 6px 6px 0 0;
    }

    .stTabs [aria-selected="true"] {
        color: var(--forest-green) !important;
        border-bottom: 3px solid var(--forest-green) !important;
    }

    /* Progress Bar */
    .stProgress > div > div > div > div {
        background-color: var(--forest-green) !important;
    }

    /* Alert / Callout Boxes */
    div[data-testid="stAlert"] {
        border-radius: 8px !important;
        border: 1px solid var(--border-beige) !important;
    }
</style>
""", unsafe_allow_html=True)

# App Header
st.markdown('<div class="brand-pill">⚽ PITCHLAB ANALYTICS ENGINE</div>', unsafe_allow_html=True)
st.markdown('<div class="main-title">Sports Vision & <span>Tactical Intelligence</span></div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Spatial player tracking, 2D pitch homography telemetry, and dynamic physical performance metrics.</div>', unsafe_allow_html=True)

# Sidebar Configuration
st.sidebar.markdown("### ⚙️ Pipeline Settings")

# Hardware & Acceleration
cuda_available = torch.cuda.is_available()
gpu_name = torch.cuda.get_device_name(0) if cuda_available else "CPU (Standard)"
st.sidebar.info(f"**Compute:** {gpu_name}\n\n**CUDA:** {'Active 🚀' if cuda_available else 'CPU Mode'}")

weights_exist = os.path.exists("yolov8n.pt")
if weights_exist:
    st.sidebar.success("✅ Deep Learning Model: YOLOv8 Active")
else:
    st.sidebar.warning(
        "⚡ **YOLOv8 Weights Pending**\n\n"
        "Using CV Fallback Tracker. To activate Deep Learning YOLO:\n"
        "[Click here to download yolov8n.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8n.pt) "
        "and drop it directly into `cvProject/` folder."
    )

device_option = st.sidebar.selectbox("Inference Device", ["cuda:0" if cuda_available else "cpu", "cpu"])

# Model Selection
model_choice = st.sidebar.selectbox(
    "YOLO Vision Model",
    ["yolov8n.pt (Ultra Fast)", "yolov8s.pt (Balanced)", "yolov8m.pt (High Accuracy)"],
    index=0
)
model_name = model_choice.split()[0]

conf_thresh = st.sidebar.slider("Detection Confidence Threshold", min_value=0.15, max_value=0.80, value=0.25, step=0.05)
max_frames_limit = st.sidebar.slider("Max Frames to Process", min_value=50, max_value=1000, value=250, step=50)

# Input Video Source
st.sidebar.markdown("### 📹 Video Source")
video_source = st.sidebar.radio(
    "Choose Input:", 
    ["Pre-loaded Demo Match (sample_match.mp4)", "Upload Match Video (.mp4)", "Generate Dynamic Simulation"],
    index=0
)

temp_video_path = None

if video_source == "Pre-loaded Demo Match (sample_match.mp4)":
    temp_video_path = "sample_match.mp4"
    st.sidebar.caption("✅ Bundled realistic 11v11 tactical football simulation ready to run.")
elif video_source == "Upload Match Video (.mp4)":
    uploaded_file = st.sidebar.file_uploader("Upload Football Match Clip", type=["mp4", "avi", "mov", "mkv"])
    if uploaded_file is not None:
        tfile = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        tfile.write(uploaded_file.read())
        temp_video_path = tfile.name
else:
    st.sidebar.caption("Generates a dynamic 2-team tactical simulation to test the full pipeline immediately.")

# Main Processing Action
start_analysis = st.sidebar.button("🚀 Run Tactical Analysis", type="primary", use_container_width=True)

# Layout Columns
col_video, col_radar = st.columns([1.1, 0.9])

with col_video:
    st.markdown("### 📺 Broadcast Camera View")
    video_placeholder = st.empty()

with col_radar:
    st.markdown("### 🗺️ 2D Tactical Pitch Radar")
    radar_placeholder = st.empty()

# Metrics Row
st.markdown("<div style='margin-top: 15px;'></div>", unsafe_allow_html=True)
mcol1, mcol2, mcol3, mcol4 = st.columns(4)
metric_possession = mcol1.empty()
metric_players = mcol2.empty()
metric_fps = mcol3.empty()
metric_status = mcol4.empty()

# Analysis Tabs
tab_charts, tab_data = st.tabs(["📊 Physical Performance Leaderboards", "📋 Raw Analyst Export"])


def generate_synthetic_demo_video(output_path, num_frames=180, w=1280, h=720):
    """
    Creates a synthetic green football pitch clip with 2 teams moving tactically for immediate testing.
    """
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, 30.0, (w, h))

    np.random.seed(42)
    team0_pos = np.array([[300 + i*60, 200 + (i%3)*100] for i in range(7)], dtype=np.float32)
    team1_pos = np.array([[700 + i*60, 220 + (i%3)*100] for i in range(7)], dtype=np.float32)
    ball_pos = np.array([640.0, 360.0], dtype=np.float32)

    for f in range(num_frames):
        img = np.full((h, w, 3), (38, 115, 46), dtype=np.uint8) # Football grass green
        
        # White pitch lines
        cv2.rectangle(img, (80, 60), (w - 80, h - 60), (240, 240, 240), 2)
        cv2.line(img, (w // 2, 60), (w // 2, h - 60), (240, 240, 240), 2)
        cv2.circle(img, (w // 2, h // 2), 90, (240, 240, 240), 2)

        # Move players slightly
        team0_pos += np.random.uniform(-1.8, 2.2, size=team0_pos.shape)
        team1_pos += np.random.uniform(-2.2, 1.8, size=team1_pos.shape)
        ball_pos += np.random.uniform(-3.5, 3.5, size=2)

        # Draw Team Alpha (Terracotta Red)
        for p in team0_pos:
            x, y = int(p[0]), int(p[1])
            cv2.rectangle(img, (x-12, y-30), (x+12, y), (35, 45, 220), -1)
            cv2.rectangle(img, (x-10, y), (x+10, y+22), (245, 245, 240), -1)
            cv2.circle(img, (x, y-38), 9, (190, 215, 240), -1)

        # Draw Team Beta (Deep Teal / Blue)
        for p in team1_pos:
            x, y = int(p[0]), int(p[1])
            cv2.rectangle(img, (x-12, y-30), (x+12, y), (210, 115, 30), -1)
            cv2.rectangle(img, (x-10, y), (x+10, y+22), (40, 40, 40), -1)
            cv2.circle(img, (x, y-38), 9, (190, 215, 240), -1)

        # Draw Ball
        bx, by = int(ball_pos[0]), int(ball_pos[1])
        cv2.circle(img, (bx, by), 8, (255, 255, 255), -1)
        cv2.circle(img, (bx, by), 8, (30, 30, 30), 1)

        out.write(img)

    out.release()


if start_analysis:
    if video_source == "Generate Dynamic Simulation" or (temp_video_path is None and not os.path.exists("sample_match.mp4")):
        with st.spinner("Generating dynamic tactical football footage..."):
            tfile = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
            temp_video_path = tfile.name
            generate_synthetic_demo_video(temp_video_path, num_frames=150)
    elif temp_video_path is None:
        temp_video_path = "sample_match.mp4"

    cap = cv2.VideoCapture(temp_video_path)
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frames_to_process = min(total_video_frames, max_frames_limit)

    st.toast(f"Starting tactical analysis on {frames_to_process} frames at {fps:.1f} FPS...", icon="⚽")

    # Initialize Pipeline
    pipeline = MatchAnalyticsPipeline(model_name=model_name, device=device_option, conf_thresh=conf_thresh)
    pipeline.initialize_metrics(fps=fps)

    progress_bar = st.progress(0)
    frame_idx = 0
    t_start = time.time()

    while cap.isOpened() and frame_idx < frames_to_process:
        ret, frame = cap.read()
        if not ret:
            break

        # Process frame through full vision & analytics pipeline
        t_frame_start = time.time()
        results = pipeline.process_frame(frame, frame_idx, frames_to_process)
        frame_time = time.time() - t_frame_start
        curr_fps = 1.0 / max(frame_time, 1e-4)

        # Update Live Displays
        annotated_rgb = cv2.cvtColor(results['annotated_frame'], cv2.COLOR_BGR2RGB)
        radar_rgb = cv2.cvtColor(results['radar_img'], cv2.COLOR_BGR2RGB)

        video_placeholder.image(annotated_rgb, use_container_width=True)
        radar_placeholder.image(radar_rgb, use_container_width=True)

        # Update Metrics
        possession = results['possession']
        metric_possession.markdown(f"""
        <div class="metric-card">
            <div class="metric-val">{possession.get(0, 50):.0f}% vs {possession.get(1, 50):.0f}%</div>
            <div class="metric-label">Possession (Alpha vs Beta)</div>
        </div>
        """, unsafe_allow_html=True)

        metric_players.markdown(f"""
        <div class="metric-card">
            <div class="metric-val">{results['num_players']}</div>
            <div class="metric-label">Tracked Players</div>
        </div>
        """, unsafe_allow_html=True)

        metric_fps.markdown(f"""
        <div class="metric-card">
            <div class="metric-val">{curr_fps:.1f}</div>
            <div class="metric-label">Inference FPS</div>
        </div>
        """, unsafe_allow_html=True)

        metric_status.markdown(f"""
        <div class="metric-card">
            <div class="metric-val">{frame_idx + 1} / {frames_to_process}</div>
            <div class="metric-label">Processed Frames</div>
        </div>
        """, unsafe_allow_html=True)

        frame_idx += 1
        progress_bar.progress(frame_idx / frames_to_process)

    cap.release()
    total_elapsed = time.time() - t_start
    st.success(f"Analysis completed in {total_elapsed:.1f} seconds ({frames_to_process / max(total_elapsed, 0.1):.1f} avg FPS)!")

    # Post-Match Analytics
    summary = pipeline.get_summary_statistics()

    with tab_charts:
        chart_col1, chart_col2 = st.columns(2)
        
        with chart_col1:
            st.markdown("#### ⚡ Peak Sprint Speeds (km/h)")
            if summary.get('top_speeds'):
                df_speeds = pd.DataFrame(summary['top_speeds'])
                st.bar_chart(df_speeds.set_index('player_id'), color="#245235")
            else:
                st.info("No player speed records accumulated.")

        with chart_col2:
            st.markdown("#### 🏃 Cumulative Distance Covered (Meters)")
            if summary.get('distances'):
                df_dist = pd.DataFrame(summary['distances'])
                st.bar_chart(df_dist.set_index('player_id'), color="#A65A42")
            else:
                st.info("No player distance records accumulated.")

    with tab_data:
        st.markdown("#### 📋 Performance Telemetry Dataset")
        combined_records = []
        for pid in pipeline.metrics.cumulative_distance:
            if pid != -1:
                combined_records.append({
                    "Player ID": f"Player #{pid}",
                    "Top Speed (km/h)": pipeline.metrics.top_speeds.get(pid, 0.0),
                    "Distance Covered (m)": round(pipeline.metrics.cumulative_distance.get(pid, 0.0), 2)
                })
        
        if combined_records:
            df_full = pd.DataFrame(combined_records).sort_values(by="Distance Covered (m)", ascending=False)
            st.dataframe(df_full, use_container_width=True)
            
            csv_data = df_full.to_csv(index=False).encode('utf-8')
            st.download_button(
                label="📥 Download Match Report (CSV)",
                data=csv_data,
                file_name="tactical_match_analysis_report.csv",
                mime="text/csv"
            )
else:
    # Initial placeholder state before analysis starts
    video_placeholder.info("👈 Select a video source or simulation in the sidebar and click **Run Tactical Analysis**.")
    radar_placeholder.image(pipeline_temp := MatchAnalyticsPipeline().radar.draw_blank_pitch(), caption="Standard 2D Football Pitch (105m x 68m)", use_container_width=True)
    metric_possession.markdown('<div class="metric-card"><div class="metric-val">--%</div><div class="metric-label">Team Possession</div></div>', unsafe_allow_html=True)
    metric_players.markdown('<div class="metric-card"><div class="metric-val">0</div><div class="metric-label">Tracked Players</div></div>', unsafe_allow_html=True)
    metric_fps.markdown('<div class="metric-card"><div class="metric-val">--</div><div class="metric-label">Inference FPS</div></div>', unsafe_allow_html=True)
    metric_status.markdown('<div class="metric-card"><div class="metric-val">Ready</div><div class="metric-label">Pipeline Status</div></div>', unsafe_allow_html=True)
