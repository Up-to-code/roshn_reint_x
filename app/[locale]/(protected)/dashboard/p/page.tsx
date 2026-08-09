import PropertiesClient from './PropertiesClient';
import { serializeProperty } from '@/lib/properties/property-core';
import { propertyModule } from '@/lib/properties/property-module';

export default async function PropertiesDashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const properties = (await propertyModule.list()).map(serializeProperty);

  return (
    <PropertiesClient initialProperties={properties} locale={locale} />
  );
}
