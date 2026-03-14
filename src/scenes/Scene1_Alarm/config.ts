import type { SceneConfig } from "../../types/scene";

export const SCENE1_CONFIG: SceneConfig = {
  name: "The Alarm",
  fog: {
    color: 0x1a1a2e,
    near: 3,
    far: 12,
  },
  camera: {
    position: [0, 1.5, 2.5], // eye-level, inside the room
    lookAt: [0, 0.8, -2],
    fov: 55,
  },
  colors: {
    background: 0x1a1a2e,
    ambient: 0x4a4a6a,
    key: 0x6b7b8d,
    accent: 0xff3333,
  },
};

/** Camera keyframes driven by scroll progress within Scene 1 */
export const CAMERA_KEYFRAMES = {
  /** 0% — wide shot from doorway, see the whole room */
  start: {
    position: [0, 1.5, 2.5] as const,
    lookAt: [0, 0.8, -2] as const,
  },
  /** 40% — move closer, looking at bed area */
  mid: {
    position: [-0.3, 1.2, 0.5] as const,
    lookAt: [0, 0.6, -2] as const,
  },
  /** 70% — orbit toward alarm clock on bedside table */
  alarm: {
    position: [1.2, 1, -0.8] as const,
    lookAt: [0.8, 0.6, -2] as const,
  },
  /** 100% — close-up on alarm, red glow fills frame */
  end: {
    position: [1, 0.8, -1.2] as const,
    lookAt: [0.7, 0.55, -2] as const,
  },
};

/** Bedside table — right side of bed, against wall */
export const BEDSIDE_POSITION = [0.8, 0, -2.0] as const;

/** Position of the alarm clock on the bedside table */
export const ALARM_POSITION = [0.7, 0.55, -2.0] as const;

/** Position of the coffee mug on the bedside table */
export const MUG_POSITION = [0.95, 0.55, -1.8] as const;

/** Bed — center of room, against back wall */
export const BED_POSITION = [-0.5, 0, -2.0] as const;

/** Window frame — on the right wall, upper portion */
export const WINDOW_POSITION = [2.95, 1.5, -1.0] as const;
