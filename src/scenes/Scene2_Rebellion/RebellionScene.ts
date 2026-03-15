import * as THREE from "three";
import type { SceneModule } from "../../types/scene";
import { SCENE2_CONFIG, CAMERA_KEYFRAMES_2, DEBRIS_POSITIONS, BURST_CENTER } from "./config";
import { createRoom } from "../../objects/Room";
import { createDustParticles, updateDustParticles } from "../../objects/DustParticles";
import { lerp } from "../../utils/math";

let camera: THREE.PerspectiveCamera | null = null;
let dustPoints: THREE.Points | null = null;
let chaosParticles: THREE.Points | null = null;
let debrisGroup: THREE.Group | null = null;
let elapsedTime = 0;

/** Create a burst of fast-moving orange particles — chaos energy */
function createChaosParticles(): THREE.Points {
  const count = 800;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Start spread across the room
    positions[i3]     = (Math.random() - 0.5) * 5;
    positions[i3 + 1] = Math.random() * 2.5;
    positions[i3 + 2] = (Math.random() - 0.5) * 7;

    // Velocity — fast, outward from center
    velocities[i3]     = (Math.random() - 0.5) * 0.04;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xff6600,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geo, mat);
}

/** Animate chaos particles — fast drift, wrap around room bounds */
function updateChaosParticles(points: THREE.Points, delta: number): void {
  const pos = points.geometry.attributes["position"] as THREE.BufferAttribute;
  const vel = points.geometry.attributes["velocity"] as THREE.BufferAttribute;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos.array[i3]     += (vel.array[i3]     as number) * delta * 60;
    pos.array[i3 + 1] += (vel.array[i3 + 1] as number) * delta * 60;
    pos.array[i3 + 2] += (vel.array[i3 + 2] as number) * delta * 60;

    // Wrap within room bounds
    const px = pos.array[i3] as number;
    const py = pos.array[i3 + 1] as number;
    const pz = pos.array[i3 + 2] as number;

    if (px > 3 || px < -3)   pos.array[i3]     = -px * 0.9;
    if (py > 2.8 || py < 0)  pos.array[i3 + 1] = Math.abs(py) % 2.8;
    if (pz > 4 || pz < -4)   pos.array[i3 + 2] = -pz * 0.9;
  }

  pos.needsUpdate = true;
}

/** Scattered debris on floor — overturned bottles, clothes, etc. */
function createDebris(): THREE.Group {
  const group = new THREE.Group();
  const shapes = [
    new THREE.CylinderGeometry(0.04, 0.06, 0.25, 8),  // bottle
    new THREE.BoxGeometry(0.2, 0.02, 0.15),             // flat item
    new THREE.SphereGeometry(0.06, 6, 6),               // round object
  ];
  const mat = new THREE.MeshStandardMaterial({
    color: 0x3a3a4a,
    roughness: 0.9,
    metalness: 0.1,
  });

  DEBRIS_POSITIONS.forEach((pos, i) => {
    const geo = shapes[i % shapes.length];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(
      (Math.random() - 0.5) * 0.8,
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * 0.8,
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  // Dispose shared geometries
  shapes.forEach((s) => s.dispose());

  return group;
}

/** Scene 2 lighting — harsher, more purple, shadows deeper */
function createRebellionLights(): THREE.Group {
  const group = new THREE.Group();

  // Very dim ambient — oppressive
  const ambient = new THREE.AmbientLight(0x1a0d2e, 0.4);
  group.add(ambient);

  // Harsh overhead — bare bulb feel
  const overhead = new THREE.PointLight(0x8855aa, 3.5, 8);
  overhead.position.set(0, 2.7, -1);
  overhead.castShadow = true;
  overhead.shadow.mapSize.set(512, 512);
  group.add(overhead);

  // Orange accent from ground — like spilled light
  const groundGlow = new THREE.PointLight(0xff6600, 1.5, 3);
  groundGlow.position.set(BURST_CENTER[0], 0.1, BURST_CENTER[2]);
  group.add(groundGlow);

  // Cold window light — world outside doesn't care
  const windowLight = new THREE.DirectionalLight(0x4455aa, 0.6);
  windowLight.position.set(3, 2, -1);
  windowLight.target.position.set(0, 0, 0);
  group.add(windowLight);
  group.add(windowLight.target);

  return group;
}

export const rebellionScene: SceneModule = {
  config: SCENE2_CONFIG,

  build(scene: THREE.Scene) {
    // Room shell — same geometry, different mood
    scene.add(createRoom());

    // Lighting
    scene.add(createRebellionLights());

    // Chaos particles — fast orange burst
    chaosParticles = createChaosParticles();
    scene.add(chaosParticles);

    // Background dust — still there, faster
    dustPoints = createDustParticles();
    scene.add(dustPoints);

    // Debris on the floor
    debrisGroup = createDebris();
    scene.add(debrisGroup);
  },

  update(progress: number, delta: number) {
    elapsedTime += delta;

    if (dustPoints) updateDustParticles(dustPoints, delta);
    if (chaosParticles) updateChaosParticles(chaosParticles, delta);

    // Pulse the orange ground glow
    if (debrisGroup) {
      debrisGroup.children.forEach((child, i) => {
        child.rotation.y += Math.sin(elapsedTime * 0.5 + i) * 0.001;
      });
    }

    if (!camera) return;

    const kf = CAMERA_KEYFRAMES_2;
    if (progress < 0.3) {
      const t = progress / 0.3;
      lerpCamera(camera, kf.start, kf.rush, t);
    } else if (progress < 0.6) {
      const t = (progress - 0.3) / 0.3;
      lerpCamera(camera, kf.rush, kf.chaos, t);
    } else {
      const t = (progress - 0.6) / 0.4;
      lerpCamera(camera, kf.chaos, kf.end, t);
    }
  },

  dispose() {
    camera = null;
    dustPoints = null;
    chaosParticles = null;
    debrisGroup = null;
    elapsedTime = 0;
  },
};

export function setCamera2(cam: THREE.PerspectiveCamera): void {
  camera = cam;
}

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
