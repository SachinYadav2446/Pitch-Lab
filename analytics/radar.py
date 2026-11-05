import cv2
import numpy as np

class PitchRadar:
    """
    Renders an aesthetically pleasing 2D tactical minimap of a standard football pitch (105m x 68m).
    Palette: Earthy deep forest green pitch, warm cream markings, and dark espresso borders.
    """
    def __init__(self, radar_w=580, radar_h=380, pitch_length=105.0, pitch_width=68.0):
        self.radar_w = radar_w
        self.radar_h = radar_h
        self.pitch_length = pitch_length
        self.pitch_width = pitch_width
        self.margin = 24
        
        self.field_w = self.radar_w - 2 * self.margin
        self.field_h = self.radar_h - 2 * self.margin
        
        self.scale_x = self.field_w / self.pitch_length
        self.scale_y = self.field_h / self.pitch_width
        
        # Color Palette (BGR): Deep Forest Green, Warm Cream, Rich Espresso
        self.bg_color = (235, 240, 245)      # Outer warm linen background
        self.grass_1 = (44, 76, 50)          # Forest green stripe 1
        self.grass_2 = (38, 68, 44)          # Forest green stripe 2
        self.line_color = (220, 235, 225)    # Warm soft ivory/cream
        self.border_color = (35, 45, 40)     # Dark espresso frame
        self.line_thickness = 1

    def meter_to_pixel(self, x_m: float, y_m: float) -> tuple:
        px = int(self.margin + x_m * self.scale_x)
        py = int(self.margin + y_m * self.scale_y)
        return (px, py)

    def draw_blank_pitch(self) -> np.ndarray:
        # Linen beige/cream background
        canvas = np.full((self.radar_h, self.radar_w, 3), (230, 238, 242), dtype=np.uint8)

        # Draw alternating forest pitch stripes
        num_stripes = 10
        stripe_w = self.field_w / num_stripes
        for i in range(num_stripes):
            x_start = int(self.margin + i * stripe_w)
            x_end = int(self.margin + (i + 1) * stripe_w)
            col = self.grass_1 if i % 2 == 0 else self.grass_2
            cv2.rectangle(canvas, (x_start, self.margin), (x_end, self.radar_h - self.margin), col, -1)

        # Outer pitch frame in deep espresso
        top_left = (self.margin, self.margin)
        bottom_right = (self.radar_w - self.margin, self.radar_h - self.margin)
        cv2.rectangle(canvas, top_left, bottom_right, self.line_color, self.line_thickness)
        cv2.rectangle(canvas, (self.margin - 1, self.margin - 1), 
                      (self.radar_w - self.margin + 1, self.radar_h - self.margin + 1), 
                      self.border_color, 1)

        # Halfway line
        half_x = int(self.margin + self.field_w / 2)
        cv2.line(canvas, (half_x, self.margin), (half_x, self.radar_h - self.margin), self.line_color, self.line_thickness)

        # Center circle (9.15m radius)
        center_pt = (half_x, int(self.margin + self.field_h / 2))
        circle_radius = int(9.15 * self.scale_x)
        cv2.circle(canvas, center_pt, circle_radius, self.line_color, self.line_thickness)
        cv2.circle(canvas, center_pt, 3, self.line_color, -1)

        # Left Penalty Box (16.5m length, 40.32m width)
        pen_box_w = int(16.5 * self.scale_x)
        pen_box_h = int(40.32 * self.scale_y)
        pen_box_y1 = int(self.margin + (self.field_h - pen_box_h) / 2)
        cv2.rectangle(canvas, (self.margin, pen_box_y1), (self.margin + pen_box_w, pen_box_y1 + pen_box_h), self.line_color, self.line_thickness)

        # Right Penalty Box
        cv2.rectangle(canvas, (self.radar_w - self.margin - pen_box_w, pen_box_y1), (self.radar_w - self.margin, pen_box_y1 + pen_box_h), self.line_color, self.line_thickness)

        # Goal areas (5.5m by 18.32m)
        goal_area_w = int(5.5 * self.scale_x)
        goal_area_h = int(18.32 * self.scale_y)
        goal_area_y1 = int(self.margin + (self.field_h - goal_area_h) / 2)
        cv2.rectangle(canvas, (self.margin, goal_area_y1), (self.margin + goal_area_w, goal_area_y1 + goal_area_h), self.line_color, self.line_thickness)
        cv2.rectangle(canvas, (self.radar_w - self.margin - goal_area_w, goal_area_y1), (self.radar_w - self.margin, goal_area_y1 + goal_area_h), self.line_color, self.line_thickness)

        return canvas

    def render(self, players: list, ball: tuple = None) -> np.ndarray:
        canvas = self.draw_blank_pitch()

        # Render Players
        for p in players:
            x_m, y_m = p['pos']
            px, py = self.meter_to_pixel(x_m, y_m)
            color = p.get('color', (0, 0, 220))
            p_id = p.get('id', '')

            # Shadow / halo in deep espresso
            cv2.circle(canvas, (px, py), 8, (25, 30, 25), -1)
            cv2.circle(canvas, (px, py), 7, color, -1)
            cv2.circle(canvas, (px, py), 7, (245, 245, 240), 1)

            # Player ID label in warm cream
            if p_id != '':
                text = str(p_id)
                (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.35, 1)
                cv2.putText(canvas, text, (px - tw // 2, py + th // 2), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1, cv2.LINE_AA)

        # Render Ball in bright gold/amber
        if ball is not None:
            bx, by = self.meter_to_pixel(ball[0], ball[1])
            cv2.circle(canvas, (bx, by), 6, (40, 215, 255), -1)
            cv2.circle(canvas, (bx, by), 6, (20, 20, 20), 1)

        return canvas
