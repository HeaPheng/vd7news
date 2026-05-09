export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      {/* Header skeleton */}
      <section className="mb-8 md:mb-10">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-7 w-1.5 rounded-full bg-red-500" />
          <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
        </div>
        <div className="h-5 w-64 skeleton-shimmer rounded-lg mt-2" />
      </section>

      {/* Post grid skeleton */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="h-32 w-full skeleton-shimmer sm:h-40 lg:h-48" />
            <div className="space-y-2 p-3 sm:p-4">
              <div className="h-3 w-20 skeleton-shimmer rounded-full" />
              <div className="h-4 w-full skeleton-shimmer rounded-lg" />
              <div className="h-4 w-4/5 skeleton-shimmer rounded-lg" />
              <div className="h-3 w-24 skeleton-shimmer rounded-lg" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
