/** Placeholder de tarjeta de producto durante la carga. */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card shadow-editorial">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-4/5 rounded-full" />
        <div className="skeleton h-5 w-1/2 rounded-full" />
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Rejilla de skeletons. */
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
