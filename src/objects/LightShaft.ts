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
  const windowY = ROOM.height * 0.6;
  const windowZ = -1;

  // --- Main shaft: narrow cone projecting inward from window ---
  const shaftLength = 3;
  const shaftGeo = new THREE.ConeGeometry(0.8, shaftLength, 16, 1, true);

  const shaftMat = new THREE.MeshBasicMaterial({
    color: 0x7a8faa,
    transparent: true,
    opacity: 0.035,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const shaft = new THREE.Mesh(shaftGeo, shaftMat);
  shaft.name = "shaft-main";

  // Rotate so cone points from right wall toward left
  shaft.rotation.z = Math.PI / 2;
  // Tilt downward — light falls toward the floor
  shaft.rotation.x = Math.PI * 0.12;
  shaft.position.set(windowX - shaftLength / 2, windowY - 0.3, windowZ);

  group.add(shaft);

  // --- Window bright spot: small plane on the right wall ---
  const spotGeo = new THREE.PlaneGeometry(0.6, 0.8);
  const spotMat = new THREE.MeshBasicMaterial({
    color: 0xaabbcc,
    transparent: true,
    opacity: 0.1,
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

  if (shaft) {
    const mat = shaft.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.035 + Math.sin(time * 0.3) * 0.01;
  }
}
