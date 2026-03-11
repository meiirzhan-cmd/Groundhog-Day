import { useEffect, useRef } from "react";
import { SceneManager } from "../core/SceneManager";

/**
 * Manages SceneManager lifecycle — creates on mount, disposes on unmount.
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

    return () => {
      manager.dispose();
      managerRef.current = null;
    };
  }, []);

  return { containerRef, managerRef };
}
