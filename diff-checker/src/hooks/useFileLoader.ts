import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

const TEXT_EXTENSIONS = [
  "txt", "md", "json", "ts", "tsx", "js", "jsx", "css", "scss", "html",
  "xml", "yaml", "yml", "toml", "ini", "cfg", "conf", "py", "rs", "go",
  "java", "kt", "swift", "c", "cpp", "h", "hpp", "cs", "php", "rb", "sh",
  "bat", "ps1", "sql", "csv", "log", "env",
];

export async function openAndReadFile(): Promise<{ path: string; content: string } | null> {
  const selected = await open({
    multiple: false,
    filters: [
      { name: "Text Files", extensions: TEXT_EXTENSIONS },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!selected) return null;

  const content = await invoke<string>("read_file", { path: selected });
  return { path: selected, content };
}

export async function readFilePath(path: string): Promise<string> {
  return await invoke<string>("read_file", { path });
}
