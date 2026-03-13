import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Panel from "./components/Panel";
import DiffViewer from "./components/DiffViewer";
import "./styles.css";

function App() {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [leftPath, setLeftPath] = useState("");
  const [rightPath, setRightPath] = useState("");
  const [leftContent, setLeftContent] = useState("");
  const [rightContent, setRightContent] = useState("");

  const handleModeChange = (newMode: "file" | "text") => {
    setMode(newMode);
  };

  const handleClear = () => {
    setLeftPath("");
    setRightPath("");
    setLeftContent("");
    setRightContent("");
  };

  const handleLeftLoad = (path: string, content: string) => {
    setLeftPath(path);
    setLeftContent(content);
  };

  const handleRightLoad = (path: string, content: string) => {
    setRightPath(path);
    setRightContent(content);
  };

  return (
    <div className="app">
      <Toolbar mode={mode} onModeChange={handleModeChange} onClear={handleClear} />

      <div className="panels">
        <Panel
          side="left"
          label="원본 (Original)"
          filePath={leftPath}
          onLoad={handleLeftLoad}
          textMode={mode === "text"}
        />
        <Panel
          side="right"
          label="수정본 (Modified)"
          filePath={rightPath}
          onLoad={handleRightLoad}
          textMode={mode === "text"}
        />
      </div>

      <div className="editor-container">
        <DiffViewer
          original={leftContent}
          modified={rightContent}
          textMode={mode === "text"}
          onOriginalChange={setLeftContent}
          onModifiedChange={setRightContent}
        />
      </div>
    </div>
  );
}

export default App;
