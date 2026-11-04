export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-nature-ink/8 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-4">
        <Skeleton className="mx-auto h-40 w-40 rounded-full" />
        <Skeleton className="mx-auto h-6 w-32" />
        <Skeleton className="mx-auto h-5 w-24 rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-3">
          <Skeleton className="h-6 w-28" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
        <div className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function JardimSkeleton() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PerfilSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-nature-surface rounded-2xl shadow-card p-5 space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
      <div className="col-span-2 md:col-span-4 bg-nature-surface rounded-2xl shadow-card p-6 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="bg-nature-surface rounded-2xl shadow-card p-6 space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-12 w-40 rounded-xl" />
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <DashboardSkeleton />
    </div>
  );
}

export function SocialSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Skeleton className="h-11 flex-1 rounded-lg" />
        <Skeleton className="h-11 w-28 rounded-lg" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-nature-surface rounded-2xl shadow-card p-5 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-36" />
        </div>
      ))}
    </div>
  );
}

export function RankingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-nature-bg/60">
          <Skeleton className="h-5 w-6" />
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
