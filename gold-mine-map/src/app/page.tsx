'use client';

import { useState } from 'react';
import { Search, Filter, BarChart3, Globe, MapPin, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats = [
    { label: 'Total Mines', value: '1,247', icon: MapPin, color: 'text-blue-600' },
    { label: 'Active Mines', value: '1,089', icon: Globe, color: 'text-green-600' },
    { label: 'Countries', value: '67', icon: BarChart3, color: 'text-purple-600' },
    { label: 'Mineral Types', value: '12', icon: Info, color: 'text-orange-600' }
  ];

  const filters = [
    { id: 'all', label: 'All Mines' },
    { id: 'gold', label: 'Gold' },
    { id: 'copper', label: 'Copper' },
    { id: 'iron', label: 'Iron' },
    { id: 'diamond', label: 'Diamond' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mines, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
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
          <div className="flex items-center mb-3">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filter by Mineral Type</h3>
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
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Global Mine Locations</h2>
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
          <Map />
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
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
              <ul className="space-y-1">
                <li>• Global mining databases</li>
                <li>• Government mining registries</li>
                <li>• Industry reports and publications</li>
                <li>• Updated quarterly</li>
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
            <Info className="w-5 h-5 mb-1" />
            <span className="text-xs">Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
