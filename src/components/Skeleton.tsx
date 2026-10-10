export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-neutral-200/80 ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-4">
    <div className="flex gap-3">
      <Skeleton className="h-12 w-12" />
      <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></div>
    </div>
    <Skeleton className="mt-5 h-3 w-16" />
    <div className="mt-2 flex justify-between"><Skeleton className="h-6 w-24" /><Skeleton className="h-5 w-14" /></div>
  </div>
);

export const GridSkeleton = ({ n = 6 }: { n?: number }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: n }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);
