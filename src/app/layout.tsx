import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CategoryList from "@/components/CategoryList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIブログ - 最新のAI技術情報をお届け",
  description:
    "AIに関する最新の技術情報、トレンド、活用事例をわかりやすく解説するブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Header />
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {children}
              </div>
            </main>
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="text-center mb-6">
                    <h2 className="font-bold text-xl mb-2">AIブログ</h2>
                    <p className="text-gray-600 text-sm">
                      最新のAI技術と活用事例をわかりやすく解説
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 mb-6">
                    <a href="#" className="text-gray-600 hover:text-blue-500">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-500">
                      <i className="fab fa-github text-xl"></i>
                    </a>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="block bg-white hover:shadow-md rounded-lg px-4 py-2 mb-4 flex items-center justify-between transition-all duration-300 ease-in-out"
                >
                  <span>全ての記事を見る</span>
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
                <CategoryList />
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
