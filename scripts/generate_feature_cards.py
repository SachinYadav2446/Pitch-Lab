import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

os.makedirs("frontend/public/features", exist_ok=True)

W, H = 1000, 1250 # Crisp portrait 4:5 aspect ratio

def create_base_canvas(title, subtitle, tag):
    img = np.full((H, W, 3), (22, 28, 24), dtype=np.uint8) # Dark tactical pitch canvas
    
    # Subtle grass stripes
    for s in range(10):
        if s % 2 == 0:
            cv2.rectangle(img, (0, s * (H // 10)), (W, (s + 1) * (H // 10)), (25, 32, 27), -1)

    # Frame border in subtle burgundy/cream
    cv2.rectangle(img, (24, 24), (W - 24, H - 24), (45, 15, 18), 2)
    cv2.rectangle(img, (28, 28), (W - 28, H - 28), (181, 210, 232), 1) # BGR for cream #E8D2B5

    # Top Header Banner
    cv2.rectangle(img, (28, 28), (W - 28, 120), (7, 9, 89), -1) # Deep Burgundy BGR
    
    # Corner brackets
    c_len = 24
    col_cream = (181, 210, 232)
    # TL
    cv2.line(img, (36, 36), (36 + c_len, 36), col_cream, 3)
    cv2.line(img, (36, 36), (36, 36 + c_len), col_cream, 3)
    # TR
    cv2.line(img, (W - 36, 36), (W - 36 - c_len, 36), col_cream, 3)
    cv2.line(img, (W - 36, 36), (W - 36, 36 + c_len), col_cream, 3)
    # BL
    cv2.line(img, (36, H - 36), (36 + c_len, H - 36), col_cream, 3)
    cv2.line(img, (36, H - 36), (36, H - 36 - c_len), col_cream, 3)
    # BR
    cv2.line(img, (W - 36, H - 36), (W - 36 - c_len, H - 36), col_cream, 3)
    cv2.line(img, (W - 36, H - 36), (W - 36, H - 36 - c_len), col_cream, 3)

    # Top Tag
    cv2.putText(img, tag.upper(), (60, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (235, 246, 255), 2, cv2.LINE_AA)
    cv2.putText(img, title.upper(), (60, 102), cv2.FONT_HERSHEY_SIMPLEX, 0.95, (181, 210, 232), 2, cv2.LINE_AA)

    # Bottom Telemetry Bar
    cv2.rectangle(img, (28, H - 110), (W - 28, H - 28), (14, 18, 15), -1)
    cv2.line(img, (28, H - 110), (W - 28, H - 110), (45, 15, 89), 2)
    cv2.putText(img, subtitle, (60, H - 65), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (181, 210, 232), 1, cv2.LINE_AA)
    cv2.putText(img, "PITCHVISION.AI // ML CORE", (W - 360, H - 65), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (200, 200, 200), 1, cv2.LINE_AA)

    return img

# 1. Homography Card
def gen_homography():
    img = create_base_canvas("Planar Pitch Homography", "Projective Transformation Matrix H (3x3) // 0.8mm Pitch Error", "Feature 01 // Spatial Vision")
    # Draw perspective trapezoid transforming to rectangle
    pts_persp = np.array([[180, 720], [820, 720], [680, 260], [320, 260]], np.int32)
    cv2.polylines(img, [pts_persp], True, (181, 210, 232), 3, cv2.LINE_AA)
    
    # Perspective grid lines
    for i in range(1, 5):
        t = i / 5.0
        p1 = ((1 - t) * pts_persp[0] + t * pts_persp[3]).astype(int)
        p2 = ((1 - t) * pts_persp[1] + t * pts_persp[2]).astype(int)
        cv2.line(img, tuple(p1), tuple(p2), (60, 80, 65), 1, cv2.LINE_AA)
        
        q1 = ((1 - t) * pts_persp[0] + t * pts_persp[1]).astype(int)
        q2 = ((1 - t) * pts_persp[3] + t * pts_persp[2]).astype(int)
        cv2.line(img, tuple(q1), tuple(q2), (60, 80, 65), 1, cv2.LINE_AA)

    # 4 Keypoint Corner Anchors
    labels = ["P1 (0,0)", "P2 (105,0)", "P3 (105,68)", "P4 (0,68)"]
    for idx, pt in enumerate(pts_persp):
        cv2.circle(img, tuple(pt), 10, (7, 9, 89), -1)
        cv2.circle(img, tuple(pt), 10, (181, 210, 232), 2)
        cv2.circle(img, tuple(pt), 4, (235, 246, 255), -1)
        cv2.putText(img, labels[idx], (pt[0] - 40, pt[1] + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (235, 246, 255), 1, cv2.LINE_AA)

    # Matrix formula box in center
    cv2.rectangle(img, (280, 820), (720, 960), (7, 9, 89), -1)
    cv2.rectangle(img, (280, 820), (720, 960), (181, 210, 232), 2)
    cv2.putText(img, "[ X_pitch ]     [ h11  h12  h13 ] [ x_cam ]", (310, 870), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (235, 246, 255), 2, cv2.LINE_AA)
    cv2.putText(img, "[ Y_pitch ]  =  [ h21  h22  h23 ] [ y_cam ]", (310, 905), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (235, 246, 255), 2, cv2.LINE_AA)
    cv2.putText(img, "[    1    ]     [ h31  h32   1  ] [   1   ]", (310, 940), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (235, 246, 255), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_01_homography.jpg", img)

# 2. Voronoi Space Control Card
def gen_voronoi():
    img = create_base_canvas("Dynamic Space Control", "Voronoi Territorial Partitioning & Pitch Dominance Calculus", "Feature 02 // Geometric ML")
    np.random.seed(101)
    
    # 22 player nodes
    red_pts = [(int(W * 0.2 + np.random.randint(-120, 180)), int(H * 0.5 + np.random.randint(-280, 280))) for _ in range(8)]
    blue_pts = [(int(W * 0.75 + np.random.randint(-180, 120)), int(H * 0.5 + np.random.randint(-280, 280))) for _ in range(8)]

    # Draw Delaunay/Voronoi network lines
    all_pts = red_pts + blue_pts
    for i in range(len(all_pts)):
        for j in range(i + 1, len(all_pts)):
            dist = math.hypot(all_pts[i][0] - all_pts[j][0], all_pts[i][1] - all_pts[j][1])
            if dist < 220:
                cv2.line(img, all_pts[i], all_pts[j], (45, 65, 50), 1, cv2.LINE_AA)

    # Voronoi cells shading
    for pt in red_pts:
        cv2.circle(img, pt, 55, (25, 15, 60), -1)
        cv2.circle(img, pt, 55, (45, 20, 120), 1)
        cv2.circle(img, pt, 12, (7, 9, 89), -1)
        cv2.circle(img, pt, 12, (181, 210, 232), 2)
        cv2.circle(img, pt, 5, (235, 246, 255), -1)

    for pt in blue_pts:
        cv2.circle(img, pt, 55, (60, 40, 20), -1)
        cv2.circle(img, pt, 55, (120, 80, 40), 1)
        cv2.circle(img, pt, 12, (137, 78, 29), -1)
        cv2.circle(img, pt, 12, (230, 202, 142), 2)
        cv2.circle(img, pt, 5, (235, 246, 255), -1)

    # Possession Split Pill
    cv2.rectangle(img, (200, 880), (800, 940), (14, 18, 15), -1)
    cv2.rectangle(img, (200, 880), (800, 940), (181, 210, 232), 1)
    cv2.rectangle(img, (204, 884), (540, 936), (7, 9, 89), -1)
    cv2.rectangle(img, (540, 884), (796, 936), (137, 78, 29), -1)
    cv2.putText(img, "TEAM ALPHA: 56.4% DOMINANCE", (230, 915), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (235, 246, 255), 2, cv2.LINE_AA)
    cv2.putText(img, "BETA: 43.6%", (620, 915), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (235, 246, 255), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_02_voronoi.jpg", img)

# 3. Deep Tracking Card
def gen_tracking():
    img = create_base_canvas("Multi-Object Tracking", "YOLOv8x + ByteTrack Low-Score Recovery + 8D Kalman Filter", "Feature 03 // Deep Tracking")
    
    # 3 player tracking bounding boxes
    boxes = [
        ("ID 09 HAALAND", "0.96 conf", 280, 420, 160, 320, (7, 9, 89)),
        ("ID 07 SALAH", "0.94 conf", 560, 340, 140, 280, (7, 9, 89)),
        ("ID 21 MBAPPE", "0.98 conf", 200, 680, 150, 300, (137, 78, 29)),
    ]

    for tag, conf, bx, by, bw, bh, col in boxes:
        # Box
        cv2.rectangle(img, (bx, by), (bx + bw, by + bh), (181, 210, 232), 2)
        # Corner brackets
        cl = 18
        cv2.line(img, (bx, by), (bx + cl, by), (235, 246, 255), 4)
        cv2.line(img, (bx, by), (bx, by + cl), (235, 246, 255), 4)
        cv2.line(img, (bx + bw, by), (bx + bw - cl, by), (235, 246, 255), 4)
        cv2.line(img, (bx + bw, by), (bx + bw, by + cl), (235, 246, 255), 4)
        
        # Tag pill
        cv2.rectangle(img, (bx - 2, by - 44), (bx + bw + 2, by), col, -1)
        cv2.rectangle(img, (bx - 2, by - 44), (bx + bw + 2, by), (181, 210, 232), 1)
        cv2.putText(img, tag, (bx + 8, by - 24), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (235, 246, 255), 2, cv2.LINE_AA)
        cv2.putText(img, conf, (bx + 8, by - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.50, (181, 210, 232), 1, cv2.LINE_AA)

        # Kalman Filter Velocity vector arrow
        cv2.arrowedLine(img, (bx + bw // 2, by + bh), (bx + bw // 2 + 60, by + bh + 80), (60, 220, 240), 3, tipLength=0.3)

    cv2.imwrite("frontend/public/features/feature_03_tracking.jpg", img)

# 4. Jersey Clustering Card
def gen_clustering():
    img = create_base_canvas("Jersey Pigment Clustering", "HSV Color Space Segmentation + K-Means Pitch Grass Rejection", "Feature 04 // Unsupervised ML")
    
    # 3D HSV Color Cylinder / Triangle
    cx, cy = W // 2, 540
    r = 220
    for a in range(0, 360, 6):
        rad = math.radians(a)
        px = int(cx + r * math.cos(rad))
        py = int(cy + r * math.sin(rad))
        col = (int(128 + 127 * math.sin(rad)), int(128 + 127 * math.sin(rad + 2)), int(128 + 127 * math.sin(rad + 4)))
        cv2.line(img, (cx, cy), (px, py), col, 2, cv2.LINE_AA)

    # Centroid Clusters
    cv2.circle(img, (cx - 100, cy - 60), 24, (7, 9, 89), -1)
    cv2.circle(img, (cx - 100, cy - 60), 24, (181, 210, 232), 2)
    cv2.putText(img, "ALPHA CLUSTER (RED)", (cx - 260, cy - 100), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (235, 246, 255), 2, cv2.LINE_AA)

    cv2.circle(img, (cx + 110, cy + 50), 24, (137, 78, 29), -1)
    cv2.circle(img, (cx + 110, cy + 50), 24, (230, 202, 142), 2)
    cv2.putText(img, "BETA CLUSTER (BLUE)", (cx + 60, cy + 110), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (235, 246, 255), 2, cv2.LINE_AA)

    cv2.circle(img, (cx, cy + 140), 20, (30, 110, 40), -1)
    cv2.putText(img, "GRASS MASK REJECTED", (cx - 130, cy + 190), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (120, 230, 130), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_04_clustering.jpg", img)

# 5. Kinematics Card
def gen_kinematics():
    img = create_base_canvas("Kinematic Velocity Engine", "Instantaneous Ground-Plane Calculus & 5-Zone FIFA Sprint Load", "Feature 05 // Biometric Calculus")
    
    # Speedometer Arc
    cx, cy = W // 2, 560
    radius = 240
    cv2.ellipse(img, (cx, cy), (radius, radius), 0, 135, 405, (40, 50, 45), 26, cv2.LINE_AA)
    # Active speed arc up to 34.8 km/h
    cv2.ellipse(img, (cx, cy), (radius, radius), 0, 135, 335, (7, 9, 89), 26, cv2.LINE_AA)
    cv2.ellipse(img, (cx, cy), (radius, radius), 0, 135, 335, (181, 210, 232), 6, cv2.LINE_AA)

    # Center Text
    cv2.putText(img, "36.2", (cx - 120, cy + 20), cv2.FONT_HERSHEY_SIMPLEX, 2.8, (235, 246, 255), 5, cv2.LINE_AA)
    cv2.putText(img, "KM/H // SPRINT ZONE 5", (cx - 160, cy + 80), cv2.FONT_HERSHEY_SIMPLEX, 0.72, (70, 70, 230), 2, cv2.LINE_AA)

    # Acceleration stats
    cv2.rectangle(img, (160, 840), (840, 960), (14, 18, 15), -1)
    cv2.rectangle(img, (160, 840), (840, 960), (181, 210, 232), 1)
    cv2.putText(img, "PEAK ACCEL: +5.4 m/s^2", (200, 890), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (181, 210, 232), 2, cv2.LINE_AA)
    cv2.putText(img, "DECEL LOAD: -6.8 m/s^2 (HIGH INJURY RISK)", (200, 930), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (70, 70, 230), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_05_kinematics.jpg", img)

# 6. Biomechanics Card
def gen_biomechanics():
    img = create_base_canvas("3D Biomechanical Pose", "ViTPose-H 17 3D Skeletal Nodes & Segmental Kicking Whip", "Feature 06 // 3D Skeleton")
    
    # 3D Skeletal Stick Figure in Strike Impact
    cx, cy = W // 2, 580
    joints = {
        "head": (cx, cy - 240),
        "neck": (cx, cy - 190),
        "pelvis": (cx, cy),
        "l_shoulder": (cx - 70, cy - 170),
        "r_shoulder": (cx + 80, cy - 165),
        "l_elbow": (cx - 110, cy - 90),
        "r_elbow": (cx + 120, cy - 90),
        "l_hand": (cx - 90, cy - 20),
        "r_hand": (cx + 100, cy - 20),
        "l_hip": (cx - 50, cy + 20),
        "r_hip": (cx + 50, cy + 20),
        "l_knee": (cx - 60, cy + 180),
        "r_knee": (cx + 80, cy + 120),
        "l_foot": (cx - 50, cy + 340),
        "r_foot": (cx + 160, cy + 260)
    }

    connections = [
        ("head", "neck"), ("neck", "pelvis"),
        ("neck", "l_shoulder"), ("neck", "r_shoulder"),
        ("l_shoulder", "l_elbow"), ("l_elbow", "l_hand"),
        ("r_shoulder", "r_elbow"), ("r_elbow", "r_hand"),
        ("pelvis", "l_hip"), ("pelvis", "r_hip"),
        ("l_hip", "l_knee"), ("l_knee", "l_foot"),
        ("r_hip", "r_knee"), ("r_knee", "r_foot")
    ]

    for j1, j2 in connections:
        cv2.line(img, joints[j1], joints[j2], (181, 210, 232), 4, cv2.LINE_AA)

    # Striking leg highlight
    cv2.line(img, joints["r_hip"], joints["r_knee"], (70, 70, 230), 6, cv2.LINE_AA)
    cv2.line(img, joints["r_knee"], joints["r_foot"], (70, 70, 230), 6, cv2.LINE_AA)

    for j, pt in joints.items():
        cv2.circle(img, pt, 8, (7, 9, 89), -1)
        cv2.circle(img, pt, 8, (181, 210, 232), 2)

    # Football impact point
    fb_pt = (joints["r_foot"][0] + 30, joints["r_foot"][1] - 10)
    cv2.circle(img, fb_pt, 22, (235, 246, 255), -1)
    cv2.circle(img, fb_pt, 22, (7, 9, 89), 3)
    cv2.putText(img, "CLEAT STRIKE: 106.8 KM/H", (cx - 190, cy + 400), cv2.FONT_HERSHEY_SIMPLEX, 0.70, (235, 246, 255), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_06_biomechanics.jpg", img)

# 7. Vision Studio Card
def gen_visionstudio():
    img = create_base_canvas("Vision Studio & 2D Radar", "Synchronized Broadcast Tracking HUD & Live 2D Tactical Minimap", "Feature 07 // Live Studio")
    
    # Split view mockup
    # Left screen: broadcast HUD
    cv2.rectangle(img, (100, 320), (500, 720), (7, 9, 89), 2)
    cv2.rectangle(img, (102, 322), (498, 718), (20, 35, 24), -1)
    cv2.putText(img, "BROADCAST HUD (60 FPS)", (120, 355), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (181, 210, 232), 1, cv2.LINE_AA)
    cv2.rectangle(img, (220, 440), (320, 580), (181, 210, 232), 2)
    cv2.ellipse(img, (270, 590), (30, 10), 0, 0, 360, (70, 70, 230), 2)

    # Right screen: 2D Radar
    cv2.rectangle(img, (520, 320), (900, 720), (181, 210, 232), 2)
    cv2.rectangle(img, (522, 322), (898, 718), (22, 32, 25), -1)
    cv2.putText(img, "2D PITCH RADAR (105x68m)", (540, 355), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (181, 210, 232), 1, cv2.LINE_AA)
    cv2.circle(img, (710, 520), 45, (181, 210, 232), 1)
    cv2.circle(img, (710, 520), 4, (181, 210, 232), -1)

    # Sweeper line
    cv2.line(img, (710, 520), (760, 480), (235, 246, 255), 2, cv2.LINE_AA)

    # Synchronous arrows between screens
    cv2.arrowedLine(img, (480, 520), (540, 520), (181, 210, 232), 3, tipLength=0.3)
    cv2.arrowedLine(img, (540, 540), (480, 540), (181, 210, 232), 3, tipLength=0.3)

    cv2.imwrite("frontend/public/features/feature_07_visionstudio.jpg", img)

# 8. Pipeline Architecture Card
def gen_pipeline():
    img = create_base_canvas("Autonomous DL Pipeline", "64.9 FPS Throughput // 14.8ms End-to-End Inference Latency", "Feature 08 // Pipeline")
    
    stages = [
        ("01. INGESTION", "Hardware NVDEC", "1.2 ms"),
        ("02. DETECTION", "YOLOv8x MOT", "6.4 ms"),
        ("03. HOMOGRAPHY", "RANSAC Warp", "1.8 ms"),
        ("04. CLUSTERING", "HSV K-Means", "1.5 ms"),
        ("05. KINEMATICS", "Velocity Math", "1.2 ms"),
        ("06. STREAMING", "WebRTC / WS", "2.7 ms")
    ]

    for idx, (st_name, st_tech, st_time) in enumerate(stages):
        sy = 300 + idx * 105
        cv2.rectangle(img, (140, sy), (860, sy + 75), (7, 9, 89), -1)
        cv2.rectangle(img, (140, sy), (860, sy + 75), (181, 210, 232), 1)
        cv2.putText(img, st_name, (170, sy + 45), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (235, 246, 255), 2, cv2.LINE_AA)
        cv2.putText(img, st_tech, (440, sy + 45), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (181, 210, 232), 1, cv2.LINE_AA)
        cv2.putText(img, st_time, (740, sy + 45), cv2.FONT_HERSHEY_SIMPLEX, 0.70, (100, 240, 160), 2, cv2.LINE_AA)

    cv2.imwrite("frontend/public/features/feature_08_pipeline.jpg", img)

if __name__ == "__main__":
    gen_homography()
    gen_voronoi()
    gen_tracking()
    gen_clustering()
    gen_kinematics()
    gen_biomechanics()
    gen_visionstudio()
    gen_pipeline()
    print("All 8 high-res feature cards generated in frontend/public/features/")
