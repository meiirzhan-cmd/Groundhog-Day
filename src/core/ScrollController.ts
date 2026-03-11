import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneManager } from "./SceneManager";
import type { ScrollSection } from "../types/scene";
import { TOTAL_SCENES } from "../constants/sceneConfig";

gsap.registerPlugin(ScrollTrigger);

export class ScrollController {
  private sceneManager: SceneManager;
  private triggers: ScrollTrigger[] = [];
  private timeline: gsap.core.Timeline | null = null;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  /**
   * Create a master timeline pinned to the scroll container.
   * Each scene gets an equal portion of the scroll distance.
   * @param scrollContainer - the element with overflow scroll (or body)
   * @param pinnedElement - the element to pin (the canvas wrapper)
   */
  init(scrollContainer: HTMLElement, pinnedElement: HTMLElement): void {
    this.dispose();

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        pin: pinnedElement,
        scrub: 1, // smooth 1-second lag
        start: "top top",
        end: `+=${window.innerHeight * TOTAL_SCENES}`,
        onUpdate: (self) => {
          this.sceneManager.updateScroll(self.progress);
        },
      },
    });

    if (this.timeline.scrollTrigger) {
      this.triggers.push(this.timeline.scrollTrigger);
    }
  }

  /**
   * Create individual ScrollTriggers for each scene section.
   * Use this when scenes need independent enter/leave callbacks.
   */
  createSections(
    sections: ScrollSection[],
    onEnter: (sceneId: string, progress: number) => void,
  ): void {
    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        start: `${section.start * 100}%`,
        end: `${section.end * 100}%`,
        onUpdate: (self) => onEnter(section.sceneId, self.progress),
      });
      this.triggers.push(trigger);
    });
  }

  /** Get normalized scroll progress 0→1 */
  getProgress(): number {
    return this.timeline?.scrollTrigger?.progress ?? 0;
  }

  /** Clean up all scroll triggers */
  dispose(): void {
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
    this.timeline?.kill();
    this.timeline = null;
  }
}
