import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { SceneModule } from "../../types/scene";
import {
  SCENE1_CONFIG,
  CAMERA_KEYFRAMES,
  MUG_POSITION,
  ALARM_POSITION,
  BED_POSITION,
  BEDSIDE_POSITION,
  WINDOW_POSITION,
} from "./config";
import { createRoom } from "../../objects/Room";
import { createCeilingCracks } from "../../objects/CeilingCracks";
import { createDustParticles, updateDustParticles } from "../../objects/DustParticles";
import { createSteamParticles, updateSteamParticles } from "../../objects/SteamParticles";
import { createRoomLights } from "../../lights/roomLights";
import { createLightShaft, updateLightShaft } from "../../objects/LightShaft";
import { createClockLED, updateClockLED } from "../../objects/ClockLED";
import { lerp } from "../../utils/math";

/** Refs to animated objects — needed for update() and dispose() */
let dustPoints: THREE.Points | null = null;
let steamPoints: THREE.Points | null = null;
let lightShaftGroup: THREE.Group | null = null;
let clockLEDMesh: THREE.Mesh | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let elapsedTime = 0;

/** Helper: load GLB, log its raw size, apply scale + position */
function loadModel(
  loader: GLTFLoader,
  scene: THREE.Scene,
  path: string,
  name: string,
  position: readonly [number, number, number],
  scale: number,
  onLoaded?: (model: THREE.Group) => void,
) {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.name = name;

    // Debug: log raw bounding box size before scaling
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    console.log(`[${name}] raw size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);

    model.scale.setScalar(scale);
    model.position.set(...position);
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    onLoaded?.(model);
    scene.add(model);
  });
}

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

    // --- Debug helpers (remove after positioning is done) ---
    scene.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222));
    scene.add(new THREE.AxesHelper(3));

    // --- Dust particles ---
    dustPoints = createDustParticles();
    scene.add(dustPoints);

    // --- Steam particles (positioned above mug) ---
    steamPoints = createSteamParticles();
    steamPoints.position.set(...MUG_POSITION);
    steamPoints.position.y += 0.1;
    scene.add(steamPoints);

    // --- Light shaft from window ---
    lightShaftGroup = createLightShaft();
    scene.add(lightShaftGroup);

    // --- Clock LED display ---
    clockLEDMesh = createClockLED();

    // --- Load GLB models ---
    const loader = new GLTFLoader();

    loadModel(loader, scene, "/models/scene1/Alarm Clock.glb", "alarm-clock", ALARM_POSITION, 0.15, (model) => {
      if (clockLEDMesh) {
        clockLEDMesh.position.set(0, 0.08, 0.06);
        model.add(clockLEDMesh);
      }
    });

    loadModel(loader, scene, "/models/scene1/Coffee Cup.glb", "coffee-cup", MUG_POSITION, 0.15);
    loadModel(loader, scene, "/models/scene1/Bed.glb", "bed", BED_POSITION, 0.15);
    loadModel(loader, scene, "/models/scene1/Bedside.glb", "bedside-table", BEDSIDE_POSITION, 0.15);
    loadModel(loader, scene, "/models/scene1/Windown.glb", "window-frame", WINDOW_POSITION, 0.15, (model) => {
      model.rotation.y = -Math.PI / 2;
    });
  },

  update(progress: number, delta: number) {
    elapsedTime += delta;

    if (dustPoints) updateDustParticles(dustPoints, delta);
    if (steamPoints) updateSteamParticles(steamPoints, delta);
    if (lightShaftGroup) updateLightShaft(lightShaftGroup, elapsedTime);
    if (clockLEDMesh) updateClockLED(clockLEDMesh, elapsedTime);

    if (!camera) return;

    const kf = CAMERA_KEYFRAMES;

    if (progress < 0.4) {
      const t = progress / 0.4;
      lerpCamera(camera, kf.start, kf.mid, t);
    } else if (progress < 0.7) {
      const t = (progress - 0.4) / 0.3;
      lerpCamera(camera, kf.mid, kf.alarm, t);
    } else {
      const t = (progress - 0.7) / 0.3;
      lerpCamera(camera, kf.alarm, kf.end, t);
    }
  },

  dispose() {
    dustPoints = null;
    steamPoints = null;
    lightShaftGroup = null;
    clockLEDMesh = null;
    camera = null;
    elapsedTime = 0;
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
