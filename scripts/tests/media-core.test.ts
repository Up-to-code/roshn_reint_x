import { describe, expect, test } from "bun:test";
import { bucketForKind, mediaKind, safeObjectName, validateMedia } from "../../lib/media-storage/media-core";

describe("Media Storage core", () => {
  test("routes MIME types to canonical buckets", () => {
    expect(mediaKind({ type: "image/webp" })).toBe("image");
    expect(mediaKind({ type: "video/mp4" })).toBe("video");
    expect(bucketForKind("file")).toBe("FILES");
  });

  test("enforces MIME and size policy before provider calls", () => {
    expect(() => validateMedia({ name: "x.exe", type: "application/octet-stream", size: 10 }, "IMAGES")).toThrow("Unsupported");
    expect(() => validateMedia({ name: "x.mp4", type: "video/mp4", size: 101 * 1024 * 1024 }, "VIDEOS")).toThrow("100MB");
  });

  test("generates partitioned non-user-controlled object paths", () => {
    expect(safeObjectName("unsafe name.MP4", "fixed-id")).toMatch(/^\d{4}-\d{2}-\d{2}\/fixed-id\.mp4$/);
  });
});
