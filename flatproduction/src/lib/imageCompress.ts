/* Downscales + re-encodes an image client-side before it ever hits the
 * network. This is the single biggest lever for "upload feels slow" —
 * a phone photo is routinely 3-8MB; nothing on this site is ever displayed
 * larger than ~1600px wide, so shipping the original full-resolution file
 * just makes the upload (and every later page load of that image) slower
 * for no visual benefit. Falls back to the original file untouched if
 * anything goes wrong, or if it's already small enough / not a raster
 * format canvas can safely re-encode (SVG, GIF — GIF animation would be
 * destroyed by a canvas round-trip). */

const MAX_DIMENSION = 1920;
const JPEG_PNG_QUALITY = 0.82;
const SKIP_IF_UNDER_BYTES = 300 * 1024;
const SKIP_TYPES = new Set(['image/svg+xml', 'image/gif']);

export async function compressImage(file: File): Promise<File> {
  if (SKIP_TYPES.has(file.type) || file.size <= SKIP_IF_UNDER_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    // No point re-encoding if it wouldn't actually shrink the pixel count.
    if (scale === 1 && file.size <= SKIP_IF_UNDER_BYTES * 4) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) { bitmap.close(); return file; }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob: Blob | null = await new Promise(resolve =>
      canvas.toBlob(resolve, outType, JPEG_PNG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const ext = outType === 'image/png' ? 'png' : 'jpg';
    const newName = file.name.replace(/\.[^.]+$/, '') + `.${ext}`;
    return new File([blob], newName, { type: outType });
  } catch {
    // Any failure (unsupported format, browser quirk) — ship the original.
    return file;
  }
}
