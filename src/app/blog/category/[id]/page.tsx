// app/blog/category/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { client } from "../../../../../libs/microcms";

// 型定義
type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  category: { name: string };
  eyecatch: { url: string };
  excerpt?: string;
};

type Props = {
  params: { id: string };
};

// メインのページコンポーネント
export default async function CategoryId({ params }: Props) {
  const id = params.id;
  const data = await client.get({
    endpoint: "blog",
    queries: {
      filters: `category[equals]${id}`,
      fields: ["id", "title", "publishedAt", "category", "eyecatch", "excerpt"],
    },
  });
  const category = await client.get({
    endpoint: "categories",
    queries: { filters: `id[equals]${id}` },
  });

  const blogs: Blog[] = data.contents;
  const categoryName = category.contents[0].name;

  // カテゴリーに紐付いたコンテンツがない場合に表示
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">カテゴリー：{categoryName}</h1>
        <p className="text-gray-600">このカテゴリーの記事はまだありません</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          カテゴリー：{categoryName}
        </h1>
        <p className="text-gray-600">
          {categoryName}に関する記事一覧（{blogs.length}件）
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <Link href={`/blog/${blog.id}`}>
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2 h-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#eaf199] text-[#8d8e25]">
                    {blog.category.name}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 h-14">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                    {blog.excerpt}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500 h-5">
                  <time dateTime={blog.publishedAt}>
                    <i className="far fa-clock mr-1"></i>
                    {dayjs(blog.publishedAt).format("YYYY/MM/DD")}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// 静的生成のためのパスを指定
export async function generateStaticParams() {
  const data = await client.get({ endpoint: "categories" });

  return data.contents.map((content: { id: string }) => ({
    id: content.id,
  }));
}
