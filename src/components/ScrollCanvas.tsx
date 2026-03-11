import { useThreeScene } from "../hooks/useThreeScene";

/**
 * Full-viewport container for the Three.js renderer.
 * The SceneManager mounts its canvas into this div.
 */
export function ScrollCanvas() {
  const { containerRef } = useThreeScene();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen"
    />
  );
}
