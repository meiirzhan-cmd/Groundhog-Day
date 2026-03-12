import * as THREE from "three";
import { ROOM } from "../constants/sceneConfig";

/**
 * Creates a ceiling overlay plane with procedurally generated crack-like normal map.
 * Positioned just below the actual ceiling so it layers on top.
 *
 * If you have a real normal map texture, replace the procedural canvas
 * with: new THREE.TextureLoader().load("/textures/ceiling-cracks-normal.png")
 */
export function createCeilingCracks(): THREE.Mesh {
  const normalMap = generateCrackNormalMap();

  const geo = new THREE.PlaneGeometry(ROOM.width, ROOM.depth);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x4a4a55, // match ceiling color
    roughness: 0.9,
    metalness: 0.0,
    normalMap,
    normalScale: new THREE.Vector2(1.5, 1.5),
    transparent: true,
    opacity: 0.8,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "ceiling-cracks";
  mesh.rotation.x = Math.PI / 2; // face downward
  mesh.position.y = ROOM.height - 0.01; // just below ceiling
  mesh.receiveShadow = true;

  return mesh;
}

/**
 * Procedural crack normal map using Canvas2D.
 * Draws random branching lines to simulate plaster cracks.
 */
function generateCrackNormalMap(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base normal color (flat surface = rgb(128, 128, 255))
  ctx.fillStyle = "rgb(128, 128, 255)";
  ctx.fillRect(0, 0, size, size);

  // Draw cracks as dark lines (which create indent in normal map)
  ctx.strokeStyle = "rgb(100, 100, 200)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  const crackCount = 5 + Math.floor(Math.random() * 4);

  for (let i = 0; i < crackCount; i++) {
    drawCrack(ctx, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}

/** Draw a single branching crack line */
function drawCrack(ctx: CanvasRenderingContext2D, size: number): void {
  // Start from a random edge or interior point
  let x = Math.random() * size;
  let y = Math.random() * size;
  const angle = Math.random() * Math.PI * 2;
  const segments = 8 + Math.floor(Math.random() * 12);

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let s = 0; s < segments; s++) {
    const len = 10 + Math.random() * 30;
    const deviation = (Math.random() - 0.5) * 0.8;
    x += Math.cos(angle + deviation) * len;
    y += Math.sin(angle + deviation) * len;
    ctx.lineTo(x, y);

    // Occasional branch
    if (Math.random() < 0.3) {
      const branchLen = 5 + Math.random() * 15;
      const branchAngle = angle + (Math.random() - 0.5) * 1.5;
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(branchAngle) * branchLen,
        y + Math.sin(branchAngle) * branchLen,
      );
      ctx.moveTo(x, y);
    }
  }

  ctx.stroke();
}
