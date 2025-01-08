import { client } from "../../../../libs/microcms";

export async function generateStaticParams() {
  const data = await client.get({
    endpoint: "blog",
    queries: { fields: "id", limit: 100 },
  });

  return data.contents.map((post: { id: string }) => ({
    id: post.id,
  }));
}
