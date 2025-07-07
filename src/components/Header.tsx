"use client";
import { useSession, signOut } from 'next-auth/react';
import { MapPin, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header({ children }: { children?: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gold Mine Map</h1>
              <p className="text-sm text-gray-600">Global Mineral Tracking</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {children}
            {/* User Menu */}
            {session && (
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 