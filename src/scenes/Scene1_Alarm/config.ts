import type { SceneConfig } from "../../types/scene";

export const SCENE1_CONFIG: SceneConfig = {
  name: "The Alarm",
  fog: {
    color: 0x2d2d3f,
    near: 5,
    far: 20,
  },
  camera: {
    position: [0, 1.6, 3.5], // eye-level, standing in the room
    lookAt: [0, 1, -1],
    fov: 50,
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
  /** 0% — wide shot, see the whole room */
  start: {
    position: [0, 1.6, 3.5] as const,
    lookAt: [0, 1, -1] as const,
  },
  /** 40% — move closer, looking at bed area */
  mid: {
    position: [-0.5, 1.4, 1.5] as const,
    lookAt: [0.5, 0.8, -0.5] as const,
  },
  /** 70% — orbit toward alarm clock on bedside table */
  alarm: {
    position: [2, 1.2, 0.5] as const,
    lookAt: [1.2, 0.8, -0.5] as const,
  },
  /** 100% — close-up on alarm, red glow fills frame */
  end: {
    position: [1.5, 1, 0.2] as const,
    lookAt: [1.2, 0.8, -0.5] as const,
  },
};

/** Position of the coffee mug on the bedside table */
export const MUG_POSITION = [1.5, 0.75, -0.3] as const;

/** Position of the alarm clock on the bedside table */
export const ALARM_POSITION = [1.2, 0.75, -0.5] as const;
