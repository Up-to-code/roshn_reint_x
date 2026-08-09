import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyImageGallery from "./PropertyImageGallery";
import {
  getLocalizedPropertyDescription,
  getLocalizedPropertyTitle,
  type PropertyRecord,
} from "@/lib/properties/property-core";
import { propertyModule } from "@/lib/properties/property-module";
import InterestForm from "./InterestForm";

// Generate static params for ISR
export async function generateStaticParams() {
  try {
    const propertyIds = await propertyModule.listIds(100);

    return propertyIds.flatMap((id) =>
      ['en', 'ar'].map((locale) => ({
        id,
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
    const property = await propertyModule.getById(id);
    if (!property) {
      return {
        title: "Property Not Found",
        description: "The requested property could not be found.",
      };
    }
    
    const title = getLocalizedPropertyTitle(property, locale);
    const description = getLocalizedPropertyDescription(property, locale);

    return {
      title: `${title} | Real Estate`,
      description: description ?? undefined,
      openGraph: {
        title,
        description: description ?? undefined,
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

  return (
    <div
      className={`prose prose-sm max-w-none text-gray-700 leading-relaxed ${
        isRTL ? "text-right prose-headings:text-right" : "text-left prose-headings:text-left"
      } prose-p:my-3 prose-headings:my-4 prose-headings:font-semibold prose-strong:text-gray-900 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80`}
      dir={isRTL ? "rtl" : "ltr"}
      dangerouslySetInnerHTML={{ __html: description }}
    />
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

  let property: PropertyRecord | null;
  try {
    property = await propertyModule.getById(id);
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

  const title = getLocalizedPropertyTitle(property, locale);
  const description = getLocalizedPropertyDescription(property, locale);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen px-4 py-8 my-16"
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
            <MapPin className={`size-4 text-red-500 ${isRTL ? "ml-1" : "mr-1"}`} />
            <span>
              {property.city}
              {property.district && `, ${property.district}`}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat(locale, { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(property.price || 0)}
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

        {/* Contact / Interest Form */}
        <div className="border-t pt-6">
          <InterestForm propertyTitle={title} propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
