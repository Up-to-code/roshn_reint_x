import { z } from "zod";

const postStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type PublishingStatus = (typeof postStatuses)[number];

const nullableUrl = z.union([z.string().trim().url(), z.literal(""), z.null(), z.undefined()])
  .transform(value => value || null);

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required"),
  excerpt: z.string().trim().max(500).optional().transform(value => value || null),
  status: z.string().trim().toUpperCase().pipe(z.enum(postStatuses)).default("DRAFT"),
  headerImage: nullableUrl,
  thumbnail: nullableUrl,
}).strict();

export type PostInput = z.input<typeof postInputSchema>;

const editorPostTransportSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  headerImage: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const parseEditorPost = (input: unknown) => editorPostTransportSchema.parse(input);

export function toEditorPost<T extends { status: PublishingStatus }>(post: T): Omit<T, "status"> & { status: Lowercase<PublishingStatus> } {
  return { ...post, status: post.status.toLowerCase() as Lowercase<PublishingStatus> };
}

export function serializePost<T extends { status: PublishingStatus; createdAt: Date; updatedAt: Date }>(post: T): Omit<T, "status" | "createdAt" | "updatedAt"> & { status: Lowercase<PublishingStatus>; createdAt: string; updatedAt: string } {
  const { status, createdAt, updatedAt, ...rest } = post;
  return { ...rest, status: status.toLowerCase() as Lowercase<PublishingStatus>, createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString() };
}

export function publishingStats(posts: Array<{ status: Lowercase<PublishingStatus>; content: string }>) {
  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter(post => post.status === "published").length,
    draftPosts: posts.filter(post => post.status === "draft").length,
    totalWords: posts.reduce((total, post) => total + post.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length, 0),
  };
}
