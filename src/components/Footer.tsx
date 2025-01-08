import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-100 p-6 text-center">
      <div className="container mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">AIブログ</h2>
          <p className="text-gray-600">
            最新のAIテクノロジーと情報をお届けします
          </p>
        </div>
        <nav className="mb-4">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link href="/" className="hover:text-blue-500">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-500">
                このブログについて
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-500">
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </nav>

        {/* SNSリンクゾーン - アイコン表示の検証が必要 */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter text-2xl text-gray-700 hover:text-blue-400"></i>
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook text-2xl text-gray-700 hover:text-blue-600"></i>
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram text-2xl text-gray-700 hover:text-pink-500"></i>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github text-2xl text-gray-700 hover:text-black"></i>
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} AIブログ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
