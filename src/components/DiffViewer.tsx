import { DiffEditor } from "@monaco-editor/react";

interface DiffViewerProps {
  original: string;
  modified: string;
  textMode: boolean;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
}

export default function DiffViewer({
  original,
  modified,
  textMode,
  onOriginalChange,
  onModifiedChange,
}: DiffViewerProps) {
  return (
    <DiffEditor
      height="100%"
      language="plaintext"
      original={original}
      modified={modified}
      onMount={(editor) => {
        const originalModel = editor.getOriginalEditor();
        const modifiedModel = editor.getModifiedEditor();

        originalModel.onDidChangeModelContent(() => {
          onOriginalChange?.(originalModel.getValue());
        });
        modifiedModel.onDidChangeModelContent(() => {
          onModifiedChange?.(modifiedModel.getValue());
        });
      }}
      options={{
        renderSideBySide: true,
        originalEditable: true,
        readOnly: false,
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
