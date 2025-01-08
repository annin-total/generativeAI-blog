// app/blog/[id]/page.tsx
import { client } from "../../../../libs/microcms";
import dayjs from "dayjs";
import Image from "next/image";

// ブログ記事の型定義
type Props = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  category: { name: string };
  eyecatch: { url: string };
};

// microCMSから特定の記事を取得
async function getBlogPost(id: string): Promise<Props> {
  const data = await client.get({
    endpoint: `blog/${id}`,
  });
  return data;
}

// 記事詳細ページの生成
export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const post = await getBlogPost(id);

  const formattedDate = dayjs(post.publishedAt).format("YYYY/MM/DD HH:mm");
  const formattedUpdatedDate = dayjs(post.updatedAt).format("YYYY/MM/DD HH:mm");

  return (
    <article className="max-w-3xl mx-auto">
      {/* ヘッダー情報 */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <time dateTime={post.publishedAt} className="flex items-center">
            <i className="fas fa-clock text-sm mr-1.5"></i>
            {formattedDate}
          </time>
          {post.publishedAt !== post.updatedAt && (
            <time dateTime={post.updatedAt} className="flex items-center">
              <i className="fas fa-pencil text-sm mr-1.5"></i>
              {formattedUpdatedDate}
            </time>
          )}
          <span className="flex items-center">
            <i className="fa-solid fa-tag text-sm mr-1.5"></i>
            {post.category.name}
          </span>
        </div>
      </header>

      {/* アイキャッチ画像 */}
      <div className="mb-12 aspect-[16/9] relative rounded-lg overflow-hidden">
        <Image
          src={post.eyecatch.url}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 記事本文 */}
      <div
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-snug
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:mx-auto
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-blockquote:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300
          prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
          prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-hr:my-8 prose-hr:border-gray-200"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}

// 静的パスを生成
export async function generateStaticParams() {
  const data = await client.get({
    endpoint: "blog",
    queries: { fields: "id", limit: 100 },
  });

  return data.contents.map((post: { id: string }) => ({
    id: post.id,
  }));
}
