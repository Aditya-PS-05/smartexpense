/**
 * Footer Component
 * 
 * Bottom footer with:
 * - Quick links
 * - Social links
 * - Copyright info
 */

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-blue-600 mb-4">📚 LendHub</h3>
            <p className="text-gray-600 text-sm">
              Community lending made simple and trustworthy
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/items" className="text-gray-600 hover:text-blue-600">
                  All Items
                </Link>
              </li>
              <li>
                <Link href="/items?category=Electronics" className="text-gray-600 hover:text-blue-600">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/items?category=Books" className="text-gray-600 hover:text-blue-600">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 hover:text-blue-600">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {currentYear} Neighborhood Lending Library. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-600">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
