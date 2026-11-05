import cv2
import numpy as np

class SportsAnnotator:
    """
    Renders broadcast-quality visual overlays on match frames:
    - Ground ellipses / rings under players' feet with team colors
    - Player ID and Speed (km/h) HUD tags
    - Inverted triangle ball indicator
    - Match HUD banner with live possession stats
    - Side-by-side composition (Annotated Frame + 2D Radar)
    """
    def __init__(self):
        # Color palettes (BGR): Earthy Terracotta Red vs Deep Forest Cyan
        self.team_colors = {
            0: (50, 60, 225),    # Terracotta Red
            1: (215, 145, 45),   # Forest Cyan / Warm Teal
            -1: (40, 200, 220)   # Amber Gold (Referee)
        }
        self.ball_color = (30, 215, 255) # Bright Gold / Amber

    def draw_player_ring(self, frame: np.ndarray, bbox: list, color: tuple, label: str = ""):
        """
        Draws a tactical elliptical ring on the grass at the player's feet with a clean badge.
        """
        x1, y1, x2, y2 = map(int, bbox)
        foot_x = int((x1 + x2) / 2)
        foot_y = int(y2)
        
        radius_x = int(max(14, (x2 - x1) * 0.45))
        radius_y = int(radius_x * 0.35)

        # Draw anti-aliased ground ellipse
        cv2.ellipse(frame, (foot_x, foot_y), (radius_x, radius_y), 0, -45, 225, color, 2, cv2.LINE_AA)
        cv2.ellipse(frame, (foot_x, foot_y), (radius_x - 3, radius_y - 1), 0, -45, 225, (245, 245, 240), 1, cv2.LINE_AA)

        # Draw Player ID & Speed Badge in espresso background with cream text
        if label:
            (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
            tag_y = foot_y + 16
            tag_x1 = foot_x - w // 2 - 6
            tag_y1 = tag_y - h - 4
            tag_x2 = foot_x + w // 2 + 6
            tag_y2 = tag_y + 4

            sub_img = frame[max(0, tag_y1):min(frame.shape[0], tag_y2), max(0, tag_x1):min(frame.shape[1], tag_x2)]
            if sub_img.shape[0] > 0 and sub_img.shape[1] > 0:
                overlay = np.full_like(sub_img, (35, 30, 25)) # Deep espresso
                cv2.addWeighted(sub_img, 0.25, overlay, 0.75, 0, sub_img)

            cv2.rectangle(frame, (tag_x1, tag_y1), (tag_x2, tag_y2), color, 1)
            cv2.putText(frame, label, (foot_x - w // 2, tag_y - 2), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (245, 245, 240), 1, cv2.LINE_AA)

    def draw_ball_pointer(self, frame: np.ndarray, ball_bbox: list):
        """
        Draws a floating inverted triangle pointing downward to the ball.
        """
        x1, y1, x2, y2 = map(int, ball_bbox)
        center_x = int((x1 + x2) / 2)
        top_y = max(10, int(y1) - 6)
        
        pt1 = (center_x, top_y)
        pt2 = (center_x - 8, top_y - 14)
        pt3 = (center_x + 8, top_y - 14)
        triangle_cnt = np.array([pt1, pt2, pt3], np.int32)

        cv2.drawContours(frame, [triangle_cnt], 0, self.ball_color, -1, cv2.LINE_AA)
        cv2.drawContours(frame, [triangle_cnt], 0, (30, 25, 20), 1, cv2.LINE_AA)

    def draw_hud(self, frame: np.ndarray, possession: dict, frame_num: int, total_frames: int):
        """
        Draws top HUD bar with team possession percentages in warm espresso and forest/terracotta.
        """
        h, w, _ = frame.shape
        hud_h = 44
        bar_w = 340
        start_x = (w - bar_w) // 2

        # Translucent dark espresso container
        overlay = frame.copy()
        cv2.rectangle(overlay, (start_x - 12, 8), (start_x + bar_w + 12, 8 + hud_h), (28, 24, 20), -1)
        cv2.addWeighted(overlay, 0.8, frame, 0.2, 0, frame)

        p0 = possession.get(0, 50.0)
        p1 = possession.get(1, 50.0)

        # Possession Bar
        split_x = int(start_x + (bar_w * (p0 / 100.0)))
        cv2.rectangle(frame, (start_x, 32), (split_x, 42), self.team_colors[0], -1)
        cv2.rectangle(frame, (split_x, 32), (start_x + bar_w, 42), self.team_colors[1], -1)

        # Warm cream typography
        text_team0 = f"TEAM ALPHA: {p0:.1f}%"
        text_team1 = f"{p1:.1f}% :TEAM BETA"
        cv2.putText(frame, text_team0, (start_x, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (245, 245, 240), 1, cv2.LINE_AA)
        (tw, _), _ = cv2.getTextSize(text_team1, cv2.FONT_HERSHEY_SIMPLEX, 0.42, 1)
        cv2.putText(frame, text_team1, (start_x + bar_w - tw, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (245, 245, 240), 1, cv2.LINE_AA)

    def compose_side_by_side(self, frame: np.ndarray, radar_img: np.ndarray) -> np.ndarray:
        """
        Horizontally stacks match video frame with the 2D Pitch Radar minimap.
        """
        fh, fw, _ = frame.shape
        target_h = 720
        
        scale_f = target_h / float(fh)
        scaled_fw = int(fw * scale_f)
        resized_frame = cv2.resize(frame, (scaled_fw, target_h), interpolation=cv2.INTER_LINEAR)

        rh, rw, _ = radar_img.shape
        scale_r = target_h / float(rh)
        scaled_rw = int(rw * scale_r)
        resized_radar = cv2.resize(radar_img, (scaled_rw, target_h), interpolation=cv2.INTER_LINEAR)

        combined = np.hstack((resized_frame, resized_radar))
        return combined
