import * as THREE from "three";
import { ROOM } from "../constants/sceneConfig";

/**
 * Creates a volumetric light shaft coming through the window on the right wall.
 * Uses a tapered ConeGeometry with additive blending for a soft god-ray look.
 */
export function createLightShaft(): THREE.Group {
  const group = new THREE.Group();
  group.name = "light-shaft";

  // Window position on the right wall
  const windowX = ROOM.width / 2;
  const windowY = ROOM.height * 0.65;
  const windowZ = 0;

  // --- Main shaft: cone projecting inward from window ---
  const shaftLength = ROOM.width * 0.8;
  const shaftGeo = new THREE.ConeGeometry(1.8, shaftLength, 32, 1, true);

  const shaftMat = new THREE.MeshBasicMaterial({
    color: 0x7a8faa,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.name = "shaft-main";

  // Rotate so cone points from right wall toward left
  shaft.rotation.z = Math.PI / 2;
  // Tilt downward slightly — light falls toward the floor
  shaft.rotation.x = Math.PI * 0.08;
  shaft.position.set(windowX - shaftLength / 2, windowY - 0.3, windowZ);

  group.add(shaft);

  // --- Secondary, wider soft glow for ambient scatter ---
  const glowGeo = new THREE.ConeGeometry(2.5, shaftLength * 0.7, 32, 1, true);

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x6a7f9a,
    transparent: true,
    opacity: 0.03,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.name = "shaft-glow";
  glow.rotation.z = Math.PI / 2;
  glow.rotation.x = Math.PI * 0.05;
  glow.position.set(windowX - shaftLength * 0.35, windowY - 0.5, windowZ);

  group.add(glow);

  // --- Window bright spot: small plane on the right wall ---
  const spotGeo = new THREE.PlaneGeometry(0.9, 1.2);
  const spotMat = new THREE.MeshBasicMaterial({
    color: 0xaabbcc,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const spot = new THREE.Mesh(spotGeo, spotMat);
  spot.name = "window-spot";
  spot.rotation.y = -Math.PI / 2;
  spot.position.set(windowX - 0.01, windowY, windowZ);

  group.add(spot);

  return group;
}

/**
 * Animate the light shaft — subtle pulsing to simulate clouds passing.
 * Call this each frame.
 */
export function updateLightShaft(group: THREE.Group, time: number): void {
  const shaft = group.getObjectByName("shaft-main") as THREE.Mesh | undefined;
  const glow = group.getObjectByName("shaft-glow") as THREE.Mesh | undefined;

  if (shaft) {
    const mat = shaft.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.06 + Math.sin(time * 0.3) * 0.015;
  }

  if (glow) {
    const mat = glow.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.03 + Math.sin(time * 0.2 + 1) * 0.008;
  }
}
