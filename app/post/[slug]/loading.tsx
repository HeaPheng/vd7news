export default function PostLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="mx-auto max-w-[1750px] px-2 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[60px_minmax(0,1120px)_320px] 2xl:grid-cols-[80px_minmax(0,1180px)_320px]">
          <aside className="hidden xl:block" />
          <main>
            {/* Ad skeleton */}
            <div className="mb-6 h-12 w-full skeleton-shimmer rounded-2xl" />

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#10182b] shadow-2xl">
              {/* Featured image skeleton */}
              <div className="h-[260px] w-full skeleton-shimmer sm:h-[340px] lg:h-[430px]" />

              <div className="mx-auto max-w-[980px] px-3 pb-10 pt-6 sm:px-8 lg:px-10">
                {/* Category badge */}
                <div className="h-6 w-24 skeleton-shimmer rounded-full" />

                {/* Title */}
                <div className="mt-4 h-10 w-3/4 skeleton-shimmer rounded-lg" />
                <div className="mt-2 h-10 w-1/2 skeleton-shimmer rounded-lg" />

                {/* Date */}
                <div className="mt-4 h-4 w-40 skeleton-shimmer rounded" />

                {/* Share buttons */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-9 w-9 skeleton-shimmer rounded-full" />
                    ))}
                  </div>
                </div>

                {/* Content lines */}
                <div className="mt-8 space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-shimmer rounded"
                      style={{ height: "16px", width: `${85 + Math.random() * 15}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>
          <aside className="hidden xl:block" />
        </div>
      </div>
    </div>
  );
}
