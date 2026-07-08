"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { SidebarNavItem } from "@/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/shared/icons";
import ProjectSwitcher from "@/components/dashboard/project-switcher";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";

interface MobileSheetSidebarProps {
  links: SidebarNavItem[];
}

export function MobileSheetSidebar({ links }: MobileSheetSidebarProps) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();

  if (!(isSm || isMobile)) {
    // Desktop fallback (show empty placeholder if hidden)
    return (
      <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0 md:hidden"
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col p-0">
        <ScrollArea className="h-full overflow-y-auto">
          <div className="flex h-screen flex-col">
            {/* Header */}
            <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Icons.logo className="size-6" />
                <span className="font-sans text-lg font-bold">
                  {siteConfig.name}
                </span>
              </Link>

              {/* Project Switcher */}
              <ProjectSwitcher large />

              {/* Navigation Links */}
              {links.map((section) => (
                <section
                  key={section.title}
                  className="flex flex-col gap-0.5"
                >
                  <p className="text-xs text-muted-foreground">
                    {section.title}
                  </p>

                  {section.items.map((item) => {
                    const Icon = Icons[item.icon || "arrowRight"];
                    return (
                      item.href && (
                        <Fragment key={`link-${item.title}`}>
                          <Link
                            href={item.disabled ? "#" : item.href}
                            onClick={() => {
                              if (!item.disabled) setOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                              path === item.href
                                ? "bg-muted"
                                : "text-muted-foreground hover:text-accent-foreground",
                              item.disabled &&
                                "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                            )}
                          >
                            <Icon className="size-5" />
                            {item.title}
                            {item.badge && (
                              <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </Fragment>
                      )
                    );
                  })}
                </section>
              ))}

              {/* Footer */}
          
            </nav>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
