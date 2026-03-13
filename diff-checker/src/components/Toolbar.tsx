interface ToolbarProps {
  mode: "file" | "text";
  onModeChange: (mode: "file" | "text") => void;
  onClear: () => void;
}

export default function Toolbar({ mode, onModeChange, onClear }: ToolbarProps) {
  return (
    <div className="toolbar">
      <span className="toolbar-title">Diff Checker</span>

      <div className="toolbar-controls">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "file" ? "active" : ""}`}
            onClick={() => onModeChange("file")}
          >
            파일 비교
          </button>
          <button
            className={`mode-btn ${mode === "text" ? "active" : ""}`}
            onClick={() => onModeChange("text")}
          >
            텍스트 입력
          </button>
        </div>

        <button className="btn-clear" onClick={onClear} title="초기화">
          초기화
        </button>
      </div>
    </div>
  );
}
