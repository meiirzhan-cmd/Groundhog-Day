import * as THREE from "three";
import { ROOM } from "../constants/sceneConfig";

/**
 * Scene 1 lighting rig — cold, claustrophobic motel room.
 * - Low ambient (desaturated blue)
 * - Key light from window (cold blue-gray, casts shadows)
 * - Accent point light (alarm clock red glow)
 */
export function createRoomLights(): THREE.Group {
  const group = new THREE.Group();
  group.name = "room-lights";

  // Ambient — cold but visible
  const ambient = new THREE.AmbientLight(0x6a6a8a, 0.8);
  ambient.name = "ambient";
  group.add(ambient);

  // Key light — simulates window on the right wall
  const keyLight = new THREE.DirectionalLight(0x8b9bbd, 2);
  keyLight.name = "key-window";
  keyLight.position.set(ROOM.width / 2 - 0.5, ROOM.height - 0.5, 0);
  keyLight.target.position.set(-1, 0.5, 0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = ROOM.width + 2;
  keyLight.shadow.camera.left = -ROOM.depth / 2;
  keyLight.shadow.camera.right = ROOM.depth / 2;
  keyLight.shadow.camera.top = ROOM.height;
  keyLight.shadow.camera.bottom = 0;
  keyLight.shadow.bias = -0.002;
  group.add(keyLight);
  group.add(keyLight.target);

  // Alarm clock accent — small red point light
  const alarmGlow = new THREE.PointLight(0xff3333, 0.6, 2.5, 2);
  alarmGlow.name = "alarm-glow";
  alarmGlow.position.set(1.2, 0.8, -0.3); // bedside table position
  alarmGlow.castShadow = false;
  group.add(alarmGlow);

  // Subtle fill from ceiling (simulates dim overhead bulb, off)
  const fillLight = new THREE.PointLight(0x3a3a5a, 0.15, ROOM.width * 2);
  fillLight.name = "fill-overhead";
  fillLight.position.set(0, ROOM.height - 0.1, 0);
  group.add(fillLight);

  return group;
}
