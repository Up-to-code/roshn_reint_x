import Link from "next/link";

import { getDashboardOverview } from "@/lib/dashboard/dashboard-overview";
import { StatsCard } from "./components/dashboard/stats-card";
import { DataTable } from "./components/dashboard/data-table";

const copy = {
  en: {
    title: "Dashboard", users: "Users", properties: "Properties", posts: "Posts", contacts: "Contacts",
    totalUsers: "Total Users", registeredUsers: "Registered users in system", listedProperties: "Listed properties",
    publishedArticles: "Published articles", customerInquiries: "Customer inquiries",
  },
  ar: {
    title: "لوحة التحكم", users: "المستخدمين", properties: "العقارات", posts: "المقالات", contacts: "جهات الاتصال",
    totalUsers: "إجمالي المستخدمين", registeredUsers: "المستخدمين المسجلين في النظام", listedProperties: "العقارات المدرجة",
    publishedArticles: "المقالات المنشورة", customerInquiries: "استفسارات العملاء",
  },
} as const;

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale: requestedLocale } = params instanceof Promise ? await params : params;
  const locale = requestedLocale === "ar" ? "ar" : "en";
  const t = copy[locale];
  const data = await getDashboardOverview();

  return (
    <div className="container mx-auto space-y-8 p-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <div className="flex gap-2">
          {(["en", "ar"] as const).map(language => (
            <Link key={language} href={`/${language}/dashboard`} className={`rounded px-4 py-2 ${locale === language ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>
              {language.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title={t.totalUsers} value={data.users.length} description={t.registeredUsers} />
        <StatsCard title={t.properties} value={data.properties.length} description={t.listedProperties} />
        <StatsCard title={t.posts} value={data.posts.length} description={t.publishedArticles} />
        <StatsCard title={t.contacts} value={data.contacts.length} description={t.customerInquiries} />
      </div>

      <div className="space-y-8">
        <DataTable data={data.users} columns={["id", "name", "email", "role", "createdAt"]} title={t.users} />
        <DataTable data={data.properties} columns={["id", "titleEn", "titleAr", "price", "city", "createdAt"]} title={t.properties} />
        <DataTable data={data.posts} columns={["id", "title", "status", "createdAt"]} title={t.posts} />
        <DataTable data={data.contacts} columns={["id", "name", "phone", "createdAt"]} title={t.contacts} />
      </div>
    </div>
  );
}
