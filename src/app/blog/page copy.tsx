import Link from "next/link";
import Image from "next/image";
import { client } from "../../../libs/microcms";
import dayjs from "dayjs";

// 型定義
type Props = {
  id: string;
  title: string;
  publishedAt: string;
  category: { name: string };
  eyecatch: { url: string };
  excerpt?: string;
};

// 1ページあたりの記事数
const PER_PAGE = 3;

// 検索パラメータの型定義
type SearchParams = {
  searchParams: {
    page?: string;
  };
};

// ブログ記事を取得
async function getBlogPosts(offset = 0) {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      fields: ["id", "title", "publishedAt", "category", "eyecatch", "excerpt"],
      offset,
      limit: PER_PAGE,
    },
  });
  return {
    posts: data.contents,
    totalCount: data.totalCount,
  };
}

export default async function BlogList({ searchParams }: SearchParams) {
  // 現在のページ番号を取得（デフォルトは1）
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * PER_PAGE;

  // 記事データとトータル件数を取得
  const { posts, totalCount } = await getBlogPosts(offset);
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">記事一覧</h1>
        <p className="text-gray-600">全{totalCount}件の記事</p>
      </div>

      {/* 記事一覧 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-12">
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

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
            >
              前のページ
            </Link>
          )}
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === currentPage;

              return (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
                  className={`px-4 py-2 text-sm rounded ${
                    isCurrentPage
                      ? "bg-blue-600 text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
            >
              次のページ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
