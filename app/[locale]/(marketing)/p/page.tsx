// app/[locale]/properties/page.tsx
import { PropertiesServerService } from '@/lib/api/properties-server';
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
  
  let properties;
  
  try {
    if (searchParams.search) {
      properties = await PropertiesServerService.search(searchParams.search);
    
    } else if (searchParams.city) {
      properties = await PropertiesServerService.getByCity(searchParams.city);
    } else {
      properties = await PropertiesServerService.getAll();
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    properties = [];
  }

  return (
    <RealEstateListings 
    
       locale={locale} 
    />
  );
}