// app/blog/[id]/page.tsx
"use client";

import { client, writeClient } from "../../../../libs/microcms";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommentForm from "@/components/CommentForm";
import LoadingSpinner from "@/components/LoadingSpinner";

// 型定義を修正
type Comment = {
  id: string;
  name: string;
  content: string;
  postedAt: string;
  blogId: string;
};

type BlogPost = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  category: { name: string };
  eyecatch: { url: string };
};

// microCMSから特定の記事を取得
async function getBlogPost(id: string): Promise<BlogPost> {
  const data = await client.get({
    endpoint: "blog",
    contentId: id,
  });
  return data;
}

// 特定の記事のコメントを取得
async function getComments(blogId: string): Promise<Comment[]> {
  const data = await client.get({
    endpoint: "comments",
    queries: {
      filters: `blogId[equals]${blogId}`,
      orders: "-createdAt",
    },
  });
  return data.contents;
}

// コメントを追加する関数を修正
async function addComment(blogId: string, name: string, content: string) {
  try {
    const result = await writeClient.create({
      endpoint: "comments",
      content: {
        name,
        content,
        blogId,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postData, commentsData] = await Promise.all([
          getBlogPost(params.id),
          getComments(params.id),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <div>記事が見つかりません</div>;

  // handleCommentSubmit関数を修正
  const handleCommentSubmit = async (name: string, content: string) => {
    try {
      await addComment(params.id, name, content);
      // コメントを再取得して表示を更新
      const updatedComments = await getComments(params.id);
      setComments(updatedComments);
      alert("コメントを投稿しました！");
    } catch (error: any) {
      console.error("コメントの投稿に失敗しました:", error);
      alert(
        error?.message ||
          "コメントの投稿に失敗しました。書き込み用APIキーが正しく設定されているか確認してください。"
      );
    }
  };

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
            {dayjs(post.publishedAt).format("YYYY/MM/DD HH:mm")}
          </time>
          {post.publishedAt !== post.updatedAt && (
            <time dateTime={post.updatedAt} className="flex items-center">
              <i className="fas fa-pencil text-sm mr-1.5"></i>
              {dayjs(post.updatedAt).format("YYYY/MM/DD HH:mm")}
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

      {/* コメントセクション */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <i className="fas fa-comments text-green-400 mr-3"></i>
          コメント
        </h2>

        {/* コメント一覧 */}
        <div className="space-y-6 mb-12">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center">
                    <i className="fas fa-user-circle text-blue-400 text-lg mr-3"></i>
                    <span className="font-medium text-gray-800">
                      {comment.name}
                    </span>
                  </span>
                  <time className="text-sm text-gray-500 flex items-center">
                    <i className="fas fa-clock text-gray-400 mr-1.5"></i>
                    {dayjs(comment.postedAt).format("YYYY/MM/DD HH:mm")}
                  </time>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap pl-8 mt-2">
                  <i className="fas fa-quote-left text-gray-300 mr-2 text-sm"></i>
                  {comment.content}
                  <i className="fas fa-quote-right text-gray-300 ml-2 text-sm"></i>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              <i className="fas fa-comment-slash text-gray-300 mr-2"></i>
              まだコメントはありません
            </p>
          )}
        </div>

        {/* コメントフォーム */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-edit text-green-400 mr-3"></i>
            コメントを投稿
          </h3>
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </div>
    </article>
  );
}
