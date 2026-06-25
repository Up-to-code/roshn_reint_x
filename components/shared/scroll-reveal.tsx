"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import useIntersectionObserver from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: ElementType;
  threshold?: number;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay,
  className,
  as: Tag = "div",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const entry = useIntersectionObserver(ref, {
    threshold,
    rootMargin: "0px 0px -10% 0px",
    freezeOnceVisible: true,
  });
  const isVisible = entry?.isIntersecting ?? false;

  return (
    <Tag
      ref={ref}
      className={cn(
        "reveal",
        `reveal-${direction}`,
        delay && `reveal-delay-${delay}`,
        isVisible && "is-visible",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
