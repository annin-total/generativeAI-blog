import Link from "next/link";
import { client } from "../../libs/microcms";

type Category = {
  id: string;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  const data = await client.get({ endpoint: "categories" });
  return data.contents;
}

export default async function CategoryList() {
  const categories = await getCategories();

  return (
    <aside className="w-64 p-4">
      <h2 className="text-xl font-bold mb-4">カテゴリ一覧</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog/category/${category.id}`}
              className="hover:text-blue-500"
            >
              <i className="fa-solid fa-tag text-gray-500 mr-2"></i>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
