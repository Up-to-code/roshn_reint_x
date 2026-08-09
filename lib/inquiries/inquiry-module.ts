import { Prisma, InquiryKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mailtrap } from "@/lib/email";
import { eventModule } from "@/lib/events/event-module";
import {
  contactInputSchema,
  contactUpdateSchema,
  landingLeadInputSchema,
  propertyInterestInputSchema,
  type ContactInput,
  type ContactUpdate,
  type LandingLeadInput,
  type PropertyInterestInput,
} from "./inquiry-core";

const propertySelection = { id: true, titleEn: true, titleAr: true } as const;

type ListOptions = {
  kind?: InquiryKind;
  search?: string;
  read?: boolean;
  page?: number;
  pageSize?: number;
};

function whereFor({ kind, search, read }: ListOptions): Prisma.InquiryWhereInput {
  return {
    kind,
    read,
    ...(search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { propertyTitle: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    } : {}),
  };
}

async function resolveProperty(propertyId: string | null, suppliedTitle: string | null) {
  if (!propertyId) return { propertyId: null, propertyTitle: suppliedTitle || "General Inquiry" };
  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: propertySelection });
  if (!property) return { propertyId: null, propertyTitle: suppliedTitle || "General Inquiry" };
  return { propertyId: property.id, propertyTitle: suppliedTitle || property.titleEn || property.titleAr };
}

async function recordEffects(inquiry: { id: string; kind: InquiryKind; name: string; phone: string; email: string | null; message: string | null; propertyTitle: string; propertyId: string | null; source: string | null; reason: string | null }, os?: string) {
  const label = inquiry.kind === "CONTACT" ? "Contact submission" : inquiry.kind === "LANDING_LEAD" ? "Landing lead" : "Property interest";
  await Promise.allSettled([
    eventModule.record({
      type: inquiry.kind === "CONTACT" ? "contact_submission" : inquiry.kind === "LANDING_LEAD" ? "landing_lead" : "property_interest",
      title: `${label}: ${inquiry.name}`,
      description: inquiry.reason || inquiry.message || `New ${label.toLowerCase()}`,
      metadata: { inquiryId: inquiry.id, name: inquiry.name, phone: inquiry.phone, email: inquiry.email, propertyId: inquiry.propertyId, propertyTitle: inquiry.propertyTitle, source: inquiry.source },
    }),
    mailtrap.send({
      from: { email: process.env.NOTIFICATION_FROM_EMAIL || "mailtrap@demomailtrap.com", name: "Roshn Inquiry Notification" },
      to: [{ email: process.env.ADMIN_NOTIFICATION_EMAIL || "roshnreitsaudi@gmail.com" }],
      subject: `${label}: ${inquiry.propertyTitle}`,
      text: [`${label} received`, `Name: ${inquiry.name}`, `Phone: ${inquiry.phone}`, `Email: ${inquiry.email || "N/A"}`, `Property/source: ${inquiry.source || inquiry.propertyTitle}`, `OS: ${os || "Unknown"}`, `Message: ${inquiry.message || "N/A"}`].join("\n"),
      category: "New Inquiry",
    }),
  ]);
}

export const inquiryModule = {
  async list(options: ListOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const pageSize = Math.min(100, Math.max(1, options.pageSize || 20));
    const where = whereFor(options);
    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({ where, include: { property: { select: propertySelection } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.inquiry.count({ where }),
    ]);
    return { items, total, page, pageSize };
  },

  async counts(kind?: InquiryKind) {
    const base = kind ? { kind } : {};
    const [all, unread, read] = await Promise.all([
      prisma.inquiry.count({ where: base }),
      prisma.inquiry.count({ where: { ...base, read: false } }),
      prisma.inquiry.count({ where: { ...base, read: true } }),
    ]);
    return { all, unread, read };
  },

  async createContact(input: ContactInput, os?: string) {
    const data = contactInputSchema.parse(input);
    const property = await resolveProperty(data.propertyId, data.propertyTitle);
    const inquiry = await prisma.inquiry.create({ data: { kind: "CONTACT", name: data.name, phone: data.phone, email: data.email, message: data.message, reason: data.reason, source: "contact-form", ...property } });
    await recordEffects(inquiry, os);
    return inquiry;
  },

  async createPropertyInterest(input: PropertyInterestInput, os?: string) {
    const data = propertyInterestInputSchema.parse(input);
    const property = await resolveProperty(data.propertyId, data.propertyTitle);
    const inquiry = await prisma.inquiry.create({ data: { kind: "PROPERTY_INTEREST", name: data.name, phone: data.phone, email: data.email, message: data.message, ...property }, include: { property: { select: propertySelection } } });
    await recordEffects(inquiry, os);
    return inquiry;
  },

  async createLandingLead(input: LandingLeadInput, os?: string) {
    const data = landingLeadInputSchema.parse(input);
    const inquiry = await prisma.inquiry.create({ data: { kind: "LANDING_LEAD", name: `${data.firstName} ${data.lastName}`, phone: data.phone, source: data.source, propertyTitle: data.source, message: "Lead from landing page" } });
    await recordEffects(inquiry, os);
    return inquiry;
  },

  async updateContact(id: string, input: ContactUpdate) {
    const data = contactUpdateSchema.parse(input);
    return prisma.inquiry.update({ where: { id, kind: "CONTACT" }, data: { name: data.name, phone: data.phone, email: data.email, message: data.message } });
  },

  async markRead(id: string, read: boolean) {
    const updated = await prisma.inquiry.updateMany({ where: { id, kind: "PROPERTY_INTEREST" }, data: { read } });
    return updated.count ? prisma.inquiry.findUnique({ where: { id } }) : null;
  },

  async delete(id: string, kind?: InquiryKind) {
    const deleted = await prisma.inquiry.deleteMany({ where: { id, kind } });
    return deleted.count > 0;
  },
};
