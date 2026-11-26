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
        # Estimated field corner locations in broadcast frame (16:9 aspect)
        src = np.array([
            [int(frame_w * 0.12), int(frame_h * 0.22)],  # Top-left of visible field
            [int(frame_w * 0.88), int(frame_h * 0.22)],  # Top-right of visible field
            [int(frame_w * 0.98), int(frame_h * 0.95)],  # Bottom-right near camera
            [int(frame_w * 0.02), int(frame_h * 0.95)]   # Bottom-left near camera
        ], dtype=np.float32)

        # Corresponding 2D pitch coordinates for broadcast tactical angle (in meters)
        # Standard broadcast camera covers roughly a 45m section of the 105m pitch
        dst = np.array([
            [22.0, 6.0],    # X=22m (near 18-yd line), Y=6m (far touchline)
            [64.0, 6.0],    # X=64m (past center line), Y=6m (far touchline)
            [68.0, 64.0],   # X=68m, Y=64m (near touchline)
            [18.0, 64.0]    # X=18m, Y=64m (near touchline)
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

    def get_player_foot_position(self, bbox: list, pan_offset_x: float = 0.0) -> tuple:
        """
        Given a player bounding box [x1, y1, x2, y2], returns the bottom-center point
        which represents the contact point with the pitch ground.
        """
        x1, y1, x2, y2 = bbox
        foot_x = (x1 + x2) / 2.0
        foot_y = float(y2)
        px, py = self.transform_point(foot_x, foot_y)
        if pan_offset_x != 0.0:
            px = float(np.clip(px + pan_offset_x, 0.0, self.PITCH_LENGTH))
        return px, py

    def get_camera_frustum(self, frame_w: int, frame_h: int, pan_offset_x: float = 0.0) -> list:
        """
        Calculates the 4 metric pitch coordinates (meters) representing the 
        ground area currently visible within the camera's field of view.
        Returns: [[x_tl, y_tl], [x_tr, y_tr], [x_br, y_br], [x_bl, y_bl]]
        """
        pts_pixel = [
            (frame_w * 0.06, frame_h * 0.20),  # Top-left (far touchline)
            (frame_w * 0.94, frame_h * 0.20),  # Top-right (far touchline)
            (frame_w * 0.98, frame_h * 0.96),  # Bottom-right (near touchline)
            (frame_w * 0.02, frame_h * 0.96)   # Bottom-left (near touchline)
        ]
        frustum = []
        for px, py in pts_pixel:
            mx, my = self.transform_point(px, py)
            mx = float(np.clip(mx + pan_offset_x, 0.0, self.PITCH_LENGTH))
            my = float(np.clip(my, 0.0, self.PITCH_WIDTH))
            frustum.append([round(mx, 2), round(my, 2)])
        return frustum
