import cv2
import numpy as np
from core.tracker import SportsDetectorTracker
from core.team_classifier import TeamClassifier
from core.homography import PitchHomography
from analytics.radar import PitchRadar
from analytics.metrics import SportsMetricsTracker
from analytics.annotator import SportsAnnotator

class MatchAnalyticsPipeline:
    """
    Unified end-to-end processing pipeline for football match video analysis.
    Integrates Detection, Tracking, Team Assignment, Homography, Physical Metrics, and 2D Radar.
    """
    def __init__(self, model_name="yolov8n.pt", device=None, conf_thresh=0.25):
        self.tracker = SportsDetectorTracker(model_name=model_name, device=device, conf_thresh=conf_thresh)
        self.team_classifier = TeamClassifier(n_teams=2)
        self.homography = PitchHomography()
        self.radar = PitchRadar(radar_w=540, radar_h=360)
        self.annotator = SportsAnnotator()
        self.metrics = None  # Initialized when video FPS is known
        self.teams_initialized = False

    def initialize_metrics(self, fps: float):
        self.metrics = SportsMetricsTracker(fps=fps)

    def analyze_shot_type(self, frame: np.ndarray, raw_players: list) -> dict:
        """
        Shot Gatekeeper: evaluates green pitch ratio and player scales to determine if
        frame is a wide tactical view, close-up, or replay.
        """
        h, w, _ = frame.shape
        small = cv2.resize(frame, (320, 180))
        hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
        lower_green = np.array([30, 35, 35])
        upper_green = np.array([90, 255, 255])
        mask = cv2.inRange(hsv, lower_green, upper_green)
        green_ratio = float(np.count_nonzero(mask)) / (320 * 180)

        # Oversized player check (>16% frame area is a close-up)
        frame_area = w * h
        has_oversized = any(
            ((p['bbox'][2] - p['bbox'][0]) * (p['bbox'][3] - p['bbox'][1])) > (frame_area * 0.16)
            for p in raw_players
        )

        num_players = len(raw_players)
        if has_oversized:
            shot_type = "close_up"
            is_tactical = False
            label = "CLOSE-UP / REACTION (RADAR PAUSED)"
        elif green_ratio < 0.35:
            shot_type = "cut_or_replay"
            is_tactical = False
            label = "NON-TACTICAL CUT / REPLAY"
        elif green_ratio < 0.48 and num_players < 4:
            shot_type = "close_up"
            is_tactical = False
            label = "TIGHT ANGLE (RADAR PAUSED)"
        else:
            shot_type = "tactical"
            is_tactical = True
            label = "TACTICAL BROADCAST FEED (VALIDATED)"

        return {
            "shot_type": shot_type,
            "is_tactical": is_tactical,
            "green_ratio": round(green_ratio, 3),
            "label": label
        }

    def process_frame(self, frame: np.ndarray, frame_idx: int, total_frames: int = 100) -> dict:
        """
        Processes one video frame and returns composite visualization + frame metrics.
        """
        h, w, _ = frame.shape
        if not hasattr(self, '_calibrated_res') or self._calibrated_res != (w, h):
            self.homography.setup_default_calibration(frame_w=w, frame_h=h)
            self._calibrated_res = (w, h)
        
        # 1. Detect & Track
        track_results = self.tracker.process_frame(frame)
        raw_players = track_results['players']
        ball_info = track_results['ball']

        # 2. Shot Gatekeeper Analysis
        shot_info = self.analyze_shot_type(frame, raw_players)

        # 3. Dynamic Pan Smoothing (subtle tracking following play centroid)
        if not hasattr(self, '_smooth_pan'):
            self._smooth_pan = 0.0
        if raw_players:
            avg_x = np.mean([(p['bbox'][0] + p['bbox'][2]) / 2.0 for p in raw_players])
            pan_target = float(((avg_x - (w / 2.0)) / (w / 2.0)) * 5.0)
            self._smooth_pan = float(0.88 * self._smooth_pan + 0.12 * pan_target)

        camera_frustum = self.homography.get_camera_frustum(w, h, pan_offset_x=self._smooth_pan)

        # 4. Team Classification Initialization (fit on early frame with sufficient players)
        if not self.teams_initialized and len(raw_players) >= 6:
            bboxes = [p['bbox'] for p in raw_players]
            self.team_classifier.fit_teams(frame, bboxes)
            self.teams_initialized = True

        # 5. Process Players: Assign Teams, Homography, and Physical Metrics
        radar_players = []
        annotated_frame = frame.copy()

        for p in raw_players:
            p_id = p['id']
            bbox = p['bbox']

            # Predict team
            team_id = self.team_classifier.predict_team(frame, bbox) if self.teams_initialized else 0
            team_color = self.team_classifier.get_team_color(team_id)

            # Map to 2D pitch coordinates (meters)
            pitch_x, pitch_y = self.homography.get_player_foot_position(bbox, pan_offset_x=self._smooth_pan)

            # Update velocity and distance covered
            speed_kmh = 0.0
            if self.metrics and shot_info['is_tactical']:
                speed_kmh = self.metrics.update_player_position(frame_idx, p_id, (pitch_x, pitch_y))

            # Store for radar rendering and client telemetry
            radar_players.append({
                'id': p_id,
                'team': 'alpha' if team_id == 0 else 'beta',
                'team_id': team_id,
                'pos': (pitch_x, pitch_y),
                'pitch_x': pitch_x,
                'pitch_y': pitch_y,
                'speed_kmh': speed_kmh,
                'bbox': bbox,
                'color': team_color
            })

            # Draw visual overlay on video frame
            label = f"#{p_id} {speed_kmh}km/h" if p_id != -1 else f"{speed_kmh}km/h"
            self.annotator.draw_player_ring(annotated_frame, bbox, team_color, label)

        # 6. Process Ball
        radar_ball = None
        ball_telemetry = None
        if ball_info:
            b_box = ball_info['bbox']
            bx_center = (b_box[0] + b_box[2]) / 2.0
            by_center = (b_box[1] + b_box[3]) / 2.0
            pitch_bx, pitch_by = self.homography.transform_point(bx_center, by_center)
            pitch_bx = float(np.clip(pitch_bx + self._smooth_pan, 0.0, self.homography.PITCH_LENGTH))
            radar_ball = (pitch_bx, pitch_by)
            ball_telemetry = {
                'bbox': b_box,
                'pitch_x': pitch_bx,
                'pitch_y': pitch_by
            }
            self.annotator.draw_ball_pointer(annotated_frame, b_box)

        # 7. Update Possession
        possession = {0: 50.0, 1: 50.0}
        if self.metrics and shot_info['is_tactical']:
            self.metrics.update_possession(radar_players, radar_ball)
            possession = self.metrics.get_possession_percentages()

        # 8. Draw HUD Banner
        self.annotator.draw_hud(annotated_frame, possession, frame_idx, total_frames)

        # If not tactical, draw amber warning banner on frame
        if not shot_info['is_tactical']:
            cv2.rectangle(annotated_frame, (20, 20), (480, 56), (20, 20, 20), -1)
            cv2.rectangle(annotated_frame, (20, 20), (480, 56), (0, 165, 255), 2)
            cv2.putText(annotated_frame, shot_info['label'], (30, 44), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 215, 255), 1, cv2.LINE_AA)

        # 9. Render 2D Tactical Minimap (Radar)
        radar_img = self.radar.render(radar_players if shot_info['is_tactical'] else [], radar_ball if shot_info['is_tactical'] else None)

        # 10. Composite Side-by-Side Visualization
        composite = self.annotator.compose_side_by_side(annotated_frame, radar_img)

        return {
            'composite': composite,
            'annotated_frame': annotated_frame,
            'radar_img': radar_img,
            'possession': possession,
            'players': radar_players,
            'ball': ball_telemetry,
            'num_players': len(radar_players),
            'ball_detected': radar_ball is not None,
            'shot_info': shot_info,
            'camera_frustum': camera_frustum
        }

    def get_summary_statistics(self) -> dict:
        """
        Generates full match analytics report for coaches/analysts.
        """
        if not self.metrics:
            return {}

        top_speeds = sorted(
            [{'player_id': f"Player #{pid}", 'top_speed_kmh': speed} 
             for pid, speed in self.metrics.top_speeds.items() if pid != -1 and speed > 0],
            key=lambda x: x['top_speed_kmh'], reverse=True
        )[:10]

        distances = sorted(
            [{'player_id': f"Player #{pid}", 'distance_m': round(dist, 1)} 
             for pid, dist in self.metrics.cumulative_distance.items() if pid != -1 and dist > 0],
            key=lambda x: x['distance_m'], reverse=True
        )[:10]

        return {
            'possession': self.metrics.get_possession_percentages(),
            'top_speeds': top_speeds,
            'distances': distances
        }
