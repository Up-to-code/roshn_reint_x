"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useHomePageStore } from "@/store/home-page-store";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
};

type Locale = 'en' | 'ar';

export default function LocaleSwitcherSelect({ label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLang, setCurrentLang } = useHomePageStore();

  const handleLocaleChange = (nextLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
    
    // Update store
    setCurrentLang(nextLocale);
    
    // Navigate to new locale
    router.push(`/${nextLocale}${pathWithoutLocale}`);
  };

  return (
    <Select value={currentLang} onValueChange={handleLocaleChange}>
      <SelectTrigger
        className={cn(
          "h-9 w-[100px] border-[#F0EDE8]/20 bg-white/10 text-[#F0EDE8]/90 backdrop-blur-xl",
          "focus:ring-1 focus:ring-white/30 focus:ring-offset-0",
          "hover:border-[#F0EDE8]/30 hover:bg-white/15",
          "rounded-xl transition-all duration-300",
          "flex items-center justify-between"
        )}
        aria-label={label}
      >
        <SelectValue />
        <ChevronDown className="size-3 opacity-70" />
      </SelectTrigger>
      <SelectContent 
        className={cn(
          "border-[#F0EDE8]/20 bg-white/10 text-[#F0EDE8]/90 backdrop-blur-3xl",
          "rounded-xl shadow-2xl"
        )}
      >
        <SelectItem 
          value="ar" 
          className={cn(
            "focus:bg-white/15 focus:text-[#F0EDE8]",
            "rounded-lg transition-colors",
            currentLang === 'ar' && "bg-white/15 text-[#F0EDE8]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">🇸🇦</span>
            <span>العربية</span>
          </div>
        </SelectItem>
        <SelectItem 
          value="en"
          className={cn(
            "focus:bg-white/15 focus:text-[#F0EDE8]",
            "rounded-lg transition-colors",
            currentLang === 'en' && "bg-white/15 text-[#F0EDE8]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">🇺🇸</span>
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}