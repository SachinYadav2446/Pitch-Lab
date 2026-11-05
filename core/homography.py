import cv2
import numpy as np

class PitchHomography:
    """
    Handles perspective transformation between 2D video camera pixels and standard 2D pitch coordinates.
    Standard football pitch: 105 meters (X) by 68 meters (Y).
    """
    PITCH_LENGTH = 105.0  # meters
    PITCH_WIDTH = 68.0    # meters

    def __init__(self, src_points=None, dst_points=None):
        self.H = None
        self.H_inv = None
        if src_points is not None and dst_points is not None:
            self.set_keypoints(src_points, dst_points)
        else:
            self.setup_default_calibration()

    def setup_default_calibration(self, frame_w=1920, frame_h=1080):
        """
        Creates a reasonable initial homography transformation for typical main broadcast football angles.
        Maps the visible field trapezoid in the camera view to standard pitch dimensions.
        """
        # Estimated field corner locations in a typical broadcast 1080p frame
        src = np.array([
            [int(frame_w * 0.15), int(frame_h * 0.25)],  # Top-left of visible field
            [int(frame_w * 0.85), int(frame_h * 0.25)],  # Top-right of visible field
            [int(frame_w * 0.98), int(frame_h * 0.95)],  # Bottom-right
            [int(frame_w * 0.02), int(frame_h * 0.95)]   # Bottom-left
        ], dtype=np.float32)

        # Corresponding 2D pitch coordinates (in meters)
        dst = np.array([
            [15.0, 5.0],    # X=15m, Y=5m
            [90.0, 5.0],    # X=90m, Y=5m
            [95.0, 63.0],   # X=95m, Y=63m
            [10.0, 63.0]    # X=10m, Y=63m
        ], dtype=np.float32)

        self.set_keypoints(src, dst)

    def set_keypoints(self, src_points: np.ndarray, dst_points: np.ndarray):
        """
        Computes the Homography matrix H using cv2.findHomography.
        """
        src = np.array(src_points, dtype=np.float32)
        dst = np.array(dst_points, dtype=np.float32)
        
        if len(src) < 4 or len(dst) < 4:
            raise ValueError("At least 4 keypoint pairs are required to compute Homography.")

        self.H, _ = cv2.findHomography(src, dst)
        if self.H is not None:
            self.H_inv = np.linalg.pinv(self.H)

    def transform_point(self, pixel_x: float, pixel_y: float) -> tuple:
        """
        Transforms a camera pixel coordinate (e.g. player's feet) into 2D pitch coordinates (meters).
        Returns (pitch_x, pitch_y) clamped within pitch bounds.
        """
        if self.H is None:
            # Fallback normalized coordinates
            return (pixel_x / 1920.0 * self.PITCH_LENGTH, pixel_y / 1080.0 * self.PITCH_WIDTH)

        pt = np.array([[[pixel_x, pixel_y]]], dtype=np.float32)
        transformed = cv2.perspectiveTransform(pt, self.H)[0][0]
        
        pitch_x = float(np.clip(transformed[0], 0.0, self.PITCH_LENGTH))
        pitch_y = float(np.clip(transformed[1], 0.0, self.PITCH_WIDTH))
        return pitch_x, pitch_y

    def get_player_foot_position(self, bbox: list) -> tuple:
        """
        Given a player bounding box [x1, y1, x2, y2], returns the bottom-center point
        which represents the contact point with the pitch ground.
        """
        x1, y1, x2, y2 = bbox
        foot_x = (x1 + x2) / 2.0
        foot_y = float(y2)
        return self.transform_point(foot_x, foot_y)
