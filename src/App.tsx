import { ScrollCanvas } from "./components/ScrollCanvas";
import { SceneTextOverlay } from "./components/TextOverlay";
import { TOTAL_SCENES } from "./constants/sceneConfig";

function App() {
  return (
    <>
      {/* Three.js canvas — fixed behind everything */}
      <ScrollCanvas />

      {/* Scroll spacer — drives scroll distance for all scenes */}
      <div
        className="relative z-10 pointer-events-none"
        style={{ height: `${TOTAL_SCENES * 100}vh` }}
      >
        {/* Scene 1 — The Alarm */}
        <SceneTextOverlay
          sceneIndex={0}
          heading="Scene I"
          subheading="6:00 AM. The same song. The same morning. Again."
          blocks={[
            {
              text: "He opens his eyes to a world he\u2019s already memorized.",
            },
            {
              text: "Every crack in the ceiling. Every note of that terrible song.",
              className: "text-white/40",
            },
            {
              text: "The coffee is always the same temperature. The strangers say the same words.",
            },
            {
              text: "Nothing changes. Nothing moves forward.",
              className: "text-white/30 italic",
            },
          ]}
        />
      </div>
    </>
  );
}

export default App;
