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

  const handleClear = () => {
    setLeftPath("");
    setRightPath("");
    setLeftContent("");
    setRightContent("");
  };

  return (
    <div
      className="app"
      onContextMenu={(e) => {
        // Monaco 에디터 영역 외에서의 우클릭 컨텍스트 메뉴 차단
        const target = e.target as HTMLElement;
        if (!target.closest(".monaco-editor")) {
          e.preventDefault();
        }
      }}
    >
      <Toolbar mode={mode} onModeChange={setMode} onClear={handleClear} />

      <div className="panels">
        <Panel
          side="left"
          label="Left"
          filePath={leftPath}
          onLoad={(path, content) => { setLeftPath(path); setLeftContent(content); }}
          textMode={mode === "text"}
        />
        <Panel
          side="right"
          label="Right"
          filePath={rightPath}
          onLoad={(path, content) => { setRightPath(path); setRightContent(content); }}
          textMode={mode === "text"}
        />
      </div>

      <div className="editor-container">
        <DiffViewer
          original={leftContent}
          modified={rightContent}
          onOriginalChange={setLeftContent}
          onModifiedChange={setRightContent}
        />
      </div>
    </div>
  );
}

export default App;
