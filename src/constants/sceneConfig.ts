import type { SceneConfig } from "../types/scene";

/** Total number of scenes (7 + epilogue) */
export const TOTAL_SCENES = 8;

/** Default camera settings */
export const DEFAULT_CAMERA = {
  fov: 50,
  near: 0.1,
  far: 100,
} as const;

/** Renderer settings */
export const RENDERER_CONFIG = {
  antialias: true,
  powerPreference: "high-performance" as const,
  shadowMapEnabled: true,
};

/** Room dimensions in world units (Scene 1 motel room) */
export const ROOM = {
  width: 6,
  height: 3,
  depth: 8,
} as const;

/** Scene 1 — The Alarm */
export const SCENE1_CONFIG: SceneConfig = {
  name: "The Alarm",
  fog: {
    color: 0x2d2d3f,
    near: 2,
    far: 15,
  },
  camera: {
    position: [0, 2.8, 0], // top-down, looking at ceiling
    lookAt: [0, 0, 0],
    fov: 50,
  },
  colors: {
    background: 0x1a1a2e,
    ambient: 0x4a4a6a,
    key: 0x6b7b8d,
    accent: 0xff3333,
  },
};
