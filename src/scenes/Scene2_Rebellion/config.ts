import type { SceneConfig } from "../../types/scene";

export const SCENE2_CONFIG: SceneConfig = {
  name: "The Rebellion",
  fog: {
    color: 0x0d0d1a,
    near: 2,
    far: 14,
  },
  camera: {
    position: [0, 1.5, 3],
    lookAt: [0, 1, 0],
    fov: 65, // wider FOV — more chaotic, distorted
  },
  colors: {
    background: 0x0d0d1a,
    ambient: 0x2a1a3a,   // deeper purple, oppressive
    key: 0x8855aa,       // purple tint
    accent: 0xff6600,    // reckless orange
  },
};

/** Camera keyframes — restless, never settling */
export const CAMERA_KEYFRAMES_2 = {
  /** 0% — same room, but something feels different. tight angle */
  start: {
    position: [0, 1.4, 2.8] as const,
    lookAt: [0, 0.8, 0] as const,
  },
  /** 30% — push in fast, chaotic energy */
  rush: {
    position: [0.8, 1.6, 1.2] as const,
    lookAt: [-0.2, 0.9, -1] as const,
  },
  /** 60% — wide dutch angle, things are wrong */
  chaos: {
    position: [-1.2, 2.0, 0.5] as const,
    lookAt: [0.5, 0.5, -2] as const,
  },
  /** 100% — zoom out slowly, emptiness settling in */
  end: {
    position: [0, 1.8, 3.5] as const,
    lookAt: [0, 0.5, 0] as const,
  },
};

/** Scattered objects — rebellion has no order */
export const DEBRIS_POSITIONS: [number, number, number][] = [
  [-0.8, 0.02,  0.5],
  [ 0.3, 0.02,  0.8],
  [-1.0, 0.02, -0.5],
  [ 0.6, 0.02,  0.2],
  [-0.3, 0.02,  1.0],
];

/** Particle burst center — middle of the room */
export const BURST_CENTER = [0, 1, 0] as const;
