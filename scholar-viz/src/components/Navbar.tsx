'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Scholar Wizards</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/#ranking-matrix"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Rankings
            </Link>
            <Link
              href="/#early-career"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Early Career
            </Link>
            <Link
              href="/#youngest"
              className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Rising Stars
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">
              185 Scholars
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/#ranking-matrix"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Rankings
              </Link>
              <Link
                href="/#early-career"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Early Career
              </Link>
              <Link
                href="/#youngest"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Rising Stars
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
