'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Info, Globe } from 'lucide-react';

// Sample mine data - in a real app, this would come from an API
const sampleMines = [
  {
    id: 1,
    name: "Carlin Gold Mine",
    type: "Gold",
    location: [40.7128, -116.1619],
    country: "USA",
    production: "1.2M oz/year",
    status: "Active"
  },
  {
    id: 2,
    name: "Grasberg Mine",
    type: "Copper & Gold",
    location: [-4.0584, 137.1164],
    country: "Indonesia",
    production: "2.5M oz gold/year",
    status: "Active"
  },
  {
    id: 3,
    name: "Olympic Dam",
    type: "Copper, Uranium, Gold",
    location: [-30.4444, 136.8869],
    country: "Australia",
    production: "200K oz gold/year",
    status: "Active"
  },
  {
    id: 4,
    name: "Escondida",
    type: "Copper",
    location: [-24.2667, -69.0833],
    country: "Chile",
    production: "1.2M tons copper/year",
    status: "Active"
  },
  {
    id: 5,
    name: "Oyu Tolgoi",
    type: "Copper & Gold",
    location: [43.0167, 106.8667],
    country: "Mongolia",
    production: "500K oz gold/year",
    status: "Active"
  }
];

// Custom marker icon
const createCustomIcon = (type: string) => {
  const colors: { [key: string]: string } = {
    'Gold': '#FFD700',
    'Copper': '#B87333',
    'Copper & Gold': '#FFA500',
    'Copper, Uranium, Gold': '#FF6347'
  };
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${colors[type] || '#666'}" stroke="#333" stroke-width="2"/>
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#333"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function Map() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sampleMines.map((mine) => (
          <Marker
            key={mine.id}
            position={mine.location as [number, number]}
            icon={createCustomIcon(mine.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{mine.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Type:</span> {mine.type}</p>
                  <p><span className="font-semibold">Country:</span> {mine.country}</p>
                  <p><span className="font-semibold">Production:</span> {mine.production}</p>
                  <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      mine.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mine.status}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 