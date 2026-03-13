import { useEffect, useRef, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { openAndReadFile, readFilePath } from "../hooks/useFileLoader";

interface PanelProps {
  side: "left" | "right";
  label: string;
  filePath: string;
  onLoad: (path: string, content: string) => void;
  textMode: boolean;
}

export default function Panel({ side, label, filePath, onLoad, textMode }: PanelProps) {
  const [dragging, setDragging] = useState(false);
  const unlistenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (textMode) return;

    const win = getCurrentWebviewWindow();
    let cleanup: (() => void) | null = null;

    win.onDragDropEvent((event) => {
      const payload = event.payload as { type: string; paths?: string[]; position?: { x: number; y: number } };

      if (payload.type === "over") {
        setDragging(true);
      } else if (payload.type === "drop" && payload.paths && payload.paths.length > 0) {
        setDragging(false);
        const droppedPath = payload.paths[0];

        // Determine which panel the drop is on by checking x position
        if (payload.position) {
          const midX = window.innerWidth / 2;
          const isLeft = payload.position.x < midX;
          if ((side === "left" && isLeft) || (side === "right" && !isLeft)) {
            readFilePath(droppedPath).then((content) => onLoad(droppedPath, content));
          }
        }
      } else if (payload.type === "cancel" || payload.type === "leave") {
        setDragging(false);
      }
    }).then((unlisten) => {
      cleanup = unlisten;
      unlistenRef.current = unlisten;
    });

    return () => {
      cleanup?.();
    };
  }, [side, onLoad, textMode]);

  const handleOpenFile = async () => {
    const result = await openAndReadFile();
    if (result) {
      onLoad(result.path, result.content);
    }
  };

  const shortPath = filePath
    ? filePath.replace(/\\/g, "/").split("/").slice(-2).join("/")
    : "";

  return (
    <div className={`panel-header ${dragging ? "panel-dragging" : ""}`}>
      <span className="panel-label">{label}</span>
      {!textMode && (
        <>
          <button className="btn-open" onClick={handleOpenFile}>
            파일 열기
          </button>
          {filePath ? (
            <span className="panel-filepath" title={filePath}>
              {shortPath}
            </span>
          ) : (
            <span className="panel-hint">파일을 열거나 여기에 드롭하세요</span>
          )}
        </>
      )}
    </div>
  );
}
