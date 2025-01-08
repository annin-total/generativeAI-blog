// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { client } from "../../libs/microcms";
import dayjs from "dayjs";

// ブログ記事の型定義
type Props = {
  id: string;
  title: string;
  publishedAt: string;
  category: { name: string };
  eyecatch: { url: string };
  excerpt?: string; // 記事の抜粋を追加
};

async function getBlogPosts(): Promise<{ posts: Props[] }> {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      fields: ["id", "title", "publishedAt", "category", "eyecatch", "excerpt"],
      limit: 12,
    },
  });
  return { posts: data.contents };
}

export default async function Home() {
  const { posts } = await getBlogPosts();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">新着記事</h1>
        <p className="text-gray-600">最新のAI技術に関する記事をお届けします</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <Link href={`/blog/${post.id}`}>
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={post.eyecatch.url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2 h-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#eaf199] text-[#8d8e25]">
                    {post.category.name}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 h-14">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500 h-5">
                  <time dateTime={post.publishedAt}>
                    <i className="far fa-clock mr-1"></i>
                    {dayjs(post.publishedAt).format("YYYY/MM/DD")}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          記事をもっと見る
          <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
