import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyImageGallery from "./PropertyImageGallery";
import { PropertiesServerService } from "@/lib/api/properties-server";
import { PropertyUtils } from "@/lib/api/properties-service";
import { Property } from "@prisma/client";
import InterestForm from "./InterestForm";
import { prisma } from "@/lib/db";

// Generate static params for ISR
export async function generateStaticParams() {
  try {
    const properties = await prisma.property.findMany({
      select: { id: true },
      take: 100, // Limit to first 100 for build time
    });

    return properties.flatMap((property) =>
      ['en', 'ar'].map((locale) => ({
        id: property.id,
        locale,
      }))
    );
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Revalidate every 5 minutes
export const revalidate = 300;

// ✅ Metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  try {
    const { id, locale } = params;
    const property = await PropertiesServerService.getById(id);
    if (!property) {
      return {
        title: "Property Not Found",
        description: "The requested property could not be found.",
      };
    }
    
    const title = PropertyUtils.getLocalizedTitle(property, locale);
    const description = PropertyUtils.getLocalizedDescription(property, locale);

    return {
      title: `${title} | Real Estate`,
      description,
      openGraph: {
        title,
        description,
        images: property.images?.slice(0, 1) || [],
      },
    };
  } catch {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }
}

// Function to clean and format HTML description
function formatDescription(html: string, isRTL: boolean): string {
  if (!html) return "";

  // Remove inline styles and classes
  let cleaned = html
    .replace(/ style="[^"]*"/g, "")
    .replace(/ class="[^"]*"/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<span[^>]*>/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<div[^>]*>/g, "")
    .replace(/<\/div>/g, "\n")
    .trim();

  // Convert bullet points to proper list items
  cleaned = cleaned.replace(/•\s*/g, "• ");

  return cleaned;
}

// Component to render formatted description
function DescriptionContent({
  description,
  isRTL,
}: {
  description: string | null;
  isRTL: boolean;
}) {
  if (!description) {
    return (
      <p className="text-gray-500 italic">
        {isRTL ? "لا يوجد وصف متاح." : "No description available."}
      </p>
    );
  }

  const formattedText = formatDescription(description, isRTL);

  return (
    <div
      className={`prose prose-sm max-w-none text-gray-700 leading-relaxed ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Render with proper line breaks */}
      {formattedText.split("\n").map((paragraph, index) => {
        if (!paragraph.trim()) return <br key={index} />;

        // Check if it's a bullet point
        if (paragraph.trim().startsWith("•")) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-gray-600 mt-1">•</span>
              <span>{paragraph.replace("•", "").trim()}</span>
            </div>
          );
        }

        // Check if it's a heading (contains specific keywords)
        const isHeading = /(موقع متميز|مميزات ومواصفات|تفاصيل الشقه|خلفية)/.test(
          paragraph
        );

        if (isHeading) {
          return (
            <h3
              key={index}
              className="font-semibold text-gray-900 mt-4 mb-2 text-lg"
            >
              {paragraph}
            </h3>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="mb-3">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}

// ✅ Page
export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = params;
  const isRTL = locale === "ar";

  let property: Property | null;
  try {
    property = await PropertiesServerService.getById(id);
    if (!property) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }

  // Type guard - property is guaranteed to be non-null here
  if (!property) {
    notFound();
  }

  const title = PropertyUtils.getLocalizedTitle(property, locale);
  const description = PropertyUtils.getLocalizedDescription(property, locale);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white px-4 py-8 my-16"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            asChild
            className="text-gray-700 hover:underline"
          >
            <Link href={`/${locale}/p`} className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              {isRTL ? "العودة" : "Back"}
            </Link>
          </Button>
        </div>

        {/* Title + City */}
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className={`size-4 ${isRTL ? "ml-1" : "mr-1"}`} />
            <span>
              {property.city}
              {property.district && `, ${property.district}`}
            </span>
          </div>
        </div>

        {/* Property Image Gallery */}
        <div className="overflow-hidden rounded-xl">
          <PropertyImageGallery
            images={property.images || []}
            title={title}
            isRTL={isRTL}
          />
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            {isRTL ? "الوصف" : "Description"}
          </h2>
          <DescriptionContent description={description} isRTL={isRTL} />
        </div>

        {/* Contact / Interest Form */}
        <div className="border-t pt-6">
          <InterestForm propertyTitle={title} propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
