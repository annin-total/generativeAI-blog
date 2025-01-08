// app/blog/category/[id]/page.tsx
import Link from "next/link";
import { client } from "../../../../../libs/microcms";

// 型定義
type Blog = {
  id: string;
  title: string;
};

type Props = {
  params: { id: string };
};

// メインのページコンポーネント
export default async function CategoryId({ params }: Props) {
  const id = params.id;
  const data = await client.get({
    endpoint: "blog",
    queries: { filters: `category[equals]${id}` },
  });
  const category = await client.get({
    endpoint: "categories",
    queries: { filters: `id[equals]${id}` },
  });

  const blog: Blog[] = data.contents;
  const categoryName = category.contents[0].name;

  // カテゴリーに紐付いたコンテンツがない場合に表示
  if (blog.length === 0) {
    return <div>カテゴリー内のブログコンテンツがありません</div>;
  }

  return (
    <main>
      <h1>カテゴリー：{categoryName}</h1>
      <ul>
        {blog.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

// 静的生成のためのパスを指定
// export async function generateStaticParams() {
//   const data = await client.get({ endpoint: "categories" });

//   return data.contents.map((content: { id: string }) => ({
//     id: content.id,
//   }));
// }
