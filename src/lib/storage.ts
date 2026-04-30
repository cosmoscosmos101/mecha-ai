import { put, del } from "@vercel/blob";

export interface StoredFile {
  url: string;
  filename: string;
  size: number;
}

export async function saveFile(
  filename: string,
  data: Buffer,
): Promise<StoredFile> {
  const { url } = await put(filename, data, {
    access: "public",
    addRandomSuffix: false,
  });
  return { url, filename, size: data.byteLength };
}

export async function deleteFile(urlOrKey: string): Promise<void> {
  await del(urlOrKey);
}
