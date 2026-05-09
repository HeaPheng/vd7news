import NewsCard from "../../src/components/NewsCard";
import { searchPosts, type WPPost } from "@/lib/wordpress";
import { stripHtml } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const keyword = q.trim();
  const posts = keyword ? await searchPosts(keyword) : [];

  return (
    <main className="min-h-screen bg-[#071120] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <form
            action="/search"
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="q"
              defaultValue={keyword}
              placeholder="ស្វែងរកព័ត៌មាន..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1628] px-4 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-red-500/40 focus:ring-2 focus:ring-red-500/20 sm:text-base"
            />

            <button
              type="submit"
              className="h-12 rounded-2xl bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]"
            >
              ស្វែងរក
            </button>
          </form>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-4">
            <h1 className="shrink-0 text-2xl font-bold tracking-tight sm:text-3xl">
              លទ្ធផលស្វែងរក
            </h1>

            <div className="h-px flex-1 bg-red-500/70" />

            {keyword && (
              <span className="shrink-0 text-base font-semibold text-red-400 sm:text-lg">
                &ldquo;{keyword}&rdquo;
              </span>
            )}
          </div>

          {keyword ? (
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm text-white/60 sm:text-base">
                រកឃើញ <span className="font-semibold text-white">{posts.length}</span>{" "}
                លទ្ធផល
              </p>
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
              <h2 className="text-lg font-semibold sm:text-xl">
                សូមបញ្ចូលពាក្យស្វែងរក
              </h2>
              <p className="mt-2 text-sm leading-7 text-white/60 sm:text-base">
                វាយពាក្យគន្លឹះខាងលើ ដើម្បីស្វែងរកអត្ថបទ និងព័ត៌មាន
              </p>
            </div>
          )}

          {keyword && posts.length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <h3 className="text-lg font-semibold sm:text-xl">
                មិនមានអត្ថបទត្រូវនឹងការស្វែងរកទេ
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
                សូមសាកល្បងពាក្យផ្សេងទៀត ឬប្រើពាក្យទូទៅជាងនេះ
              </p>
            </div>
          ) : keyword ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {posts.map((post: WPPost) => {
                const image =
                  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

                const category =
                  post._embedded?.["wp:term"]
                    ?.flat()
                    ?.find((term) => term.taxonomy === "category");

                return (
                  <div key={post.id} className="h-full">
                    <NewsCard
                      slug={post.slug}
                      title={post.title.rendered}
                      image={image}
                      excerpt={stripHtml(post.excerpt?.rendered)}
                      date={post.date}
                      categoryName={category?.name}
                      categorySlug={category?.slug}
                      compact
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}