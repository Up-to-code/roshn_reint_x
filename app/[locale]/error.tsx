'use native';
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('empty'); // Using 'empty' namespace or similar for generic errors, or fallback

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">
        {/* Fallback text if translation missing */}
        Something went wrong!
      </h2>
      <p className="text-gray-600">{error.message}</p> 
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
