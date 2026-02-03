'use client';

/**
 * Navbar Component
 * 
 * Top navigation bar with:
 * - Logo/brand
 * - Navigation links
 * - Auth buttons (Login/Register/Logout)
 * - Mobile menu toggle
 * - Responsive design
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  // Navigation links for authenticated users
  const authLinks = [
    { href: '/items', label: 'Browse Items' },
    { href: '/my-items', label: 'My Items' },
    { href: '/requests', label: 'Requests' },
    { href: '/messages', label: 'Messages' },
  ];

  // Navigation links for non-authenticated users
  const publicLinks = [
    { href: '/items', label: 'Browse Items' },
  ];

  const navLinks = user ? authLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          📚 LendHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-10 h-6 bg-gray-200 rounded animate-pulse" />
          ) : user ? (
            <>
              <Link href="/profile" className="text-sm text-gray-700 hover:text-blue-600">
                {user.name}
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {loading ? (
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex-1 text-center py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
