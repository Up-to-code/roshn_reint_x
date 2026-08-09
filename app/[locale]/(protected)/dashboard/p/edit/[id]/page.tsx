import { notFound } from 'next/navigation';
import { propertyModule } from '@/lib/properties/property-module';
import EditPropertyForm from './EditPropertyForm';

export default async function EditPropertyPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const property = await propertyModule.getById(id);
  if (!property) notFound();

  return (
    <EditPropertyForm property={property} locale={locale} />
  );
}
