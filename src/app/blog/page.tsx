"use client";

import Link from "next/link";
import Image from "next/image";
import { client } from "../../../libs/microcms";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// 型定義
type Post = {
  id: string;
  title: string;
  publishedAt: string;
  category: { name: string };
  eyecatch: { url: string };
  excerpt?: string;
};

// 1ページあたりの記事数
const PER_PAGE = 4;

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
    posts: data.contents as Post[],
    totalCount: data.totalCount as number,
  };
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const offset = useRef(0);

  // 初回読み込み
  useEffect(() => {
    loadInitialPosts();
  }, []);

  // Intersection Observer の設定

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById("scroll-trigger");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [isLoading, hasMore]);

  // 初期データの読み込み
  const loadInitialPosts = async () => {
    setIsLoading(true);
    try {
      const { posts: initialPosts, totalCount: total } = await getBlogPosts();
      setPosts(initialPosts);
      setTotalCount(total);
      offset.current = initialPosts.length;
      setHasMore(initialPosts.length < total);
    } catch (error) {
      console.error("Failed to load initial posts:", error);
    }
    setIsLoading(false);
  };

  // 追加データの読み込み
  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { posts: newPosts } = await getBlogPosts(offset.current);
      setPosts((prev) => [...prev, ...newPosts]);
      offset.current += newPosts.length;
      setHasMore(offset.current < totalCount);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">記事一覧</h1>
        <p className="text-gray-600">全{totalCount}件の記事</p>
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

      {/* スクロールトリガー要素 */}
      {hasMore && (
        <div id="scroll-trigger" className="mt-8">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
