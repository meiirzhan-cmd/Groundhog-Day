import * as THREE from "three";

/**
 * Creates a dynamic "6:00" LED display using CanvasTexture.
 * Returns a small plane mesh with the glowing red digits.
 *
 * The texture is rendered once on creation. Call `updateClockLED()`
 * to animate the colon blinking.
 */
export function createClockLED(): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;

  const ctx = canvas.getContext("2d")!;
  drawClockFace(ctx, canvas.width, canvas.height, true);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });

  // Small plane — sized to fit the alarm clock's display area
  const geometry = new THREE.PlaneGeometry(0.12, 0.06);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "clock-led";

  return mesh;
}

/**
 * Animate the colon blink (on/off every 0.5s).
 * Call each frame with elapsed time.
 */
export function updateClockLED(mesh: THREE.Mesh, time: number): void {
  const material = mesh.material as THREE.MeshBasicMaterial;
  if (!material.map) return;

  const texture = material.map as THREE.CanvasTexture;
  const canvas = texture.image as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const colonVisible = Math.floor(time * 2) % 2 === 0;
  drawClockFace(ctx, canvas.width, canvas.height, colonVisible);
  texture.needsUpdate = true;
}

/** Render the "6:00" digits onto the canvas */
function drawClockFace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colonVisible: boolean,
): void {
  // Black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // Red LED glow
  ctx.fillStyle = "#ff2222";
  ctx.shadowColor = "#ff3333";
  ctx.shadowBlur = 12;

  // Digital clock font
  ctx.font = "bold 72px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const timeStr = colonVisible ? "6:00" : "6 00";
  ctx.fillText(timeStr, w / 2, h / 2);

  // Reset shadow
  ctx.shadowBlur = 0;

  // Subtle "AM" indicator
  ctx.fillStyle = "#cc1111";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "right";
  ctx.fillText("AM", w - 16, h - 20);
}
