import { z } from "zod";

export const defaultAboutData = {
  hero: {
    title: "من نحن",
    subtitle: "روشن ريت شركة عقارية سعودية تقدم فرصاً وخدمات متكاملة للعملاء والمستثمرين.",
    image: "/jeddah-skyline.png",
  },
  vision: { title: "الرؤية", description: "تقديم خدمات عقارية متميزة من خلال الابتكار والاستدامة والشفافية." },
  mission: { title: "الرسالة", description: "توفير فرص استثمارية وسكنية تحقق قيمة مستدامة وتجربة موثوقة لعملائنا." },
  goals: [
    "تقديم خدمة متكاملة من اختيار العقار إلى ما بعد البيع",
    "تسهيل البحث والمقارنة والشراء والتملك",
    "توفير خيارات عقارية متنوعة تلائم احتياجات العملاء",
  ],
  tagline: "فرص عقارية مدروسة وتجربة أفضل لعملائنا.",
} as const;

export const aboutDataSchema = z.object({
  hero: z.object({ title: z.string().trim().min(1).max(160), subtitle: z.string().trim().min(1).max(3000), image: z.string().trim().max(2048) }).strict(),
  vision: z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(2000) }).strict(),
  mission: z.object({ title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(2000) }).strict(),
  goals: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
  tagline: z.string().trim().min(1).max(1000),
}).strict();

export type AboutData = z.infer<typeof aboutDataSchema>;

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function normalizeAboutData(raw: unknown): AboutData {
  const input = record(raw);
  const hero = record(input.hero);
  const vision = record(input.vision);
  const mission = record(input.mission);
  return aboutDataSchema.parse({
    hero: { ...defaultAboutData.hero, ...hero },
    vision: { ...defaultAboutData.vision, ...vision },
    mission: { ...defaultAboutData.mission, ...mission },
    goals: Array.isArray(input.goals) && input.goals.length ? input.goals : defaultAboutData.goals,
    tagline: input.tagline || defaultAboutData.tagline,
  });
}
