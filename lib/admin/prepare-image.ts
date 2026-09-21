/**
 * Shrinks large photos in the browser before upload: phone cameras produce
 * 5-12 MB files that exceed the upload limit and load slowly for readers.
 * GIFs, PDFs and anything already small are passed through untouched.
 */
export async function prepareImage(
  file: File,
  { maxEdge = 2200, quality = 0.86 } = {},
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const alreadySmall = scale === 1 && file.size <= 1.5 * 1024 * 1024;
    if (alreadySmall) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
      type: "image/webp",
    });
  } catch {
    return file;
  }
}

export function validateImageFile(file: File, allowPdf = false) {
  const okType =
    file.type.startsWith("image/") ||
    (allowPdf && file.type === "application/pdf");
  if (!okType) return "That file isn't an image.";
  return null;
}
