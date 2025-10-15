import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: Request) => {
  // هنا لازم تحط التحقق الحقيقي (JWT, Clerk, NextAuth ...)
  return { id: "fakeId" };
};

export const ourFileRouter = {
  // Image uploader
  imageUploader: f({
    image: {
      maxFileSize: "512MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url); // ✅ استخدم file.url
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),

  // Video uploader
  videoUploader: f({
    video: {
      maxFileSize: "512MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete for userId:", metadata.userId);
      console.log("video file url", file.url); // ✅ استخدم file.url
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
