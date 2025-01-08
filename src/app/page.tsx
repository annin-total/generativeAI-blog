// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { client } from "../../libs/microcms";

// ブログ記事の型定義
type Props = {
  id: string;
  title: string;
  category: { name: string };
  eyecatch: { url: string };
};

// microCMSからブログ記事を取得
async function getBlogPosts(): Promise<{ posts: Props[] }> {
  const data = await client.get({
    endpoint: "blog",
    queries: {
      fields: "id,title,eyecatch",
      limit: 10,
    },
  });
  return { posts: data.contents };
}

export default async function Home() {
  const { posts } = await getBlogPosts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">ブログ記事一覧</h1>
      <ul className="grid gap-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`} className="block hover:opacity-80">
              {post.eyecatch && (
                <Image
                  src={post.eyecatch.url}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              )}
              <h2 className="mt-2">{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
