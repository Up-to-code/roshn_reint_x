import { describe, expect, test } from "bun:test";
import { parseEditorPost, postInputSchema, publishingStats, serializePost } from "../../lib/publishing/publishing-core";

describe("Publishing core", () => {
  test("normalizes editor input and canonical status", () => {
    expect(postInputSchema.parse({ title: "  News ", content: " <p>Hello</p> ", status: "published", excerpt: "" }))
      .toMatchObject({ title: "News", content: "<p>Hello</p>", status: "PUBLISHED", excerpt: null, headerImage: null, thumbnail: null });
  });

  test("rejects unknown fields and invalid statuses", () => {
    expect(postInputSchema.safeParse({ title: "Post", content: "Body", status: "public" }).success).toBe(false);
    expect(postInputSchema.safeParse({ title: "Post", content: "Body", authorRole: "ADMIN" }).success).toBe(false);
  });

  test("serializes status and dates once at the transport edge", () => {
    expect(serializePost({ id: "1", status: "DRAFT", createdAt: new Date("2026-01-01Z"), updatedAt: new Date("2026-01-02Z") }))
      .toEqual({ id: "1", status: "draft", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-02T00:00:00.000Z" });
  });

  test("derives accurate editor stats without phantom words", () => {
    expect(publishingStats([
      { status: "published", content: "<p>Two words</p>" },
      { status: "draft", content: "" },
    ])).toEqual({ totalPosts: 2, publishedPosts: 1, draftPosts: 1, totalWords: 2 });
  });

  test("validates and hydrates editor transport responses", () => {
    const post = parseEditorPost({
      id: "post-1",
      title: "Title",
      content: "<p>Body</p>",
      excerpt: null,
      status: "draft",
      headerImage: null,
      thumbnail: null,
      createdAt: "2026-08-09T12:00:00.000Z",
      updatedAt: "2026-08-09T12:00:00.000Z",
    });

    expect(post.createdAt).toBeInstanceOf(Date);
    expect(() => parseEditorPost({ id: "post-1", status: "invalid" })).toThrow();
  });
});
