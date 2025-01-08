import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600"
        >
          AIブログ
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-500">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-blue-500">
                このブログについて
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
