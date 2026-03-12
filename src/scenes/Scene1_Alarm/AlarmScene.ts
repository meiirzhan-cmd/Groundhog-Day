import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { SceneModule } from "../../types/scene";
import { SCENE1_CONFIG, CAMERA_KEYFRAMES, MUG_POSITION, ALARM_POSITION } from "./config";
import { createRoom } from "../../objects/Room";
import { createCeilingCracks } from "../../objects/CeilingCracks";
import { createDustParticles, updateDustParticles } from "../../objects/DustParticles";
import { createSteamParticles, updateSteamParticles } from "../../objects/SteamParticles";
import { createRoomLights } from "../../lights/roomLights";
import { lerp } from "../../utils/math";

/** Refs to animated objects — needed for update() and dispose() */
let dustPoints: THREE.Points | null = null;
let steamPoints: THREE.Points | null = null;
let camera: THREE.PerspectiveCamera | null = null;

/**
 * Scene 1 — "The Alarm"
 * 6:00 AM. The same song. The same morning. Again.
 */
export const alarmScene: SceneModule = {
  config: SCENE1_CONFIG,

  build(scene: THREE.Scene) {
    // --- Room shell ---
    scene.add(createRoom());

    // --- Ceiling cracks ---
    scene.add(createCeilingCracks());

    // --- Lighting ---
    scene.add(createRoomLights());

    // --- Dust particles ---
    dustPoints = createDustParticles();
    scene.add(dustPoints);

    // --- Steam particles (positioned above mug) ---
    steamPoints = createSteamParticles();
    steamPoints.position.set(...MUG_POSITION);
    steamPoints.position.y += 0.1; // just above the rim
    scene.add(steamPoints);

    // --- Load GLB models ---
    const loader = new GLTFLoader();

    loader.load("/models/scene1/Alarm Clock.glb", (gltf) => {
      const model = gltf.scene;
      model.name = "alarm-clock";
      model.position.set(...ALARM_POSITION);
      model.scale.setScalar(0.5); // adjust based on your Blender export scale
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
    });

    loader.load("/models/scene1/Coffee Cup.glb", (gltf) => {
      const model = gltf.scene;
      model.name = "coffee-cup";
      model.position.set(...MUG_POSITION);
      model.scale.setScalar(0.5); // adjust based on your Blender export scale
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
    });
  },

  update(progress: number, delta: number) {
    // --- Animate particles ---
    if (dustPoints) updateDustParticles(dustPoints, delta);
    if (steamPoints) updateSteamParticles(steamPoints, delta);

    // --- Camera path driven by scroll progress ---
    if (!camera) return;

    const kf = CAMERA_KEYFRAMES;

    if (progress < 0.4) {
      // Start → Mid: ceiling to room reveal
      const t = progress / 0.4;
      lerpCamera(camera, kf.start, kf.mid, t);
    } else if (progress < 0.7) {
      // Mid → Alarm: orbit toward alarm clock
      const t = (progress - 0.4) / 0.3;
      lerpCamera(camera, kf.mid, kf.alarm, t);
    } else {
      // Alarm → End: pull back to wide shot
      const t = (progress - 0.7) / 0.3;
      lerpCamera(camera, kf.alarm, kf.end, t);
    }
  },

  dispose() {
    dustPoints = null;
    steamPoints = null;
    camera = null;
  },
};

/** Provide the camera reference from SceneManager */
export function setCamera(cam: THREE.PerspectiveCamera): void {
  camera = cam;
}

/** Interpolate camera position and lookAt between two keyframes */
function lerpCamera(
  cam: THREE.PerspectiveCamera,
  from: { position: readonly [number, number, number]; lookAt: readonly [number, number, number] },
  to: { position: readonly [number, number, number]; lookAt: readonly [number, number, number] },
  t: number,
): void {
  cam.position.set(
    lerp(from.position[0], to.position[0], t),
    lerp(from.position[1], to.position[1], t),
    lerp(from.position[2], to.position[2], t),
  );
  cam.lookAt(
    lerp(from.lookAt[0], to.lookAt[0], t),
    lerp(from.lookAt[1], to.lookAt[1], t),
    lerp(from.lookAt[2], to.lookAt[2], t),
  );
}
