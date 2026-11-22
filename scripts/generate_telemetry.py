import json
import math
import numpy as np

def generate_tactical_telemetry(num_frames=180, fps=30, width=1280, height=720):
    # Initial formation coordinates (broadcast video canvas pixels: 1280 x 720)
    # Team Red (Burgundy/Red)
    red_names = [
        ("ID 01", "Alisson", "GK", 240, 360),
        ("ID 02", "Walker", "RB", 380, 180),
        ("ID 04", "van Dijk", "CB", 360, 300),
        ("ID 05", "Dias", "CB", 360, 420),
        ("ID 03", "Robertson", "LB", 380, 540),
        ("ID 06", "Rodri", "CDM", 500, 360),
        ("ID 08", "De Bruyne", "CAM", 540, 260),
        ("ID 10", "Modrić", "CM", 530, 460),
        ("ID 07", "Salah", "RW", 680, 200),
        ("ID 09", "Haaland", "ST", 710, 360),
        ("ID 11", "Vinicius", "LW", 670, 520),
    ]

    # Team Blue (Cyan/Blue)
    blue_names = [
        ("ID 12", "Courtois", "GK", 1040, 360),
        ("ID 13", "Carvajal", "RB", 900, 180),
        ("ID 14", "Militao", "CB", 920, 300),
        ("ID 15", "Rüdiger", "CB", 920, 420),
        ("ID 16", "Mendy", "LB", 900, 540),
        ("ID 17", "Camavinga", "CDM", 780, 360),
        ("ID 18", "Bellingham", "CAM", 750, 250),
        ("ID 19", "Valverde", "CM", 760, 470),
        ("ID 20", "Rodrygo", "RW", 610, 210),
        ("ID 21", "Mbappé", "ST", 590, 360),
        ("ID 22", "Kroos", "LW", 620, 510),
    ]

    red_pos = np.array([[p[3], p[4]] for p in red_names], dtype=np.float32)
    blue_pos = np.array([[p[3], p[4]] for p in blue_names], dtype=np.float32)
    ball_pos = np.array([640.0, 360.0], dtype=np.float32)
    ball_vel = np.array([3.2, 0.9], dtype=np.float32)

    frames = []

    # Seed for deterministic realism
    np.random.seed(42)

    # Conversion matrix from 1280x720 video canvas to standard 105m x 68m pitch coordinates
    # Video pitch inner rect: x in [100, 1180] -> [0, 105m], y in [50, 670] -> [0, 68m]
    def to_pitch_m(x, y):
        px = max(0.0, min(105.0, (x - 100.0) / (1180.0 - 100.0) * 105.0))
        py = max(0.0, min(68.0, (y - 50.0) / (670.0 - 50.0) * 68.0))
        return round(float(px), 2), round(float(py), 2)

    prev_red = red_pos.copy()
    prev_blue = blue_pos.copy()

    for f in range(num_frames):
        t = round(f / fps, 3)

        # Ball dynamics
        ball_pos += ball_vel
        if ball_pos[0] < 140 or ball_pos[0] > width - 140:
            ball_vel[0] *= -0.92
        if ball_pos[1] < 80 or ball_pos[1] > height - 80:
            ball_vel[1] *= -0.92

        # Ball speed
        ball_speed_kmh = round(float(np.linalg.norm(ball_vel) * 28.0), 1)

        # Tactical updates
        # Striker and midfielders track ball
        red_dists = np.linalg.norm(red_pos - ball_pos, axis=1)
        c_red = int(np.argmin(red_dists))
        red_pos[c_red] += (ball_pos - red_pos[c_red]) * 0.045

        blue_dists = np.linalg.norm(blue_pos - ball_pos, axis=1)
        c_blue = int(np.argmin(blue_dists))
        blue_pos[c_blue] += (ball_pos - blue_pos[c_blue]) * 0.045

        # Tactical sway
        sway = math.sin(f * 0.08) * 1.5
        red_pos += np.random.normal(0, 0.9, red_pos.shape)
        red_pos[:, 0] += sway * 0.5
        blue_pos += np.random.normal(0, 0.9, blue_pos.shape)
        blue_pos[:, 0] += sway * 0.5

        # Clamp inside boundaries
        red_pos[:, 0] = np.clip(red_pos[:, 0], 120, width - 120)
        red_pos[:, 1] = np.clip(red_pos[:, 1], 60, height - 60)
        blue_pos[:, 0] = np.clip(blue_pos[:, 0], 120, width - 120)
        blue_pos[:, 1] = np.clip(blue_pos[:, 1], 60, height - 60)

        # Compute velocities and facing angles
        red_players = []
        for i, (tag, name, role, _, _) in enumerate(red_names):
            x, y = float(red_pos[i, 0]), float(red_pos[i, 1])
            vx = x - float(prev_red[i, 0])
            vy = y - float(prev_red[i, 1])
            speed = min(36.2, max(7.2, float(np.hypot(vx, vy) * 11.5 + (22.0 if i in [8, 9] else 14.0))))
            angle = math.degrees(math.atan2(vy, vx)) if abs(vx) + abs(vy) > 0.1 else 0.0
            bx_m, by_m = to_pitch_m(x, y)
            
            # Bounding box around player [x1, y1, x2, y2]
            w, h = 26, 62
            bbox = [round(x - w/2, 1), round(y - h + 10, 1), round(x + w/2, 1), round(y + 10, 1)]

            red_players.append({
                "id": i + 1,
                "tag": tag,
                "name": name,
                "team": "alpha",
                "role": role,
                "x": round(x, 1),
                "y": round(y, 1),
                "vx": round(vx, 2),
                "vy": round(vy, 2),
                "speed_kmh": round(speed, 1),
                "heading_deg": round(angle, 1),
                "pitch_x": bx_m,
                "pitch_y": by_m,
                "bbox": bbox,
                "confidence": round(0.91 + (i % 8) * 0.01, 2)
            })

        blue_players = []
        for i, (tag, name, role, _, _) in enumerate(blue_names):
            x, y = float(blue_pos[i, 0]), float(blue_pos[i, 1])
            vx = x - float(prev_blue[i, 0])
            vy = y - float(prev_blue[i, 1])
            speed = min(36.8, max(7.0, float(np.hypot(vx, vy) * 11.8 + (24.0 if i in [9, 10] else 13.5))))
            angle = math.degrees(math.atan2(vy, vx)) if abs(vx) + abs(vy) > 0.1 else 180.0
            bx_m, by_m = to_pitch_m(x, y)

            w, h = 26, 62
            bbox = [round(x - w/2, 1), round(y - h + 10, 1), round(x + w/2, 1), round(y + 10, 1)]

            blue_players.append({
                "id": i + 12,
                "tag": tag,
                "name": name,
                "team": "beta",
                "role": role,
                "x": round(x, 1),
                "y": round(y, 1),
                "vx": round(vx, 2),
                "vy": round(vy, 2),
                "speed_kmh": round(speed, 1),
                "heading_deg": round(angle, 1),
                "pitch_x": bx_m,
                "pitch_y": by_m,
                "bbox": bbox,
                "confidence": round(0.92 + (i % 7) * 0.01, 2)
            })

        prev_red = red_pos.copy()
        prev_blue = blue_pos.copy()

        bx, by = float(ball_pos[0]), float(ball_pos[1])
        b_pitch_x, b_pitch_y = to_pitch_m(bx, by)

        # Offside line: calculated based on the last defender (excluding goalkeeper) of defending team
        # When Red attacks towards right (blue half): last blue defender x
        blue_defenders_x = [p["x"] for p in blue_players if p["role"] in ["CB", "LB", "RB"]]
        offside_x = min(blue_defenders_x) if blue_defenders_x else 900.0

        frames.append({
            "frame": f,
            "time": t,
            "players": red_players + blue_players,
            "ball": {
                "x": round(bx, 1),
                "y": round(by, 1),
                "speed_kmh": ball_speed_kmh,
                "pitch_x": b_pitch_x,
                "pitch_y": b_pitch_y
            },
            "offside_x": round(offside_x, 1),
            "possession": {
                "alpha": round(54.0 + math.sin(f * 0.05) * 4.0, 1),
                "beta": round(46.0 - math.sin(f * 0.05) * 4.0, 1)
            }
        })

    with open("frontend/public/sample_tracking.json", "w", encoding="utf-8") as out_f:
        json.dump(frames, out_f)
    print(f"Generated telemetry for {len(frames)} frames in frontend/public/sample_tracking.json")

if __name__ == "__main__":
    generate_tactical_telemetry()
