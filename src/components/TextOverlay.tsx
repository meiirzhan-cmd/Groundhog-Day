import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextBlock {
  text: string;
  className?: string;
}

interface SceneTextProps {
  sceneIndex: number;
  heading: string;
  subheading: string;
  blocks: TextBlock[];
}

export function SceneTextOverlay({
  sceneIndex,
  heading,
  subheading,
  blocks,
}: SceneTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Heading fades in first
      gsap.fromTo(
        el.querySelector(".scene-heading"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        },
      );

      // Subheading follows
      gsap.fromTo(
        el.querySelector(".scene-subheading"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "top 40%",
            scrub: 1,
          },
        },
      );

      // Text blocks stagger in
      gsap.fromTo(
        el.querySelectorAll(".scene-block"),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 50%",
            end: "top 15%",
            scrub: 1,
          },
        },
      );

      // Everything fades out at the bottom
      gsap.to(el.querySelectorAll(".scene-heading, .scene-subheading, .scene-block"), {
        opacity: 0,
        y: -20,
        scrollTrigger: {
          trigger: el,
          start: "bottom 60%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-24"
      style={{ marginTop: `${sceneIndex * 100}vh` }}
    >
      <h2 className="scene-heading text-sm uppercase tracking-[0.3em] text-white/40 mb-4 font-light">
        {heading}
      </h2>

      <p className="scene-subheading text-3xl md:text-5xl font-extralight text-white/90 text-center leading-tight max-w-3xl mb-16 italic">
        {subheading}
      </p>

      <div className="flex flex-col gap-8 max-w-2xl">
        {blocks.map((block, i) => (
          <p
            key={i}
            className={`scene-block text-lg md:text-xl font-light text-white/60 text-center leading-relaxed ${block.className ?? ""}`}
          >
            {block.text}
          </p>
        ))}
      </div>
    </div>
  );
}
