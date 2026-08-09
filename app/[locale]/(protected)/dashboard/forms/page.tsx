import { contactDto } from "@/lib/inquiries/inquiry-core";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";
import ContactsClient from "./contacts-client";

export default async function ContactsPage() {
  const { items } = await inquiryModule.list({ kind: "CONTACT", pageSize: 100 });
  const initialContacts = items.map(item => {
    const contact = contactDto(item);
    return { ...contact, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() };
  });
  return <ContactsClient initialContacts={initialContacts} />;
}
