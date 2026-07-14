import { getCloudflareContext } from "@opennextjs/cloudflare";

type ImageOptions = {
  width: number;
  height: number;
  quality: number;
  timeoutSeconds: number;
};

type ImageInfo = { width?: number; height?: number };
type ImagesResult = { response(): Response };
type ImagesTransformer = {
  transform(options: { width: number; height: number; fit: "scale-down" }): ImagesTransformer;
  output(options: { format: "image/jpeg"; quality: number; anim: false }): Promise<ImagesResult>;
};
type ImagesBinding = {
  info(stream: ReadableStream<Uint8Array>): Promise<ImageInfo>;
  input(stream: ReadableStream<Uint8Array>): ImagesTransformer;
};

function imageStream(source: ArrayBuffer) {
  return new Blob([source]).stream();
}

function getImagesBinding(): ImagesBinding | null {
  try {
    return (getCloudflareContext().env.IMAGES as ImagesBinding | undefined) ?? null;
  } catch {
    return null;
  }
}

async function processWithCloudflare(source: ArrayBuffer, options: ImageOptions, binding: ImagesBinding) {
  const info = await binding.info(imageStream(source));
  if (!info.width || !info.height || info.width * info.height > 40_000_000) {
    throw new Error("One of the uploaded files is not a readable image.");
  }
  const result = await binding
    .input(imageStream(source))
    .transform({ width: options.width, height: options.height, fit: "scale-down" })
    .output({ format: "image/jpeg", quality: options.quality, anim: false });
  const response = result.response();
  if (!response.ok) throw new Error("Cloudflare could not process one of the uploaded images.");
  return new Uint8Array(await response.arrayBuffer());
}

async function processWithSharp(source: ArrayBuffer, options: ImageOptions) {
  const { default: sharp } = await import("sharp");
  const image = sharp(Buffer.from(source), {
    limitInputPixels: 40_000_000,
    sequentialRead: true,
  }).timeout({ seconds: options.timeoutSeconds }).rotate();
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error("One of the uploaded files is not a readable image.");
  return new Uint8Array(await image
    .resize({ width: options.width, height: options.height, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: options.quality })
    .toBuffer());
}

export async function sanitizeImage(source: ArrayBuffer, options: ImageOptions) {
  const binding = getImagesBinding();
  return binding
    ? processWithCloudflare(source, options, binding)
    : processWithSharp(source, options);
}
