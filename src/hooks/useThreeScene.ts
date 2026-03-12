import { useEffect, useRef } from "react";
import { SceneManager } from "../core/SceneManager";
import { alarmScene, setCamera } from "../scenes/Scene1_Alarm";

/**
 * Manages SceneManager lifecycle — creates on mount, disposes on unmount.
 * Loads Scene 1 immediately on startup.
 * Returns a ref to attach to the container div and the SceneManager instance.
 */
export function useThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager();
    manager.mount(containerRef.current);
    managerRef.current = manager;

    // Load Scene 1 and give it access to the camera
    setCamera(manager.camera);
    manager.loadScene(alarmScene);

    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  return { containerRef, managerRef };
}
