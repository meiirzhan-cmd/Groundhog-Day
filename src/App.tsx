import { ScrollCanvas } from "./components/ScrollCanvas";
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
        {/* Scene text overlays will go here */}
      </div>
    </>
  );
}

export default App;
