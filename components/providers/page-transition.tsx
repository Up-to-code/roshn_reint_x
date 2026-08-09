"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;

    body.classList.remove("page-transition-ready");
    body.classList.add("page-transition-enter");

    const raf = window.requestAnimationFrame(() => {
      body.classList.remove("page-transition-enter");
      body.classList.add("page-transition-ready");
    });

    return () => {
      window.cancelAnimationFrame(raf);
      body.classList.remove("page-transition-enter", "page-transition-ready");
    };
  }, [pathname]);

  return null;
}
