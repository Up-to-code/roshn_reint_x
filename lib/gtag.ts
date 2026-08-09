const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-G9PD0DJV58";
type GtagArguments = [command: "config" | "event", target: string, parameters?: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArguments) => void;
  }
}

function getGtag() {
  window.dataLayer ||= [];
  window.gtag ||= (...args: GtagArguments) => {
    window.dataLayer?.push(args);
  };
  return window.gtag;
}

export const pageview = (url: string) => {
  if (typeof window === "undefined") return;

  getGtag()("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === "undefined") return;

  getGtag()("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
