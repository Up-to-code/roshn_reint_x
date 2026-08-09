import { inquiryModule } from "@/lib/inquiries/inquiry-module";
import { LeadsTable } from "@/components/admin/leads-table";
import { LeadsPagination } from "@/components/admin/leads-pagination";

const ITEMS_PER_PAGE = 20;

interface LeadsPageProps {
  searchParams: Promise<{ page?: string }> | { page?: string };
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10));
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const { items: rawLeads, total: totalCount } = await inquiryModule.list({ kind: "LANDING_LEAD", page: currentPage, pageSize: ITEMS_PER_PAGE });

  // Serialize dates to strings to avoid hydration mismatches and serialization warnings
  const leads = rawLeads.map(lead => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = skip + 1;
  const endIndex = Math.min(skip + ITEMS_PER_PAGE, totalCount);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        {totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {totalCount}
          </div>
        )}
      </div>
      
      <LeadsTable leads={leads} />
      
      <LeadsPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
