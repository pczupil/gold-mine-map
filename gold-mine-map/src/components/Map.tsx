'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Info, Globe } from 'lucide-react';

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

interface MapProps {
  mines: Mine[];
}

// Custom marker icon
const createCustomIcon = (type: string) => {
  const colors: { [key: string]: string } = {
    'Gold': '#FFD700',
    'Copper': '#B87333',
    'Copper & Gold': '#FFA500',
    'Copper, Uranium, Gold': '#FF6347',
    'Iron': '#8B4513',
    'Diamond': '#B9F2FF'
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

export default function Map({ mines }: MapProps) {
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
        {mines.map((mine) => (
          <Marker
            key={mine.id}
            position={[mine.latitude, mine.longitude]}
            icon={createCustomIcon(mine.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{mine.name}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Type:</span> {mine.type}</p>
                  <p><span className="font-semibold">Country:</span> {mine.country}</p>
                  {mine.region && (
                    <p><span className="font-semibold">Region:</span> {mine.region}</p>
                  )}
                  {mine.production && (
                    <p><span className="font-semibold">Production:</span> {mine.production}</p>
                  )}
                  <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      mine.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mine.status}
                    </span>
                  </p>
                  {mine.user && (
                    <p><span className="font-semibold">Added by:</span> {mine.user.name}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 