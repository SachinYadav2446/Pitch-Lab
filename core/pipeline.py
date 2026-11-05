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

    def process_frame(self, frame: np.ndarray, frame_idx: int, total_frames: int = 100) -> dict:
        """
        Processes one video frame and returns composite visualization + frame metrics.
        """
        h, w, _ = frame.shape
        
        # 1. Detect & Track
        track_results = self.tracker.process_frame(frame)
        raw_players = track_results['players']
        ball_info = track_results['ball']

        # 2. Team Classification Initialization (fit on early frame with sufficient players)
        if not self.teams_initialized and len(raw_players) >= 8:
            bboxes = [p['bbox'] for p in raw_players]
            self.team_classifier.fit_teams(frame, bboxes)
            self.teams_initialized = True

        # 3. Process Players: Assign Teams, Homography, and Physical Metrics
        radar_players = []
        annotated_frame = frame.copy()

        for p in raw_players:
            p_id = p['id']
            bbox = p['bbox']

            # Predict team
            team_id = self.team_classifier.predict_team(frame, bbox) if self.teams_initialized else 0
            team_color = self.team_classifier.get_team_color(team_id)

            # Map to 2D pitch coordinates (meters)
            pitch_x, pitch_y = self.homography.get_player_foot_position(bbox)

            # Update velocity and distance covered
            speed_kmh = 0.0
            if self.metrics:
                speed_kmh = self.metrics.update_player_position(frame_idx, p_id, (pitch_x, pitch_y))

            # Store for radar rendering
            radar_players.append({
                'id': p_id,
                'team': team_id,
                'pos': (pitch_x, pitch_y),
                'color': team_color
            })

            # Draw visual overlay on video frame
            label = f"#{p_id} {speed_kmh}km/h" if p_id != -1 else f"{speed_kmh}km/h"
            self.annotator.draw_player_ring(annotated_frame, bbox, team_color, label)

        # 4. Process Ball
        radar_ball = None
        if ball_info:
            b_box = ball_info['bbox']
            bx_center = (b_box[0] + b_box[2]) / 2.0
            by_center = (b_box[1] + b_box[3]) / 2.0
            pitch_bx, pitch_by = self.homography.transform_point(bx_center, by_center)
            radar_ball = (pitch_bx, pitch_by)
            self.annotator.draw_ball_pointer(annotated_frame, b_box)

        # 5. Update Possession
        possession = {0: 50.0, 1: 50.0}
        if self.metrics:
            self.metrics.update_possession(radar_players, radar_ball)
            possession = self.metrics.get_possession_percentages()

        # 6. Draw HUD Banner
        self.annotator.draw_hud(annotated_frame, possession, frame_idx, total_frames)

        # 7. Render 2D Tactical Minimap (Radar)
        radar_img = self.radar.render(radar_players, radar_ball)

        # 8. Composite Side-by-Side Visualization
        composite = self.annotator.compose_side_by_side(annotated_frame, radar_img)

        return {
            'composite': composite,
            'annotated_frame': annotated_frame,
            'radar_img': radar_img,
            'possession': possession,
            'num_players': len(radar_players),
            'ball_detected': radar_ball is not None
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
