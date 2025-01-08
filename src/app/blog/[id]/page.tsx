// app/blog/[id]/page.tsx
"use client";

import { client } from "../../../../libs/microcms";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommentForm from "@/components/CommentForm";

// 型定義を拡張
type Comment = {
  commentAuthorName: string;
  commentContent: string;
  commentCreatedAt: string;
};

type Props = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  category: { name: string };
  eyecatch: { url: string };
  comments?: Comment[];
};

// microCMSから特定の記事を取得
async function getBlogPost(id: string): Promise<Props> {
  const data = await client.get({
    endpoint: "blog",
    contentId: id,
  });
  return data;
}

// コメントを追加
// async function addComment(postId: string, authorName: string, content: string) {
//   const currentPost = await client.get({ endpoint: "blog", contentId: postId });
//   const currentComments = currentPost.comments || [];

//   const newComment = {
//     commentAuthorName: authorName,
//     commentContent: content,
//     commentCreatedAt: new Date().toISOString(),
//   };

//   await client.update({
//     endpoint: "blog",
//     contentId: postId,
//     content: {
//       comments: [...currentComments, newComment],
//     },
//   });
// }
// コメントを追加する関数を修正
async function addComment(postId: string, authorName: string, content: string) {
  console.log("Adding comment...", { postId, authorName, content });

  try {
    const currentPost = await client.get({
      endpoint: "blog",
      contentId: postId,
    });
    console.log("Current post:", currentPost);

    const currentComments = currentPost.comments || [];
    const newComment = {
      commentAuthorName: authorName,
      commentContent: content,
      commentCreatedAt: new Date().toISOString(),
    };

    const result = await writeClient.update({
      endpoint: "blog",
      contentId: postId,
      content: {
        comments: [...currentComments, newComment],
      },
    });

    console.log("Comment added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Props | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPost(params.id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>記事が見つかりません</div>;

  // const handleCommentSubmit = async (authorName: string, content: string) => {
  //   try {
  //     await addComment(params.id, authorName, content);
  //     // 記事を再取得して最新のコメントを表示
  //     const updatedPost = await getBlogPost(params.id);
  //     setPost(updatedPost);
  //   } catch (error) {
  //     console.error("Failed to add comment:", error);
  //     alert("コメントの投稿に失敗しました");
  //   }
  // };
  // handleCommentSubmit関数も修正
  const handleCommentSubmit = async (authorName: string, content: string) => {
    try {
      await addComment(params.id, authorName, content);
      // 記事を再取得して最新のコメントを表示
      const updatedPost = await getBlogPost(params.id);
      setPost(updatedPost);
      alert("コメントを投稿しました！");
    } catch (error: any) {
      console.error("Failed to add comment:", error);
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
        <h2 className="text-2xl font-bold mb-8">コメント</h2>

        {/* コメント一覧 */}
        <div className="space-y-6 mb-12">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {comment.commentAuthorName}
                  </span>
                  <time className="text-sm text-gray-500">
                    {dayjs(comment.commentCreatedAt).format("YYYY/MM/DD HH:mm")}
                  </time>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.commentContent}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">まだコメントはありません</p>
          )}
        </div>

        {/* コメントフォーム */}
        <div>
          <h3 className="text-xl font-bold mb-4">コメントを投稿</h3>
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </div>
    </article>
  );
}
