import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Creates a GSAP context scoped to a container element.
 * All GSAP animations inside will be cleaned up on unmount.
 */
export function useGSAPContext(scope: React.RefObject<HTMLElement | null>) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!scope.current) return;

    ctxRef.current = gsap.context(() => {
      // Animations added inside this context are auto-cleaned
    }, scope.current);

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [scope]);

  return ctxRef;
}
