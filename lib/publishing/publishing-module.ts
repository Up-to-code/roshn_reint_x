import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { postInputSchema, serializePost, toEditorPost, type PostInput } from "./publishing-core";

const PUBLISHING_CACHE_TAG = "posts";

const publicPosts = unstable_cache(
  () => prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } }),
  ["published-posts"],
  { revalidate: 60, tags: [PUBLISHING_CACHE_TAG] },
);

async function invalidate() {
  revalidateTag(PUBLISHING_CACHE_TAG);
}

export const publishingModule = {
  async listPublic(limit?: number) {
    const posts = await publicPosts();
    return posts.slice(0, limit ? Math.max(0, limit) : posts.length).map(toEditorPost);
  },

  async listEditor() {
    return (await prisma.post.findMany({ orderBy: { updatedAt: "desc" } })).map(toEditorPost);
  },

  async getPublic(id: string) {
    const post = await prisma.post.findFirst({ where: { id, status: "PUBLISHED" } });
    return post ? toEditorPost(post) : null;
  },

  async getEditor(id: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    return post ? toEditorPost(post) : null;
  },

  async relatedPublic(id: string, limit = 3) {
    return (await prisma.post.findMany({ where: { status: "PUBLISHED", id: { not: id } }, take: limit, orderBy: { createdAt: "desc" } })).map(toEditorPost);
  },

  async publicIds() {
    return prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { id: true } });
  },

  async create(input: PostInput) {
    const data = postInputSchema.parse(input);
    const post = await prisma.post.create({ data: { title: data.title!, content: data.content!, excerpt: data.excerpt, status: data.status, headerImage: data.headerImage, thumbnail: data.thumbnail } });
    await invalidate();
    return post;
  },

  async update(id: string, input: PostInput) {
    const data = postInputSchema.parse(input);
    const exists = await prisma.post.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const post = await prisma.post.update({ where: { id }, data: { title: data.title!, content: data.content!, excerpt: data.excerpt, status: data.status, headerImage: data.headerImage, thumbnail: data.thumbnail } });
    await invalidate();
    return post;
  },

  async duplicate(id: string) {
    const original = await prisma.post.findUnique({ where: { id } });
    if (!original) return null;
    const post = await prisma.post.create({ data: { title: `${original.title} (Copy)`, content: original.content, excerpt: original.excerpt, status: "DRAFT", headerImage: original.headerImage, thumbnail: original.thumbnail } });
    await invalidate();
    return post;
  },

  async delete(id: string) {
    const deleted = await prisma.post.deleteMany({ where: { id } });
    if (!deleted.count) return false;
    await invalidate();
    return true;
  },

  serialize: serializePost,
};
