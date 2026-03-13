interface ToolbarProps {
  mode: "file" | "text";
  onModeChange: (mode: "file" | "text") => void;
  onClear: () => void;
  diffCount: number | null;
  onNavPrev: () => void;
  onNavNext: () => void;
}

export default function Toolbar({
  mode,
  onModeChange,
  onClear,
  diffCount,
  onNavPrev,
  onNavNext,
}: ToolbarProps) {
  const hasContent = diffCount !== null;
  const hasDiffs = hasContent && diffCount > 0;

  const countLabel = !hasContent
    ? "—"
    : diffCount === 0
    ? "일치"
    : `${diffCount}개`;

  return (
    <div className="toolbar">
      <span className="toolbar-title">Diff Checker</span>

      <div className="toolbar-controls">
        {/* 차이 탐색 — 모드 토글 왼쪽 */}
        <div className="diff-nav">
          <button
            className="nav-btn"
            onClick={onNavPrev}
            disabled={!hasDiffs}
            title="이전 차이 (Shift+F7)"
          >
            ▲
          </button>
          <button
            className="nav-btn"
            onClick={onNavNext}
            disabled={!hasDiffs}
            title="다음 차이 (F7)"
          >
            ▼
          </button>
          <span className={`diff-count ${hasDiffs ? "has-diffs" : ""}`}>
            {countLabel}
          </span>
        </div>

        <div className="toolbar-divider" />

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
