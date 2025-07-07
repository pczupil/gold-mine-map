'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Search, Filter, BarChart3, Globe, MapPin, Info, User, LogOut, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

interface Mine {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  country: string;
  region?: string;
  production?: string;
  status: string;
  description?: string;
  website?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter mines based on selected filter and search term
  const filteredMines = mines.filter(mine => {
    const matchesFilter = selectedFilter === 'all' || mine.type.includes(selectedFilter);
    const matchesSearch = searchTerm === '' || 
      mine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mine.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mine.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mine.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total Mines', value: mines.length.toString(), icon: MapPin, color: 'text-blue-600' },
    { label: 'Active Mines', value: mines.filter(m => m.status === 'Active').length.toString(), icon: Globe, color: 'text-green-600' },
    { label: 'Countries', value: [...new Set(mines.map(m => m.country))].length.toString(), icon: BarChart3, color: 'text-purple-600' },
    { label: 'Mineral Types', value: [...new Set(mines.map(m => m.type))].length.toString(), icon: Info, color: 'text-orange-600' }
  ];

  // Filtered stats for display
  const filteredStats = [
    { label: 'Showing', value: filteredMines.length.toString(), icon: MapPin, color: 'text-blue-600' },
    { label: 'Active', value: filteredMines.filter(m => m.status === 'Active').length.toString(), icon: Globe, color: 'text-green-600' },
    { label: 'Countries', value: [...new Set(filteredMines.map(m => m.country))].length.toString(), icon: BarChart3, color: 'text-purple-600' },
    { label: 'Types', value: [...new Set(filteredMines.map(m => m.type))].length.toString(), icon: Info, color: 'text-orange-600' }
  ];

  const filters = [
    { id: 'all', label: 'All Mines' },
    { id: 'Gold', label: 'Gold' },
    { id: 'Copper', label: 'Copper' },
    { id: 'Iron', label: 'Iron' },
    { id: 'Diamond', label: 'Diamond' },
    { id: 'Silver', label: 'Silver' },
    { id: 'Platinum', label: 'Platinum' }
  ];

  // Fetch mines from API
  useEffect(() => {
    const fetchMines = async () => {
      try {
        const response = await fetch('/api/mines');
        if (response.ok) {
          const data = await response.json();
          setMines(data);
        }
      } catch (error) {
        console.error('Error fetching mines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMines();
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Gold Mine Map</h1>
          <p className="text-gray-600 mb-8">Sign in to access the global mineral mine tracking system</p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <div className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Search Bar (moved from header) */}
      <div className="flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search mines, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {filteredStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Mineral Type</h3>
            </div>
            <Link
              href="/mines/add"
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mine</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
            {(selectedFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Global Mine Locations</h2>
              {(selectedFilter !== 'all' || searchTerm) && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredMines.length} of {mines.length} mines
                  {selectedFilter !== 'all' && ` (filtered by ${selectedFilter})`}
                  {searchTerm && ` (searching for "${searchTerm}")`}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                <span>Gold</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                <span>Copper</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Mixed</span>
              </div>
            </div>
          </div>
          <Map mines={filteredMines} />
        </div>

        {/* Mobile-friendly info section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Map</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <ul className="space-y-1">
                <li>• Interactive global map of mineral mines</li>
                <li>• Real-time mine status and production data</li>
                <li>• Mobile-responsive design</li>
                <li>• Filter by mineral type and location</li>
                <li>• User authentication and data management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
              <ul className="space-y-1">
                <li>• Global mining databases</li>
                <li>• Government mining registries</li>
                <li>• Industry reports and publications</li>
                <li>• User-contributed data</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Globe className="w-5 h-5 mb-1" />
            <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
