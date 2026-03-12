import * as THREE from "three";

const STEAM_COUNT = 60;

/** Height the steam rises before fading and resetting */
const RISE_HEIGHT = 0.6;

/**
 * Creates a small steam/vapor particle system that rises from a point (coffee mug).
 * Position the returned Points object at the mug's opening.
 */
export function createSteamParticles(): THREE.Points {
  const positions = new Float32Array(STEAM_COUNT * 3);
  const velocities = new Float32Array(STEAM_COUNT * 3);
  const lifetimes = new Float32Array(STEAM_COUNT);

  for (let i = 0; i < STEAM_COUNT; i++) {
    resetSteamParticle(positions, velocities, lifetimes, i);
    // Stagger initial lifetimes so they don't all spawn at once
    lifetimes[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Store velocities and lifetimes as userData for animation
  geometry.userData = { velocities, lifetimes };

  const material = new THREE.PointsMaterial({
    color: 0xccccdd,
    size: 0.025,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.name = "steam-particles";

  return points;
}

function resetSteamParticle(
  positions: Float32Array,
  velocities: Float32Array,
  lifetimes: Float32Array,
  index: number,
): void {
  const i3 = index * 3;

  // Start at origin (will be offset by parent position)
  positions[i3] = (Math.random() - 0.5) * 0.03; // tiny spread
  positions[i3 + 1] = 0;
  positions[i3 + 2] = (Math.random() - 0.5) * 0.03;

  // Mostly upward, slight drift
  velocities[i3] = (Math.random() - 0.5) * 0.02;
  velocities[i3 + 1] = 0.05 + Math.random() * 0.03; // upward
  velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

  lifetimes[index] = 0;
}

/**
 * Animate steam — call each frame.
 * Particles rise, spread outward, and reset when they reach max height.
 */
export function updateSteamParticles(
  points: THREE.Points,
  delta: number,
): void {
  const posAttr = points.geometry.attributes.position;
  const positions = posAttr.array as Float32Array;
  const { velocities, lifetimes } = points.geometry.userData as {
    velocities: Float32Array;
    lifetimes: Float32Array;
  };

  for (let i = 0; i < STEAM_COUNT; i++) {
    const i3 = i * 3;
    lifetimes[i] += delta;

    // Move particle
    positions[i3] += velocities[i3] * delta;
    positions[i3 + 1] += velocities[i3 + 1] * delta;
    positions[i3 + 2] += velocities[i3 + 2] * delta;

    // Spread outward as it rises
    velocities[i3] += (Math.random() - 0.5) * 0.005;
    velocities[i3 + 2] += (Math.random() - 0.5) * 0.005;

    // Reset when too high
    if (positions[i3 + 1] > RISE_HEIGHT) {
      resetSteamParticle(positions, velocities, lifetimes, i);
    }
  }

  posAttr.needsUpdate = true;
}
