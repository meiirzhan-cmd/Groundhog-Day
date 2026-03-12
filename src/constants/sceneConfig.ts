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
