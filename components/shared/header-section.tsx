interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
}

export function HeaderSection({ label, title, subtitle }: HeaderSectionProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {label ? (
        <div className="text-gradient_indigo-purple mb-4 font-semibold">
          {label}
        </div>
      ) : null}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
