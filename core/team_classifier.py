import cv2
import numpy as np
from sklearn.cluster import KMeans

class TeamClassifier:
    """
    Classifies players into teams based on jersey color clustering using K-Means in RGB/HSV space.
    Filters out background grass green to ensure accurate jersey color extraction.
    """
    def __init__(self, n_teams=2):
        self.n_teams = n_teams
        self.team_colors = {}
        self.kmeans = None
        self.team_names = {0: "Team Alpha", 1: "Team Beta"}

    def _extract_jersey_color(self, frame: np.ndarray, bbox: list) -> np.ndarray:
        """
        Extracts the dominant color of the player's jersey from the upper half of the bounding box,
        excluding the green pitch background.
        """
        x1, y1, x2, y2 = map(int, bbox)
        h, w, _ = frame.shape
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        if x2 <= x1 or y2 <= y1:
            return np.array([128, 128, 128], dtype=np.uint8)

        # Upper half of player is the shirt/jersey
        jersey_crop = frame[y1 : y1 + int((y2 - y1) * 0.5), x1 : x2]
        if jersey_crop.size == 0:
            return np.array([128, 128, 128], dtype=np.uint8)

        # Convert to HSV to filter out green pitch grass
        hsv_crop = cv2.cvtColor(jersey_crop, cv2.COLOR_BGR2HSV)
        
        # Mask green field colors (Hue: 35-85)
        lower_green = np.array([30, 40, 40])
        upper_green = np.array([90, 255, 255])
        green_mask = cv2.inRange(hsv_crop, lower_green, upper_green)

        # Pixels that are NOT green grass
        non_grass_mask = cv2.bitwise_not(green_mask)
        non_grass_pixels = jersey_crop[non_grass_mask > 0]

        if len(non_grass_pixels) < 20:
            # Fallback to general center crop
            center_h, center_w = jersey_crop.shape[0] // 2, jersey_crop.shape[1] // 2
            patch = jersey_crop[max(0, center_h - 5):center_h + 5, max(0, center_w - 5):center_w + 5]
            if patch.size > 0:
                return np.mean(patch, axis=(0, 1)).astype(np.uint8)
            return np.array([128, 128, 128], dtype=np.uint8)

        # 2-cluster KMeans on non-grass pixels to get the primary jersey tone
        try:
            kmeans = KMeans(n_clusters=2, n_init=3, random_state=42)
            kmeans.fit(non_grass_pixels)
            # Find the most frequent cluster center
            labels, counts = np.unique(kmeans.labels_, return_counts=True)
            dominant_color = kmeans.cluster_centers_[labels[np.argmax(counts)]]
            return dominant_color.astype(np.uint8)
        except Exception:
            return np.mean(non_grass_pixels, axis=0).astype(np.uint8)

    def fit_teams(self, frame: np.ndarray, player_bboxes: list):
        """
        Fits global team color clusters based on all detected players in an early keyframe.
        """
        if len(player_bboxes) < self.n_teams:
            return

        colors = [self._extract_jersey_color(frame, bbox) for bbox in player_bboxes]
        colors = np.array(colors)

        self.kmeans = KMeans(n_clusters=self.n_teams, n_init=10, random_state=42)
        self.kmeans.fit(colors)

        # Store mean team colors (BGR)
        for i, center in enumerate(self.kmeans.cluster_centers_):
            self.team_colors[i] = [int(c) for c in center]

    def predict_team(self, frame: np.ndarray, bbox: list) -> int:
        """
        Predicts team id (0 or 1) for a player bounding box.
        """
        if self.kmeans is None:
            return 0

        color = self._extract_jersey_color(frame, bbox).reshape(1, -1)
        team_id = int(self.kmeans.predict(color)[0])
        return team_id

    def get_team_color(self, team_id: int) -> tuple:
        """
        Returns display BGR color for team.
        """
        # Vibrant default team colors: Team 0 = Red/Crimson, Team 1 = Royal Blue
        defaults = {0: (40, 40, 230), 1: (230, 130, 30)}
        if team_id in self.team_colors:
            return tuple(self.team_colors[team_id])
        return defaults.get(team_id, (200, 200, 200))
