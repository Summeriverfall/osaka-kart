import { fileSiteRoot, isFileProtocol } from "@/lib/file-href";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (isFileProtocol()) {
    return `${fileSiteRoot()}${path.replace(/^\//, "")}`;
  }
  return `${BASE_PATH}${path}`;
}
