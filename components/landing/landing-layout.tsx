import { ReactNode } from "react";
import Image from "next/image";

interface LandingLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  overlayColor?: string;
}

export function LandingLayout({
  children,
  backgroundImage = "/images/landing-bg.jpg", // Default placeholder
  overlayColor = "bg-black/40",
}: LandingLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
          unoptimized 
        />
        <div className={`absolute inset-0 ${overlayColor}`} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
