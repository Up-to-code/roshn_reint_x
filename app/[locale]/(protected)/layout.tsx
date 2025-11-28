import { redirect } from "next/navigation";
 
import { sidebarLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
 import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
 import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { MobileSheetSidebar } from "@/components/layout/MobileSheetSidebar";
 import { Separator } from "@/components/ui/separator";
import DashboardWrapper from "@/components/layout/DashboardWrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ),
  }));

  return (
    <DashboardWrapper>

    <div className="relative flex min-h-screen w-full bg-background transition-colors duration-300">
      {/* Sidebar */}
      <DashboardSidebar links={filteredLinks} />

      <div className="flex flex-1 flex-col">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-all duration-300 dark:border-border/60 dark:bg-background/90">
          <div className="flex h-16 items-center px-4 lg:px-6">
            <MaxWidthWrapper className="flex w-full max-w-7xl items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <MobileSheetSidebar links={filteredLinks} />
                  <Separator 
                    orientation="vertical" 
                    className="h-6 bg-border/60 dark:bg-border/40" 
                  />
                </div>
                
        
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-muted/30 p-1 dark:bg-muted/20">
                   <Separator 
                    orientation="vertical" 
                    className="mx-1 h-6 bg-border/40 dark:bg-border/30" 
                  />
                  <UserAccountNav />
                </div>
              </div>
            </MaxWidthWrapper>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background/50 transition-colors duration-300">
          <div className="h-full p-4 md:p-6 lg:p-8">
            <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-6">
              {children}
            </MaxWidthWrapper>
          </div>
        </main>
      </div>
    </div>      </DashboardWrapper>

  );
}