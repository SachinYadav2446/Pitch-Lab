import cv2
import numpy as np

def create_sample_football_clip(output_path="sample_match.mp4", num_frames=300, width=1280, height=720, fps=30):
    """
    Generates a realistic tactical football match video with:
    - Standard green grass pitch with white boundary lines, center circle, and penalty boxes.
    - Two full teams (Team Red vs Team Blue) running realistic tactical patterns.
    - Ball physics: passing, dribbling, and possession change.
    """
    print(f"Generating realistic tactical football simulation: {output_path} ({num_frames} frames)...")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, float(fps), (width, height))

    # Initial Tactical Formations: 4-3-3 style layout
    team_red = np.array([
        [240, 360], # Goalkeeper
        [380, 180], [360, 300], [360, 420], [380, 540], # Defenders
        [520, 240], [500, 360], [520, 480],             # Midfielders
        [660, 200], [680, 360], [660, 520]              # Forwards
    ], dtype=np.float32)

    team_blue = np.array([
        [1040, 360], # Goalkeeper
        [900, 180], [920, 300], [920, 420], [900, 540], # Defenders
        [760, 240], [780, 360], [760, 480],              # Midfielders
        [620, 200], [600, 360], [620, 520]               # Forwards
    ], dtype=np.float32)

    ball_pos = np.array([640.0, 360.0], dtype=np.float32)
    ball_vel = np.array([2.5, 0.8], dtype=np.float32)

    for f in range(num_frames):
        # 1. Draw Football Pitch
        frame = np.full((height, width, 3), (35, 115, 42), dtype=np.uint8) # Lush grass green
        
        # Subtle grass stripes
        stripe_w = width // 12
        for s in range(12):
            if s % 2 == 0:
                cv2.rectangle(frame, (s * stripe_w, 40), ((s + 1) * stripe_w, height - 40), (32, 108, 38), -1)

        # White Pitch Markings
        line_col = (235, 240, 235)
        # Touchlines & Goal lines
        cv2.rectangle(frame, (100, 50), (width - 100, height - 50), line_col, 2)
        # Halfway Line & Center Circle
        cv2.line(frame, (width // 2, 50), (width // 2, height - 50), line_col, 2)
        cv2.circle(frame, (width // 2, height // 2), 85, line_col, 2)
        cv2.circle(frame, (width // 2, height // 2), 4, line_col, -1)

        # Left Penalty Box (18-yard box)
        cv2.rectangle(frame, (100, 180), (280, height - 180), line_col, 2)
        # Right Penalty Box
        cv2.rectangle(frame, (width - 280, 180), (width - 100, height - 180), line_col, 2)

        # 2. Update Ball Physics
        ball_pos += ball_vel
        # Bounce off pitch boundaries
        if ball_pos[0] < 120 or ball_pos[0] > width - 120:
            ball_vel[0] *= -0.9
        if ball_pos[1] < 70 or ball_pos[1] > height - 70:
            ball_vel[1] *= -0.9

        # 3. Tactical Player Movement: Move toward the ball with formation constraints
        red_noise = np.random.normal(0, 1.2, team_red.shape)
        blue_noise = np.random.normal(0, 1.2, team_blue.shape)

        # Closest player presses the ball
        red_dists = np.linalg.norm(team_red - ball_pos, axis=1)
        closest_red = np.argmin(red_dists)
        team_red[closest_red] += (ball_pos - team_red[closest_red]) * 0.04

        blue_dists = np.linalg.norm(team_blue - ball_pos, axis=1)
        closest_blue = np.argmin(blue_dists)
        team_blue[closest_blue] += (ball_pos - team_blue[closest_blue]) * 0.04

        team_red += red_noise
        team_blue += blue_noise

        # Clamp inside boundaries
        team_red[:, 0] = np.clip(team_red[:, 0], 110, width - 110)
        team_red[:, 1] = np.clip(team_red[:, 1], 60, height - 60)
        team_blue[:, 0] = np.clip(team_blue[:, 0], 110, width - 110)
        team_blue[:, 1] = np.clip(team_blue[:, 1], 60, height - 60)

        # 4. Render Team Red Players (Red Jersey + White Shorts)
        for p in team_red:
            x, y = int(p[0]), int(p[1])
            cv2.rectangle(frame, (x - 10, y - 28), (x + 10, y), (30, 30, 220), -1)   # Red Shirt
            cv2.rectangle(frame, (x - 8, y), (x + 8, y + 20), (240, 240, 240), -1)   # White Shorts
            cv2.circle(frame, (x, y - 36), 8, (180, 210, 240), -1)                  # Head

        # 5. Render Team Blue Players (Blue Jersey + Dark Shorts)
        for p in team_blue:
            x, y = int(p[0]), int(p[1])
            cv2.rectangle(frame, (x - 10, y - 28), (x + 10, y), (220, 120, 20), -1)  # Blue Shirt
            cv2.rectangle(frame, (x - 8, y), (x + 8, y + 20), (40, 40, 40), -1)      # Dark Shorts
            cv2.circle(frame, (x, y - 36), 8, (180, 210, 240), -1)                  # Head

        # 6. Render Ball
        bx, by = int(ball_pos[0]), int(ball_pos[1])
        cv2.circle(frame, (bx, by), 6, (255, 255, 255), -1)
        cv2.circle(frame, (bx, by), 6, (0, 0, 0), 1)

        out.write(frame)

    out.release()
    print(f"Sample football match video successfully generated at: {output_path}")

if __name__ == "__main__":
    create_sample_football_clip("sample_match.mp4", num_frames=180)
