import { useRef, useState } from "react";
import type * as MonacoType from "monaco-editor";
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
  const [diffCount, setDiffCount] = useState<number | null>(null);

  const diffEditorRef = useRef<MonacoType.editor.IStandaloneDiffEditor | null>(null);

  const handleEditorMount = (editor: MonacoType.editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;
    editor.onDidUpdateDiff(() => {
      setDiffCount(editor.getLineChanges()?.length ?? 0);
    });
  };

  const handleClear = () => {
    setLeftPath("");
    setRightPath("");
    setLeftContent("");
    setRightContent("");
    setDiffCount(null);
  };

  const navPrev = () => (diffEditorRef.current as any)?.goToDiff("previous");
  const navNext = () => (diffEditorRef.current as any)?.goToDiff("next");

  return (
    <div
      className="app"
      onContextMenu={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".monaco-editor")) {
          e.preventDefault();
        }
      }}
    >
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onClear={handleClear}
        diffCount={diffCount}
        onNavPrev={navPrev}
        onNavNext={navNext}
      />

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
          onEditorMount={handleEditorMount}
        />
      </div>
    </div>
  );
}

export default App;
