import React from 'react';

/**
 * TacticalFootballerArt:
 * High-tech Computer Vision vector artwork of an elite footballer striking a ball.
 * Features:
 * - Dynamic kinetic player silhouette & muscle contouring
 * - COCO-style 17-keypoint skeletal pose estimation graph
 * - Pulsing joint telemetry nodes
 * - Geodesic football with 3D flight trajectory arc and velocity vectors
 * - Pitch homography ground perspective grid
 * - Computer vision bounding box, target corners, and real-time telemetry HUD
 * - Subtle vertical scanning laser effect
 */
export default function TacticalFootballerArt() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '420px',
      height: '100%',
      maxHeight: '660px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    }}>
      <svg
        viewBox="0 0 440 660"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.35))'
        }}
      >
        <defs>
          {/* Subtle player gradient */}
          <linearGradient id="tacticalPlayerGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFF5E6" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#E8D2B5" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C9B397" stopOpacity="0.08" />
          </linearGradient>

          {/* Glow filter for joints and trajectory */}
          <filter id="cvGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Scanner beam gradient */}
          <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="rgba(232, 210, 181, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 246, 235, 0.9)" />
            <stop offset="75%" stopColor="rgba(232, 210, 181, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Ball trajectory gradient */}
          <linearGradient id="ballTrailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8D2B5" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E8D2B5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFF6EB" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. PITCH HOMOGRAPHY PERSPECTIVE GRID (Z=0 Ground Turf)
            ======================================================== */}
        <g id="pitch-homography-plane" opacity="0.38">
          {/* Concentric distance radar ellipses */}
          <ellipse cx="205" cy="545" rx="155" ry="32" fill="none" stroke="var(--cream-beige)" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="205" cy="545" rx="105" ry="22" fill="none" stroke="var(--cream-beige)" strokeWidth="1.2" />
          <ellipse cx="205" cy="545" rx="55" ry="12" fill="rgba(232, 210, 181, 0.08)" stroke="var(--cream-beige)" strokeWidth="1" />

          {/* Radiating homography perspective lines */}
          <line x1="50" y1="545" x2="360" y2="545" stroke="var(--cream-beige)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="205" y1="513" x2="205" y2="577" stroke="var(--cream-beige)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="100" y1="535" x2="70" y2="560" stroke="var(--cream-beige)" strokeWidth="0.8" />
          <line x1="310" y1="535" x2="340" y2="560" stroke="var(--cream-beige)" strokeWidth="0.8" />

          {/* Origin calibration crosshair */}
          <circle cx="205" cy="545" r="2.5" fill="var(--cream-beige)" />
          <text x="215" y="558" fill="var(--cream-beige)" fontSize="9" fontFamily="monospace" letterSpacing="0.5">
            Z:0.00m [PITCH ORIGIN]
          </text>
        </g>

        {/* ========================================================
            2. CV BOUNDING BOX & TARGET BRACKETS
            ======================================================== */}
        <g id="cv-bounding-box" opacity="0.55">
          {/* Main dashed frame */}
          <rect x="52" y="75" width="336" height="495" fill="none" stroke="rgba(232, 210, 181, 0.2)" strokeWidth="1" strokeDasharray="6 6" />

          {/* Top-Left Bracket */}
          <path d="M 46 95 L 46 69 L 72 69" fill="none" stroke="var(--cream-beige)" strokeWidth="2.5" />
          {/* Top-Right Bracket */}
          <path d="M 368 69 L 394 69 L 394 95" fill="none" stroke="var(--cream-beige)" strokeWidth="2.5" />
          {/* Bottom-Left Bracket */}
          <path d="M 46 545 L 46 575 L 72 575" fill="none" stroke="var(--cream-beige)" strokeWidth="2.5" />
          {/* Bottom-Right Bracket */}
          <path d="M 368 575 L 394 575 L 394 545" fill="none" stroke="var(--cream-beige)" strokeWidth="2.5" />

          {/* Top CV ID Tag */}
          <rect x="50" y="50" width="138" height="20" rx="3" fill="#3D0605" stroke="rgba(232, 210, 181, 0.5)" strokeWidth="1" />
          <text x="58" y="64" fill="var(--cream-beige)" fontSize="10.5" fontFamily="monospace" fontWeight="700">
            ID: STRIKER_10 • 99.2%
          </text>
        </g>

        {/* ========================================================
            3. ATHLETIC FOOTBALLER SILHOUETTE (KINETIC VOLLEY / STRIKE)
            ======================================================== */}
        <g id="footballer-silhouette">
          {/* 
            Anatomically contoured athletic player:
            - Leaning forward with kinetic torque
            - Left arm raised for dynamic balance
            - Right arm cocked back
            - Left leg planted firmly into turf
            - Right leg driving forward through the ball in explosive follow-through
          */}
          <path
            d={`
              M 206 100
              C 214 97, 222 103, 224 112
              C 226 122, 220 133, 212 137
              L 214 148
              C 230 152, 252 160, 260 172
              C 267 182, 276 200, 280 218
              C 283 230, 282 242, 276 244
              C 270 246, 265 236, 263 225
              C 260 210, 253 196, 246 190
              L 242 220
              C 240 248, 235 272, 228 290
              L 242 300
              C 255 315, 278 340, 296 364
              C 312 384, 328 402, 342 414
              C 350 420, 355 425, 358 433
              C 360 440, 354 445, 344 444
              C 334 442, 322 433, 314 424
              C 298 405, 280 376, 268 355
              L 254 350
              C 246 368, 236 388, 224 402
              L 220 338
              C 208 345, 196 352, 186 362
              L 182 410
              C 180 440, 178 472, 174 502
              L 174 532
              C 174 540, 168 544, 156 544
              C 144 544, 140 538, 146 530
              C 152 522, 158 500, 160 464
              C 162 426, 165 382, 170 344
              L 165 312
              C 160 286, 160 258, 164 236
              L 155 220
              C 145 204, 130 190, 116 178
              C 108 172, 102 168, 104 160
              C 106 152, 115 152, 126 158
              C 142 166, 160 178, 172 192
              L 182 152
              C 188 144, 194 140, 202 138
              L 200 132
              C 194 128, 190 120, 192 110
              C 194 103, 200 100, 206 100
              Z
            `}
            fill="url(#tacticalPlayerGrad)"
            stroke="rgba(232, 210, 181, 0.75)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Internal athletic muscle and kit contour lines */}
          <g stroke="rgba(232, 210, 181, 0.28)" strokeWidth="1" fill="none">
            {/* Jersey collar & shoulder seam */}
            <path d="M 196 142 Q 206 148 216 143" />
            <path d="M 178 170 Q 206 182 236 174" />
            {/* Torso & spine line */}
            <path d="M 205 180 Q 202 230 200 285" strokeDasharray="3 3" />
            {/* Shorts waistband & hem */}
            <path d="M 174 275 Q 205 285 234 278" />
            <path d="M 166 324 Q 192 334 220 326" />
            {/* Plant leg quad & calf striations */}
            <path d="M 174 365 Q 172 405 170 455" />
            {/* Kicking leg hamstrings & power drive */}
            <path d="M 240 310 Q 275 348 318 395" />
            <path d="M 262 335 Q 288 368 325 410" strokeDasharray="2 2" />
          </g>
        </g>

        {/* ========================================================
            4. COCO-17 SKELETAL POSE GRAPH & JOINT NODES
            ======================================================== */}
        <g id="cv-pose-skeleton">
          {/* Skeletal Limb Connectors (Dashed glowing vectors) */}
          <g stroke="var(--cream-beige)" strokeWidth="1.6" strokeDasharray="4 2.5" opacity="0.85" filter="url(#cvGlow)">
            {/* Head to Neck */}
            <line x1="208" y1="116" x2="204" y2="144" />
            {/* Clavicle / Shoulders */}
            <line x1="168" y1="168" x2="204" y2="144" />
            <line x1="204" y1="144" x2="246" y2="170" />
            {/* Left Balance Arm */}
            <line x1="168" y1="168" x2="134" y2="176" />
            <line x1="134" y1="176" x2="108" y2="162" />
            {/* Right Power Arm */}
            <line x1="246" y1="170" x2="268" y2="202" />
            <line x1="268" y1="202" x2="278" y2="238" />
            {/* Spine (Thoracic to Pelvis) */}
            <line x1="204" y1="144" x2="200" y2="215" />
            <line x1="200" y1="215" x2="198" y2="280" />
            {/* Pelvis to Hips */}
            <line x1="198" y1="280" x2="178" y2="295" />
            <line x1="198" y1="280" x2="228" y2="292" />
            {/* Plant Leg (Left) */}
            <line x1="178" y1="295" x2="172" y2="395" />
            <line x1="172" y1="395" x2="164" y2="505" />
            <line x1="164" y1="505" x2="152" y2="538" />
            {/* Striking Leg (Right) */}
            <line x1="228" y1="292" x2="278" y2="360" />
            <line x1="278" y1="360" x2="328" y2="415" />
            <line x1="328" y1="415" x2="354" y2="438" />
          </g>

          {/* Keypoint Nodes (Inner solid dot + outer glowing radar ring) */}
          {[
            { id: 'Nose', x: 208, y: 116 },
            { id: 'Neck', x: 204, y: 144 },
            { id: 'L_Shoulder', x: 168, y: 168 },
            { id: 'R_Shoulder', x: 246, y: 170 },
            { id: 'L_Elbow', x: 134, y: 176 },
            { id: 'R_Elbow', x: 268, y: 202 },
            { id: 'L_Wrist', x: 108, y: 162 },
            { id: 'R_Wrist', x: 278, y: 238 },
            { id: 'Spine', x: 200, y: 215 },
            { id: 'Pelvis', x: 198, y: 280 },
            { id: 'L_Hip', x: 178, y: 295 },
            { id: 'R_Hip', x: 228, y: 292 },
            { id: 'L_Knee', x: 172, y: 395 },
            { id: 'R_Knee', x: 278, y: 360 },
            { id: 'L_Ankle', x: 164, y: 505 },
            { id: 'R_Ankle', x: 328, y: 415 },
            { id: 'R_Cleat', x: 354, y: 438, highlight: true }
          ].map((kp) => (
            <g key={kp.id} transform={`translate(${kp.x}, ${kp.y})`}>
              {/* Outer pulsing ring */}
              <circle
                r={kp.highlight ? 7 : 5}
                fill="none"
                stroke="var(--cream-beige)"
                strokeWidth="1.2"
                opacity="0.8"
              />
              {/* Inner core node */}
              <circle
                r={kp.highlight ? 3.5 : 2.5}
                fill="#FFF6EB"
              />
            </g>
          ))}
        </g>

        {/* ========================================================
            5. FOOTBALL, GEODESIC TEXTURE & 3D TRAJECTORY ARC
            ======================================================== */}
        <g id="football-trajectory">
          {/* Flight Trajectory Arc (3D homography curve launching from impact) */}
          <path
            d="M 354 438 Q 380 435 388 420 T 418 290 T 430 140"
            fill="none"
            stroke="url(#ballTrailGrad)"
            strokeWidth="2.8"
            strokeDasharray="5 4"
            filter="url(#cvGlow)"
          />

          {/* Velocity direction vector arrow */}
          <line x1="388" y1="422" x2="415" y2="350" stroke="#FFF6EB" strokeWidth="1.8" />
          <polygon points="415,350 408,358 418,360" fill="#FFF6EB" />

          {/* Football at Point of Impact */}
          <g transform="translate(388, 420)">
            {/* Outer sphere shadow/glow */}
            <circle cx="0" cy="0" r="17" fill="#FFF6EB" stroke="var(--burgundy-deep)" strokeWidth="1.8" filter="url(#cvGlow)" />
            {/* Pentagon center badge */}
            <polygon points="0,-7 6,-2 4,6 -4,6 -6,-2" fill="var(--burgundy-deep)" />
            {/* Seams radiating outwards */}
            <line x1="0" y1="-7" x2="0" y2="-17" stroke="var(--burgundy-deep)" strokeWidth="1.4" />
            <line x1="6" y1="-2" x2="16" y2="-5" stroke="var(--burgundy-deep)" strokeWidth="1.4" />
            <line x1="4" y1="6" x2="11" y2="13" stroke="var(--burgundy-deep)" strokeWidth="1.4" />
            <line x1="-4" y1="6" x2="-11" y2="13" stroke="var(--burgundy-deep)" strokeWidth="1.4" />
            <line x1="-6" y1="-2" x2="-16" y2="-5" stroke="var(--burgundy-deep)" strokeWidth="1.4" />
          </g>

          {/* Trajectory Waypoint Markers */}
          <circle cx="410" cy="330" r="3" fill="var(--cream-beige)" />
          <circle cx="424" cy="220" r="2.5" fill="var(--cream-beige)" opacity="0.7" />
          <circle cx="430" cy="140" r="2" fill="var(--cream-beige)" opacity="0.4" />
        </g>

        {/* ========================================================
            6. REAL-TIME SPORTS VISION HUD OVERLAYS
            ======================================================== */}
        <g id="hud-telemetry" fontFamily="monospace">
          {/* Top Kinetic Vector Badge */}
          <g transform="translate(230, 92)">
            <rect x="0" y="0" width="144" height="34" rx="4" fill="#3D0605" fillOpacity="0.85" stroke="rgba(232, 210, 181, 0.4)" strokeWidth="1" />
            <text x="8" y="14" fill="var(--cream-beige)" fontSize="8.5" fontWeight="700">
              STRIKE VEL: 104.2 KM/H
            </text>
            <text x="8" y="27" fill="var(--cream-beige)" opacity="0.75" fontSize="7.5">
              BALL SPIN: 420 RPM • xG 0.44
            </text>
          </g>

          {/* Plant Leg Ground Sensor Badge */}
          <g transform="translate(62, 480)">
            <rect x="0" y="0" width="132" height="32" rx="4" fill="#3D0605" fillOpacity="0.85" stroke="rgba(232, 210, 181, 0.4)" strokeWidth="1" />
            <text x="8" y="13" fill="var(--cream-beige)" fontSize="8" fontWeight="700">
              ANCHOR: (38.2m, 14.5m)
            </text>
            <text x="8" y="25" fill="var(--cream-beige)" opacity="0.75" fontSize="7.5">
              GROUND REACTION: 2.8 kN
            </text>
          </g>

          {/* Live tracking confidence gauge */}
          <g transform="translate(62, 110)">
            <text x="0" y="0" fill="var(--cream-beige)" fontSize="7.5" opacity="0.7">
              POSE_ESTIMATION_17KP
            </text>
            <rect x="0" y="5" width="80" height="3" rx="1.5" fill="rgba(232, 210, 181, 0.2)" />
            <rect x="0" y="5" width="76" height="3" rx="1.5" fill="var(--cream-beige)" />
          </g>
        </g>

        {/* ========================================================
            7. SCANNING LASER BEAM (LIVE INFERENCE SCANNER)
            ======================================================== */}
        <g id="laser-scanner" className="tactical-scanner-beam">
          <line x1="40" y1="240" x2="400" y2="240" stroke="url(#scanBeamGrad)" strokeWidth="2" filter="url(#cvGlow)" />
        </g>
      </svg>
    </div>
  );
}
