// app/[locale]/(marketing)/p/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="mb-6 h-10 w-40" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="aspect-video rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
            </div>
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}