"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/types";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/shared/icons";
import { Link } from "@/i18n/routing";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const path = usePathname();
  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto">
          <aside
            className={cn(
              "hidden h-screen transition-all duration-300 ease-in-out md:block",
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]"
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2 bg-slate-900 dark:bg-slate-950">
              <div className="flex h-14 items-center border-b border-slate-800 p-4 dark:border-slate-900 lg:h-[60px]">
                {/* {isSidebarExpanded && <ProjectSwitcher />} */}

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white lg:size-8"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose
                      size={18}
                      className="stroke-current"
                    />
                  ) : (
                    <PanelRightClose
                      size={18}
                      className="stroke-current"
                    />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-8 px-4 pt-4">
                {links.map((section) => (
                  <section
                    key={section.title}
                    className={cn(
                      "flex flex-col gap-0.5",
                      isRTL && "text-right"
                    )}
                  >
                    {isSidebarExpanded ? (
                      <p className="my-4 text-xs uppercase tracking-wider text-slate-500">
                        {t(section.title)}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}

                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            {isSidebarExpanded ? (
                              <Link
                                href={item.href}
                                aria-disabled={item.disabled}
                                onClick={item.disabled ? (event) => event.preventDefault() : undefined}
                                className={cn(
                                  "flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-all duration-200",
                                  isRTL && "flex-row-reverse",
                                  path === item.href
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                  item.disabled &&
                                    "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-500"
                                )}
                              >
                                <Icon className="size-5" />
                                <span className="truncate">{t(item.title)}</span>
                                {item.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            ) : (
                              <Tooltip key={`tooltip-${item.title}`}>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={item.href}
                                    aria-disabled={item.disabled}
                                    onClick={item.disabled ? (event) => event.preventDefault() : undefined}
                                    className={cn(
                                      "flex items-center justify-center gap-3 rounded-md py-2 text-sm font-medium transition-all duration-200",
                                      isRTL && "flex-row-reverse",
                                      path === item.href
                                        ? "bg-slate-800 text-white shadow-sm"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                      item.disabled &&
                                        "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-500"
                                    )}
                                  >
                                    <Icon className="size-5" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent 
                                  side={isRTL ? "left" : "right"}
                                  className="border-slate-700 bg-slate-800 text-white"
                                >
                                  {t(item.title)}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}
              </nav>

              
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
