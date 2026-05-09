import NewsCard from "./NewsCard";

type BlockPost = {
  id: number;
  slug: string;
  title: string;
  image?: string;
  excerpt?: string;
  date?: string;
  author?: string;
  categoryName?: string;
  categorySlug?: string;
};

type CategoryBlockProps = {
  title: string;
  posts: BlockPost[];
};

export default function CategoryBlock({ title, posts }: CategoryBlockProps) {
  if (!posts.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section>
      <div className="mb-4 flex items-center gap-4 border-b border-white/10 pb-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="h-px flex-1 bg-red-500/40" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <NewsCard
          id={featured.id}
          slug={featured.slug}
          title={featured.title}
          image={featured.image}
          excerpt={featured.excerpt}
          date={featured.date}
          author={featured.author}
          categoryName={featured.categoryName}
          categorySlug={featured.categorySlug}
          compact
        />

        <div className="space-y-4">
          {rest.map((post) => (
            <NewsCard
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              image={post.image}
              excerpt={post.excerpt}
              date={post.date}
              author={post.author}
              categoryName={post.categoryName}
              categorySlug={post.categorySlug}
              horizontal
            />
          ))}
        </div>
      </div>
    </section>
  );
}