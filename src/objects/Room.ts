import * as THREE from "three";
import { ROOM } from "../constants/sceneConfig";

const { width, height, depth } = ROOM;

/**
 * Creates the motel room shell: 4 walls + floor + ceiling.
 * All meshes receive shadows. Walls/ceiling use a cold desaturated palette.
 */
export function createRoom(): THREE.Group {
  const group = new THREE.Group();
  group.name = "room";

  // --- Materials ---
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a4a,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.FrontSide,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a35,
    roughness: 0.95,
    metalness: 0.0,
    side: THREE.FrontSide,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x4a4a55,
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.FrontSide,
  });

  // --- Geometries ---
  const wallGeoSide = new THREE.PlaneGeometry(depth, height);
  const wallGeoFrontBack = new THREE.PlaneGeometry(width, height);
  const floorGeo = new THREE.PlaneGeometry(width, depth);

  // --- Floor ---
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  floor.name = "floor";
  group.add(floor);

  // --- Ceiling ---
  const ceiling = new THREE.Mesh(floorGeo.clone(), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  ceiling.receiveShadow = true;
  ceiling.name = "ceiling";
  group.add(ceiling);

  // --- Back wall (facing camera) ---
  const backWall = new THREE.Mesh(wallGeoFrontBack, wallMat);
  backWall.position.set(0, height / 2, -depth / 2);
  backWall.receiveShadow = true;
  backWall.name = "wall-back";
  group.add(backWall);

  // --- Front wall (behind camera, optional — usually not visible) ---
  const frontWall = new THREE.Mesh(wallGeoFrontBack.clone(), wallMat);
  frontWall.position.set(0, height / 2, depth / 2);
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  frontWall.name = "wall-front";
  group.add(frontWall);

  // --- Left wall ---
  const leftWall = new THREE.Mesh(wallGeoSide, wallMat);
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  leftWall.name = "wall-left";
  group.add(leftWall);

  // --- Right wall (window wall) ---
  const rightWall = new THREE.Mesh(wallGeoSide.clone(), wallMat);
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  rightWall.name = "wall-right";
  group.add(rightWall);

  // Center the room so camera looks into it naturally
  group.position.set(0, 0, 0);

  return group;
}
