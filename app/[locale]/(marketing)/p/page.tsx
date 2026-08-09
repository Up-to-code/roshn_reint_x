// app/[locale]/properties/page.tsx
import { propertyModule } from '@/lib/properties/property-module';
import RealEstateListings from './properties-listing';

interface PropertiesPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    type?: string;
    city?: string;
    search?: string;
  };
}

export default async function PropertiesPage({ params, searchParams }: PropertiesPageProps) {
  const { locale } = params;
  
  try {
    const properties = await propertyModule.list({
      query: searchParams.search,
      city: searchParams.search ? undefined : searchParams.city,
    });
    return <RealEstateListings locale={locale} initialProperties={properties} />;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return <RealEstateListings locale={locale} initialProperties={[]} />;
  }
}
