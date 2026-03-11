import * as THREE from "three";
import { DEFAULT_CAMERA, RENDERER_CONFIG } from "../constants/sceneConfig";
import { disposeObject } from "../utils/dispose";
import type { SceneModule } from "../types/scene";

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly clock: THREE.Clock;

  private animationId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private activeScene: SceneModule | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      DEFAULT_CAMERA.fov,
      1, // updated on mount
      DEFAULT_CAMERA.near,
      DEFAULT_CAMERA.far,
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: RENDERER_CONFIG.antialias,
      powerPreference: RENDERER_CONFIG.powerPreference,
    });

    this.renderer.shadowMap.enabled = RENDERER_CONFIG.shadowMapEnabled;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.clock = new THREE.Clock();
  }

  /** Mount renderer to a DOM container and start the render loop */
  mount(container: HTMLElement): void {
    this.container = container;
    container.appendChild(this.renderer.domElement);
    this.handleResize();

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.start();
  }

  /** Load a scene module — disposes previous scene first */
  loadScene(sceneModule: SceneModule): void {
    if (this.activeScene) {
      this.activeScene.dispose();
    }
    // Clear existing objects (except camera)
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      disposeObject(child);
      this.scene.remove(child);
    }

    this.activeScene = sceneModule;

    // Apply scene config
    const { config } = sceneModule;
    this.scene.background = new THREE.Color(config.colors.background);
    this.scene.fog = new THREE.Fog(config.fog.color, config.fog.near, config.fog.far);

    this.camera.fov = config.camera.fov;
    this.camera.position.set(...config.camera.position);
    this.camera.lookAt(...config.camera.lookAt);
    this.camera.updateProjectionMatrix();

    sceneModule.build(this.scene);
  }

  /** Called each frame — updates active scene and renders */
  private tick = (): void => {
    this.animationId = requestAnimationFrame(this.tick);

    const delta = this.clock.getDelta();
    if (this.activeScene?.update) {
      this.activeScene.update(0, delta); // scroll progress injected externally
    }

    this.renderer.render(this.scene, this.camera);
  };

  /** Update the active scene with scroll progress (called from ScrollController) */
  updateScroll(progress: number): void {
    const delta = this.clock.getDelta();
    if (this.activeScene?.update) {
      this.activeScene.update(progress, delta);
    }
  }

  private start(): void {
    if (this.animationId !== null) return;
    this.clock.start();
    this.tick();
  }

  private handleResize(): void {
    if (!this.container) return;
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /** Tear down everything — call on unmount */
  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.activeScene) {
      this.activeScene.dispose();
      this.activeScene = null;
    }

    // Clear scene graph
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      disposeObject(child);
      this.scene.remove(child);
    }

    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.container = null;
  }
}
