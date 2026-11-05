import numpy as np
from collections import defaultdict, deque

class SportsMetricsTracker:
    """
    Computes real-time and post-match analytics:
    - Player speed (km/h) smoothed with rolling window
    - Cumulative distance covered (meters)
    - Team possession percentage based on ball proximity
    - Team shape centroids and compactness (meters)
    """
    def __init__(self, fps=30.0, speed_window_size=8):
        self.fps = fps
        self.dt = 1.0 / max(fps, 1.0)
        self.window_size = speed_window_size

        # Player history: id -> deque of (frame_idx, x_m, y_m)
        self.position_history = defaultdict(lambda: deque(maxlen=self.window_size))
        
        # Cumulative stats
        self.cumulative_distance = defaultdict(float)  # id -> total meters
        self.current_speeds = defaultdict(float)       # id -> current km/h
        self.top_speeds = defaultdict(float)           # id -> max km/h
        
        # Team stats
        self.team_possession_frames = defaultdict(int) # team_id -> frame count
        self.total_possession_frames = 0

    def update_player_position(self, frame_idx: int, player_id: int, pos_m: tuple) -> float:
        """
        Updates player position, calculates smoothed instantaneous speed (km/h) and total distance.
        """
        history = self.position_history[player_id]
        history.append((frame_idx, pos_m[0], pos_m[1]))

        if len(history) < 2:
            return 0.0

        # Calculate speed between oldest and newest in window
        f_old, x_old, y_old = history[0]
        f_new, x_new, y_new = history[-1]
        
        frames_diff = f_new - f_old
        if frames_diff <= 0:
            return self.current_speeds[player_id]

        dist_m = np.sqrt((x_new - x_old)**2 + (y_new - y_old)**2)
        time_s = frames_diff * self.dt
        
        # Speed in km/h
        speed_kmh = (dist_m / max(time_s, 1e-4)) * 3.6

        # Filter out tracking jump anomalies (> 40 km/h is unrealistic for football sprint)
        if speed_kmh > 38.0:
            speed_kmh = self.current_speeds[player_id]

        # Update cumulative distance if player is actively moving (> 1.2 km/h)
        if len(history) >= 2:
            _, x_prev, y_prev = history[-2]
            step_dist = np.sqrt((x_new - x_prev)**2 + (y_new - y_prev)**2)
            if speed_kmh > 1.2 and step_dist < 2.5:  # eliminate teleport artifacts
                self.cumulative_distance[player_id] += step_dist

        self.current_speeds[player_id] = round(speed_kmh, 1)
        if speed_kmh > self.top_speeds[player_id]:
            self.top_speeds[player_id] = round(speed_kmh, 1)

        return self.current_speeds[player_id]

    def update_possession(self, players: list, ball_pos: tuple):
        """
        Determines which player/team currently has possession based on closest distance to the ball.
        """
        if ball_pos is None or not players:
            return None

        bx, by = ball_pos
        min_dist = float('inf')
        possessor_team = None

        for p in players:
            px, py = p['pos']
            dist = np.sqrt((px - bx)**2 + (py - by)**2)
            if dist < min_dist:
                min_dist = dist
                possessor_team = p.get('team')

        # Threshold: must be within 3.5 meters of the ball
        if min_dist <= 3.5 and possessor_team is not None:
            self.team_possession_frames[possessor_team] += 1
            self.total_possession_frames += 1
            return possessor_team

        return None

    def get_possession_percentages(self) -> dict:
        """Returns possession % for each team."""
        if self.total_possession_frames == 0:
            return {0: 50.0, 1: 50.0}
        
        t0 = self.team_possession_frames.get(0, 0)
        t1 = self.team_possession_frames.get(1, 0)
        total = max(t0 + t1, 1)
        return {
            0: round((t0 / total) * 100, 1),
            1: round((t1 / total) * 100, 1)
        }

    def get_team_shape(self, players: list, team_id: int) -> dict:
        """
        Calculates team center of mass (centroid), length, and width in meters.
        """
        team_coords = [p['pos'] for p in players if p.get('team') == team_id]
        if not team_coords:
            return {'centroid': (52.5, 34.0), 'length': 0.0, 'width': 0.0}

        xs = [c[0] for c in team_coords]
        ys = [c[1] for c in team_coords]

        centroid = (round(float(np.mean(xs)), 1), round(float(np.mean(ys)), 1))
        length = round(float(np.ptp(xs)), 1) # span along field length (X)
        width = round(float(np.ptp(ys)), 1)  # span along field width (Y)

        return {'centroid': centroid, 'length': length, 'width': width}
