import * as THREE from "three";
import { ROOM } from "../constants/sceneConfig";

const PARTICLE_COUNT = 400;

/**
 * Creates floating dust motes inside the room.
 * Uses BufferGeometry point cloud with a soft bokeh sprite texture.
 *
 * Call `updateDustParticles(points, delta)` each frame to animate drift.
 */
export function createDustParticles(): THREE.Points {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const opacities = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Scatter within room bounds (with slight padding)
    positions[i3] = (Math.random() - 0.5) * (ROOM.width - 0.5);
    positions[i3 + 1] = Math.random() * ROOM.height;
    positions[i3 + 2] = (Math.random() - 0.5) * (ROOM.depth - 0.5);

    sizes[i] = 0.02 + Math.random() * 0.04;
    opacities[i] = 0.2 + Math.random() * 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));

  const material = new THREE.PointsMaterial({
    color: 0x8888aa,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // If you have a dust texture: map: new THREE.TextureLoader().load("/textures/dust-particle.png"),
  });

  const points = new THREE.Points(geometry, material);
  points.name = "dust-particles";

  return points;
}

/**
 * Animate dust motes — slow upward drift with subtle horizontal wobble.
 * Call this every frame in the scene's update() method.
 */
export function updateDustParticles(points: THREE.Points, delta: number): void {
  const positions = points.geometry.attributes.position;
  const array = positions.array as Float32Array;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Slow upward drift
    array[i3 + 1] += delta * (0.02 + Math.sin(i * 0.1) * 0.01);

    // Subtle horizontal wobble
    array[i3] += Math.sin(Date.now() * 0.0003 + i) * delta * 0.01;
    array[i3 + 2] += Math.cos(Date.now() * 0.0004 + i * 0.7) * delta * 0.008;

    // Reset to bottom when particle reaches ceiling
    if (array[i3 + 1] > ROOM.height) {
      array[i3 + 1] = 0;
      array[i3] = (Math.random() - 0.5) * (ROOM.width - 0.5);
      array[i3 + 2] = (Math.random() - 0.5) * (ROOM.depth - 0.5);
    }
  }

  positions.needsUpdate = true;
}
