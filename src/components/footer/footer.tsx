'use client';

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#e6f4f1] via-[#f2f9f8] to-[#ffffff] pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-900">Coord.Travel</h2>
            <p className="text-sm text-gray-600 mt-1">
              Seamless travel planning, all in one place.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-600">
            <Link href="/#terms-and-conditions" className="hover:text-[#287f71] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/#privacy-policy" className="hover:text-[#287f71] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/#refund-policy" className="hover:text-[#287f71] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Coord.Travel. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end space-x-5 mt-4 md:mt-0">
            <a href="#" aria-label="Twitter" className="hover:text-[#287f71] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.633 7.997c.014.21.014.423.014.636 0 6.5-4.946 13.994-13.994 13.994-2.779 0-5.366-.814-7.547-2.22a9.868 9.868 0 007.286-2.032 4.93 4.93 0 01-4.602-3.419c.303.045.608.07.92.07.448 0 .88-.06 1.294-.17A4.924 4.924 0 012.1 9.55v-.062a4.93 4.93 0 002.226.616A4.924 4.924 0 012.4 6.092c0-.91.246-1.763.676-2.496a13.984 13.984 0 0010.15 5.146 5.573 5.573 0 01-.122-1.126 4.924 4.924 0 018.513-3.365 9.75 9.75 0 003.12-1.192 4.93 4.93 0 01-2.164 2.72 9.862 9.862 0 002.834-.778 10.603 10.603 0 01-2.465 2.556z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[#287f71] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24H12.82V14.708h-3.07v-3.62h3.07V8.413c0-3.042 1.857-4.698 4.572-4.698 1.299 0 2.415.096 2.74.139v3.178l-1.88.001c-1.476 0-1.763.7-1.763 1.73v2.268h3.528l-.46 3.62h-3.068V24h6.012C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#287f71] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.403a4.92 4.92 0 011.77 1.145 4.92 4.92 0 011.145 1.77c.163.46.347 1.26.403 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.43a4.92 4.92 0 01-1.145 1.77 4.92 4.92 0 01-1.77 1.145c-.46.163-1.26.347-2.43.403-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.403a4.92 4.92 0 01-1.77-1.145 4.92 4.92 0 01-1.145-1.77c-.163-.46-.347-1.26-.403-2.43C2.175 15.584 2.163 15.2 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.43a4.92 4.92 0 011.145-1.77 4.92 4.92 0 011.77-1.145c.46-.163 1.26-.347 2.43-.403C8.416 2.175 8.8 2.163 12 2.163zm0 1.68c-3.15 0-3.517.012-4.75.07-.99.045-1.527.21-1.88.347-.472.183-.81.4-1.165.755a3.24 3.24 0 00-.755 1.165c-.137.353-.302.89-.347 1.88-.058 1.233-.07 1.6-.07 4.75s.012 3.517.07 4.75c.045.99.21 1.527.347 1.88.183.472.4.81.755 1.165.355.355.693.572 1.165.755.353.137.89.302 1.88.347 1.233.058 1.6.07 4.75.07s3.517-.012 4.75-.07c.99-.045 1.527-.21 1.88-.347.472-.183.81-.4 1.165-.755.355-.355.572-.693.755-1.165.137-.353.302-.89.347-1.88.058-1.233.07-1.6.07-4.75s-.012-3.517-.07-4.75c-.045-.99-.21-1.527-.347-1.88a3.24 3.24 0 00-.755-1.165 3.24 3.24 0 00-1.165-.755c-.353-.137-.89-.302-1.88-.347-1.233-.058-1.6-.07-4.75-.07zm0 3.897a5.94 5.94 0 110 11.88 5.94 5.94 0 010-11.88zm0 1.68a4.26 4.26 0 100 8.52 4.26 4.26 0 000-8.52zm6.406-2.844a1.386 1.386 0 110 2.772 1.386 1.386 0 010-2.772z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
