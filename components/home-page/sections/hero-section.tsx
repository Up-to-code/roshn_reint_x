import { useState } from 'react';

export default function SimpleHero() {
  const [content] = useState({
    accentText: "Welcome",
    title: "Simple Hero Section",
    subtitle: "Clean and minimal design"
  });

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="mx-auto max-w-4xl px-6 text-center">
        
        {content.accentText && (
          <div className="mb-6 text-sm font-semibold uppercase tracking-wide text-orange-400">
            {content.accentText}
          </div>
        )}

        {content.title && (
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
            {content.title}
          </h1>
        )}

        {content.subtitle && (
          <p className="text-xl text-gray-300">
            {content.subtitle}
          </p>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
          <div className="mt-2 h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}