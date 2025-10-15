"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define types locally since the import is causing issues
interface Project {
  id: string | number;
  image: string;
  title: string;
  description: string;
  link: string;
}

interface PortfolioSectionContent {
  title: string;
  subtitle: string;
  projects: Project[];
}

interface PortfolioSectionProps {
  content: PortfolioSectionContent;
  className?: string;
}

export function PortfolioSection({ content, className }: PortfolioSectionProps) {
  if (!content.projects || content.projects.length === 0) return null;

  return (
    <section className={cn("bg-white py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-20">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            {content.subtitle}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {content.projects.map((project, index) => (
            <PortfolioCard 
              key={project.id} 
              project={project} 
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PortfolioCardProps {
  project: Project;
  priority?: boolean;
}

function PortfolioCard({ project, priority = false }: PortfolioCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden md:h-80">
        <img
          src={project.image}
          alt={project.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="mb-3 text-xl font-semibold tracking-tight text-black md:text-2xl">
          {project.title}
        </h3>
        <p className="mb-6 line-clamp-3 leading-relaxed text-gray-600">
          {project.description}
        </p>
        
        {/* CTA Button */}
        <Button 
          asChild
          variant="outline"
          className="border-orange-500 text-orange-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white"
        >
          <a href={project.link} className="inline-flex items-center gap-2">
            View Project
            <svg 
              className="size-4 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </Button>
      </div>
    </article>
  );
}