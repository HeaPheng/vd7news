export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero + Sidebar skeleton */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.9fr_0.95fr]">
        <div className="h-[420px] skeleton-shimmer rounded-3xl" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-40 skeleton-shimmer rounded-lg" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex-1 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Category rows skeleton */}
      {[...Array(3)].map((_, i) => (
        <section key={i} className="mt-10">
          <div className="mb-5 flex items-center gap-4 border-b border-white/10 pb-3">
            <div className="h-6 w-32 skeleton-shimmer rounded-lg" />
            <div className="h-px flex-1 bg-red-500/20" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="h-40 skeleton-shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 skeleton-shimmer rounded-full" />
                  <div className="h-4 w-full skeleton-shimmer rounded-lg" />
                  <div className="h-4 w-3/4 skeleton-shimmer rounded-lg" />
                  <div className="h-3 w-24 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
