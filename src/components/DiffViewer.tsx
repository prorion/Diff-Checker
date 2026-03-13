import { useEffect, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";

interface DiffViewerProps {
  original: string;
  modified: string;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
}

export default function DiffViewer({
  original,
  modified,
  onOriginalChange,
  onModifiedChange,
}: DiffViewerProps) {
  const editorRef = useRef<MonacoType.editor.IStandaloneDiffEditor | null>(null);

  // 외부에서 콘텐츠가 변경될 때만 (파일 로드 등) 모델을 업데이트
  // 현재 모델 값과 다를 때만 setValue → 사용자 타이핑 중에는 no-op
  useEffect(() => {
    const model = editorRef.current?.getOriginalEditor().getModel();
    if (model && model.getValue() !== original) {
      model.setValue(original);
    }
  }, [original]);

  useEffect(() => {
    const model = editorRef.current?.getModifiedEditor().getModel();
    if (model && model.getValue() !== modified) {
      model.setValue(modified);
    }
  }, [modified]);

  return (
    <DiffEditor
      height="100%"
      language="plaintext"
      // controlled prop 대신 ref로 관리 — prop을 동적으로 넘기면 setValue가 매번 호출되어
      // 커서 리셋 + undo 히스토리 삭제 발생
      onMount={(editor) => {
        editorRef.current = editor;

        editor.getOriginalEditor().onDidChangeModelContent(() => {
          onOriginalChange?.(editor.getOriginalEditor().getValue());
        });
        editor.getModifiedEditor().onDidChangeModelContent(() => {
          onModifiedChange?.(editor.getModifiedEditor().getValue());
        });
      }}
      options={{
        renderSideBySide: true,
        originalEditable: true,
        readOnly: false,
        renderMarginRevertIcon: false,
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        renderWhitespace: "boundary",
        diffWordWrap: "on",
      }}
      theme="vs-dark"
    />
  );
}
