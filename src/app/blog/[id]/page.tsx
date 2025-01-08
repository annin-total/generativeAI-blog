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
  const { id } = params; // IDを直接取得
  const post = await getBlogPost(id);
  console.log(post);

  // dayjsを使ってpublishedAtを指定の形式に変換
  const formattedDate = dayjs(post.publishedAt).format("YYYY/MM/DD HH:mm");
  const formattedUpdatedDate = dayjs(post.updatedAt).format("YYYY/MM/DD HH:mm");

  return (
    <main>
      <Image
        src={post.eyecatch.url}
        alt={post.title}
        width={800}
        height={400}
        priority
      />
      <h1>{post.title}</h1> {/* タイトルを表示 */}
      <div>公開日：{formattedDate}</div> {/* 日付を表示 */}
      {post.publishedAt !== post.updatedAt && (
        <div>更新日：{formattedUpdatedDate}</div>
        /* 更新日付を表示（公開日と異なる場合のみ） */
      )}
      <div>カテゴリー：{post.category && post.category.name}</div>{" "}
      {/* カテゴリーを表示 */}
      <div dangerouslySetInnerHTML={{ __html: post.body }} />{" "}
      {/* 記事本文を表示 */}
    </main>
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
