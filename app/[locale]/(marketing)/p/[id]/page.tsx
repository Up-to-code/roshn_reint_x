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

// ✅ Metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  try {
    const { id, locale } = params;
    const property = await PropertiesServerService.getById(id);
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

// ✅ Page
export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = params;
  const isRTL = locale === "ar";

  let property: Property;
  try {
    property = await PropertiesServerService.getById(id);
  } catch {
    notFound();
  }

  const title = PropertyUtils.getLocalizedTitle(property, locale);
  const description = PropertyUtils.getLocalizedDescription(property, locale);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Back Button */}
        <div>
          <Button variant="ghost" asChild className="text-gray-700 hover:underline">
            <Link href={`/${locale}/p`} className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              {locale === "ar" ? "العودة" : "Back"}
            </Link>
          </Button>
        </div>

        {/* Title + City */}
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className={`size-4 ${isRTL ? "ml-1" : "mr-1"}`} />
            <span>
              {property.city}, {property.district}
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
        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            {locale === "ar" ? "الوصف" : "Description"}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {description ||
              (locale === "ar"
                ? "لا يوجد وصف متاح."
                : "No description available.")}
          </p>
        </div>

        {/* Contact / Interest Form */}
        <div className="border-t pt-6">
          <InterestForm propertyTitle={title} />
        </div>
      </div>
    </div>
  );
}
