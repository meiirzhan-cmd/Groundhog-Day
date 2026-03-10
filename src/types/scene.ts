import type * as THREE from "three";

export interface SceneConfig {
  name: string;
  fog: {
    color: number;
    near: number;
    far: number;
  };
  camera: {
    position: THREE.Vector3Tuple;
    lookAt: THREE.Vector3Tuple;
    fov: number;
  };
  colors: {
    background: number;
    ambient: number;
    key: number;
    accent: number;
  };
}

export interface SceneModule {
  config: SceneConfig;
  build: (scene: THREE.Scene) => void;
  dispose: () => void;
  /** Called each frame with scroll progress 0→1 within this scene */
  update: (progress: number, delta: number) => void;
}

export interface ScrollSection {
  sceneId: string;
  /** Scroll start as fraction of total document height (0→1) */
  start: number;
  /** Scroll end as fraction of total document height (0→1) */
  end: number;
}
