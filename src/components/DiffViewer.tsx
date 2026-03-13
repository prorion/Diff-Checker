import { useEffect, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";

interface DiffViewerProps {
  original: string;
  modified: string;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
  onEditorMount?: (editor: MonacoType.editor.IStandaloneDiffEditor) => void;
}

export default function DiffViewer({
  original,
  modified,
  onOriginalChange,
  onModifiedChange,
  onEditorMount,
}: DiffViewerProps) {
  const editorRef = useRef<MonacoType.editor.IStandaloneDiffEditor | null>(null);

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
      onMount={(editor) => {
        editorRef.current = editor;
        onEditorMount?.(editor);

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
