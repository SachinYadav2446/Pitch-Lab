import cv2
import numpy as np
import os

class SportsDetectorTracker:
    """
    Object detection and tracking engine for football analytics.
    Uses YOLO with ByteTrack when weights are present, with graceful fallback to CV tracker.
    """
    COCO_PERSON_CLASS = 0
    COCO_SPORTS_BALL_CLASS = 32

    def __init__(self, model_name="yolov8n.pt", device=None, conf_thresh=0.25):
        self.model_name = model_name
        self.device = device
        self.conf_thresh = conf_thresh
        self.model = None
        self.is_yolo_active = False

        # Try initializing YOLO
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_name)
            self.is_yolo_active = True
        except Exception as e:
            print(f"[Tracker] YOLO model could not be initialized ({e}). Using Computer Vision Fallback Tracker.")
            self.is_yolo_active = False

        # Ball tracking memory for smoothing
        self.last_known_ball = None
        self.ball_miss_count = 0
        self.max_ball_memory = 10

        # Fallback tracker state
        self.prev_gray = None
        self.tracked_objects = {}
        self.next_obj_id = 1

    def process_frame(self, frame: np.ndarray, persist=True) -> dict:
        """
        Runs tracking on a single frame.
        """
        if self.is_yolo_active and self.model is not None:
            try:
                results = self.model.track(
                    frame, 
                    persist=persist, 
                    tracker="bytetrack.yaml", 
                    conf=self.conf_thresh,
                    classes=[self.COCO_PERSON_CLASS, self.COCO_SPORTS_BALL_CLASS],
                    imgsz=640,
                    device=self.device,
                    verbose=False
                )

                players = []
                ball = None
                highest_ball_conf = 0.0

                if results and len(results) > 0:
                    boxes = results[0].boxes
                    if boxes is not None:
                        for box in boxes:
                            cls_id = int(box.cls[0].item())
                            conf = float(box.conf[0].item())
                            xyxy = box.xyxy[0].tolist()

                            if cls_id == self.COCO_PERSON_CLASS:
                                track_id = int(box.id[0].item()) if box.id is not None else -1
                                players.append({
                                    'id': track_id,
                                    'bbox': xyxy,
                                    'conf': conf
                                })
                            elif cls_id == self.COCO_SPORTS_BALL_CLASS:
                                if conf > highest_ball_conf:
                                    highest_ball_conf = conf
                                    ball = {'bbox': xyxy, 'conf': conf}

                # Ball smoothing
                if ball is not None:
                    self.last_known_ball = ball
                    self.ball_miss_count = 0
                else:
                    self.ball_miss_count += 1
                    if self.ball_miss_count <= self.max_ball_memory and self.last_known_ball is not None:
                        ball = self.last_known_ball

                return {'players': players, 'ball': ball}
            except Exception as ex:
                print(f"[Tracker] YOLO inference error: {ex}. Falling back to CV.")

        # Fallback CV detector: Color Segmentation + Contour Detection on Pitch
        return self._fallback_cv_detection(frame)

    def _fallback_cv_detection(self, frame: np.ndarray) -> dict:
        """
        Robust computer-vision based player detector when deep learning weights are pending download.
        Detects players by isolating non-pitch objects on the grass.
        """
        h, w, _ = frame.shape
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Detect green pitch
        lower_green = np.array([25, 40, 40])
        upper_green = np.array([95, 255, 255])
        pitch_mask = cv2.inRange(hsv, lower_green, upper_green)

        # Invert to isolate players, ball, and markings
        non_pitch = cv2.bitwise_not(pitch_mask)
        
        # Morphological cleanup
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        non_pitch = cv2.morphologyEx(non_pitch, cv2.MORPH_OPEN, kernel)
        non_pitch = cv2.dilate(non_pitch, kernel, iterations=2)

        contours, _ = cv2.findContours(non_pitch, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        players = []
        ball = None
        min_area = 150
        max_area = 15000

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if min_area < area < max_area:
                x, y, bw, bh = cv2.boundingRect(cnt)
                aspect_ratio = bh / float(max(bw, 1))

                # Human shape: tall aspect ratio
                if aspect_ratio > 1.1 and bh > 25:
                    center = (x + bw // 2, y + bh)
                    matched_id = -1
                    min_dist = 60.0

                    for tid, prev_pt in list(self.tracked_objects.items()):
                        d = np.sqrt((center[0] - prev_pt[0])**2 + (center[1] - prev_pt[1])**2)
                        if d < min_dist:
                            matched_id = tid
                            min_dist = d
                            break

                    if matched_id == -1:
                        matched_id = self.next_obj_id
                        self.next_obj_id += 1

                    self.tracked_objects[matched_id] = center
                    players.append({
                        'id': matched_id,
                        'bbox': [x, y, x + bw, y + bh],
                        'conf': 0.85
                    })
                elif area < 300 and 0.7 <= aspect_ratio <= 1.4:
                    # Ball candidate
                    ball = {'bbox': [x, y, x + bw, y + bh], 'conf': 0.9}

        return {'players': players, 'ball': ball}
