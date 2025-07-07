'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  MapPin, 
  Globe, 
  Building, 
  FileText, 
  Link as LinkIcon, 
  Save, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryUploadWidget from '../../../components/CloudinaryUploadWidget';

interface MineFormData {
  name: string;
  type: string;
  latitude: string;
  longitude: string;
  country: string;
  region: string;
  production: string;
  status: string;
  description: string;
  website: string;
}

interface DMSCoordinates {
  latDegrees: string;
  latMinutes: string;
  latSeconds: string;
  latDirection: 'N' | 'S';
  lngDegrees: string;
  lngMinutes: string;
  lngSeconds: string;
  lngDirection: 'E' | 'W';
}

export default function AddMine() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<MineFormData>({
    name: '',
    type: 'Gold',
    latitude: '',
    longitude: '',
    country: '',
    region: '',
    production: '',
    status: 'Active',
    description: '',
    website: ''
  });

  const [dmsCoordinates, setDmsCoordinates] = useState<DMSCoordinates>({
    latDegrees: '',
    latMinutes: '',
    latSeconds: '',
    latDirection: 'N',
    lngDegrees: '',
    lngMinutes: '',
    lngSeconds: '',
    lngDirection: 'W'
  });

  const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms' | 'string'>('decimal');
  const [coordinateString, setCoordinateString] = useState({ latitude: '', longitude: '' });
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const mineTypes = [
    'Gold', 'Copper', 'Iron', 'Diamond', 'Silver', 
    'Copper & Gold', 'Copper, Uranium, Gold', 'Platinum'
  ];

  const countries = [
    'USA', 'Canada', 'Australia', 'Chile', 'Peru', 'Brazil',
    'South Africa', 'Ghana', 'Mali', 'Tanzania', 'DRC',
    'Russia', 'China', 'Indonesia', 'Papua New Guinea',
    'Mongolia', 'Kazakhstan', 'Uzbekistan', 'Botswana',
    'Angola', 'Namibia', 'Zimbabwe', 'Mexico', 'Argentina'
  ];

  // Convert DMS to decimal degrees
  const dmsToDecimal = (degrees: number, minutes: number, seconds: number, direction: string): number => {
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
    return decimal;
  };

  // Convert decimal degrees to DMS
  const decimalToDms = (decimal: number, isLatitude: boolean): { degrees: number; minutes: number; seconds: number; direction: string } => {
    const absDecimal = Math.abs(decimal);
    const degrees = Math.floor(absDecimal);
    const minutes = Math.floor((absDecimal - degrees) * 60);
    const seconds = ((absDecimal - degrees - minutes / 60) * 3600);
    
    let direction = '';
    if (isLatitude) {
      direction = decimal >= 0 ? 'N' : 'S';
    } else {
      direction = decimal >= 0 ? 'E' : 'W';
    }
    
    return { degrees, minutes, seconds, direction };
  };

  // Update decimal coordinates when DMS changes
  const updateDecimalFromDms = () => {
    const latDeg = parseFloat(dmsCoordinates.latDegrees) || 0;
    const latMin = parseFloat(dmsCoordinates.latMinutes) || 0;
    const latSec = parseFloat(dmsCoordinates.latSeconds) || 0;
    const latDec = dmsToDecimal(latDeg, latMin, latSec, dmsCoordinates.latDirection);
    
    const lngDeg = parseFloat(dmsCoordinates.lngDegrees) || 0;
    const lngMin = parseFloat(dmsCoordinates.lngMinutes) || 0;
    const lngSec = parseFloat(dmsCoordinates.lngSeconds) || 0;
    const lngDec = dmsToDecimal(lngDeg, lngMin, lngSec, dmsCoordinates.lngDirection);
    
    setFormData(prev => ({
      ...prev,
      latitude: latDec.toString(),
      longitude: lngDec.toString()
    }));
  };

  // Update DMS coordinates when decimal changes
  const updateDmsFromDecimal = () => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (!isNaN(lat)) {
      const latDms = decimalToDms(lat, true);
      setDmsCoordinates(prev => ({
        ...prev,
        latDegrees: latDms.degrees.toString(),
        latMinutes: latDms.minutes.toString(),
        latSeconds: latDms.seconds.toFixed(2),
        latDirection: latDms.direction as 'N' | 'S'
      }));
    }
    
    if (!isNaN(lng)) {
      const lngDms = decimalToDms(lng, false);
      setDmsCoordinates(prev => ({
        ...prev,
        lngDegrees: lngDms.degrees.toString(),
        lngMinutes: lngDms.minutes.toString(),
        lngSeconds: lngDms.seconds.toFixed(2),
        lngDirection: lngDms.direction as 'E' | 'W'
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Parse coordinate string like "392008N" to DMS
  const parseCoordinateString = (coordString: string, isLatitude: boolean): { degrees: number; minutes: number; seconds: number; direction: string } | null => {
    // Remove any spaces and convert to uppercase
    const cleanString = coordString.replace(/\s/g, '').toUpperCase();
    
    // Match patterns like: 392008N, 39.2008N, 39°20'08"N, 39 20 08N
    const patterns = [
      // DDMMSSN format (e.g., 392008N)
      /^(\d{1,2})(\d{2})(\d{2})([NS])$/,
      // DD.MMSSN format (e.g., 39.2008N)
      /^(\d{1,2})\.(\d{2})(\d{2})([NS])$/,
      // DD MM SSN format (e.g., 39 20 08N)
      /^(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})([NS])$/,
      // DD°MM'SS"N format (e.g., 39°20'08"N)
      /^(\d{1,2})°(\d{1,2})'(\d{1,2})"([NS])$/,
      // DDMMSS.N format (e.g., 392008.5N)
      /^(\d{1,2})(\d{2})(\d{2})\.(\d+)([NS])$/,
      // DD.MMSS.N format (e.g., 39.2008.5N)
      /^(\d{1,2})\.(\d{2})(\d{2})\.(\d+)([NS])$/
    ];

    for (const pattern of patterns) {
      const match = cleanString.match(pattern);
      if (match) {
        const degrees = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseFloat(match[3] || '0');
        const direction = match[4];

        // Validate ranges
        if (isLatitude) {
          if (degrees < 0 || degrees > 90) return null;
        } else {
          if (degrees < 0 || degrees > 180) return null;
        }
        if (minutes < 0 || minutes >= 60) return null;
        if (seconds < 0 || seconds >= 60) return null;

        return { degrees, minutes, seconds, direction };
      }
    }

    // Try longitude patterns (E/W)
    if (!isLatitude) {
      const lngPatterns = [
        /^(\d{1,3})(\d{2})(\d{2})([EW])$/,
        /^(\d{1,3})\.(\d{2})(\d{2})([EW])$/,
        /^(\d{1,3})\s+(\d{1,2})\s+(\d{1,2})([EW])$/,
        /^(\d{1,3})°(\d{1,2})'(\d{1,2})"([EW])$/,
        /^(\d{1,3})(\d{2})(\d{2})\.(\d+)([EW])$/,
        /^(\d{1,3})\.(\d{2})(\d{2})\.(\d+)([EW])$/
      ];

      for (const pattern of lngPatterns) {
        const match = cleanString.match(pattern);
        if (match) {
          const degrees = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseFloat(match[3] || '0');
          const direction = match[4];

          if (degrees < 0 || degrees > 180) return null;
          if (minutes < 0 || minutes >= 60) return null;
          if (seconds < 0 || seconds >= 60) return null;

          return { degrees, minutes, seconds, direction };
        }
      }
    }

    return null;
  };

  const handleDmsChange = (field: keyof DMSCoordinates, value: string) => {
    setDmsCoordinates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoordinateStringChange = (type: 'latitude' | 'longitude', value: string) => {
    setCoordinateString(prev => ({
      ...prev,
      [type]: value
    }));

    // Parse the coordinate string
    const parsed = parseCoordinateString(value, type === 'latitude');
    if (parsed) {
      // Update DMS coordinates
      if (type === 'latitude') {
        setDmsCoordinates(prev => ({
          ...prev,
          latDegrees: parsed.degrees.toString(),
          latMinutes: parsed.minutes.toString(),
          latSeconds: parsed.seconds.toFixed(2),
          latDirection: parsed.direction as 'N' | 'S'
        }));
      } else {
        setDmsCoordinates(prev => ({
          ...prev,
          lngDegrees: parsed.degrees.toString(),
          lngMinutes: parsed.minutes.toString(),
          lngSeconds: parsed.seconds.toFixed(2),
          lngDirection: parsed.direction as 'E' | 'W'
        }));
      }
      
      // Update decimal coordinates
      setTimeout(updateDecimalFromDms, 100);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Mine name is required');
      return false;
    }
    if (!formData.country.trim()) {
      setError('Country is required');
      return false;
    }

    let lat: number, lng: number;

    if (coordinateFormat === 'decimal') {
      if (!formData.latitude || !formData.longitude) {
        setError('Latitude and longitude are required');
        return false;
      }
      lat = parseFloat(formData.latitude);
      lng = parseFloat(formData.longitude);
    } else if (coordinateFormat === 'dms') {
      // Validate DMS coordinates
      if (!dmsCoordinates.latDegrees || !dmsCoordinates.lngDegrees) {
        setError('Latitude and longitude coordinates are required');
        return false;
      }
      
      const latDeg = parseFloat(dmsCoordinates.latDegrees);
      const latMin = parseFloat(dmsCoordinates.latMinutes) || 0;
      const latSec = parseFloat(dmsCoordinates.latSeconds) || 0;
      const lngDeg = parseFloat(dmsCoordinates.lngDegrees);
      const lngMin = parseFloat(dmsCoordinates.lngMinutes) || 0;
      const lngSec = parseFloat(dmsCoordinates.lngSeconds) || 0;

      if (isNaN(latDeg) || latDeg < 0 || latDeg > 90) {
        setError('Latitude degrees must be between 0 and 90');
        return false;
      }
      if (isNaN(lngDeg) || lngDeg < 0 || lngDeg > 180) {
        setError('Longitude degrees must be between 0 and 180');
        return false;
      }
      if (latMin < 0 || latMin >= 60) {
        setError('Latitude minutes must be between 0 and 59');
        return false;
      }
      if (lngMin < 0 || lngMin >= 60) {
        setError('Longitude minutes must be between 0 and 59');
        return false;
      }
      if (latSec < 0 || latSec >= 60) {
        setError('Latitude seconds must be between 0 and 59');
        return false;
      }
      if (lngSec < 0 || lngSec >= 60) {
        setError('Longitude seconds must be between 0 and 59');
        return false;
      }

      lat = dmsToDecimal(latDeg, latMin, latSec, dmsCoordinates.latDirection);
      lng = dmsToDecimal(lngDeg, lngMin, lngSec, dmsCoordinates.lngDirection);
    } else {
      // Validate coordinate strings
      if (!coordinateString.latitude || !coordinateString.longitude) {
        setError('Latitude and longitude coordinates are required');
        return false;
      }

      const latParsed = parseCoordinateString(coordinateString.latitude, true);
      const lngParsed = parseCoordinateString(coordinateString.longitude, false);

      if (!latParsed) {
        setError('Invalid latitude format. Use formats like: 392008N, 39.2008N, 39°20\'08"N');
        return false;
      }
      if (!lngParsed) {
        setError('Invalid longitude format. Use formats like: 1160908W, 116.0908W, 116°09\'08"W');
        return false;
      }

      lat = dmsToDecimal(latParsed.degrees, latParsed.minutes, latParsed.seconds, latParsed.direction);
      lng = dmsToDecimal(lngParsed.degrees, lngParsed.minutes, lngParsed.seconds, lngParsed.direction);
    }
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return false;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      let finalLat: number, finalLng: number;

      if (coordinateFormat === 'decimal') {
        finalLat = parseFloat(formData.latitude);
        finalLng = parseFloat(formData.longitude);
      } else if (coordinateFormat === 'dms') {
        // Convert DMS to decimal for submission
        const latDeg = parseFloat(dmsCoordinates.latDegrees);
        const latMin = parseFloat(dmsCoordinates.latMinutes) || 0;
        const latSec = parseFloat(dmsCoordinates.latSeconds) || 0;
        const lngDeg = parseFloat(dmsCoordinates.lngDegrees);
        const lngMin = parseFloat(dmsCoordinates.lngMinutes) || 0;
        const lngSec = parseFloat(dmsCoordinates.lngSeconds) || 0;

        finalLat = dmsToDecimal(latDeg, latMin, latSec, dmsCoordinates.latDirection);
        finalLng = dmsToDecimal(lngDeg, lngMin, lngSec, dmsCoordinates.lngDirection);
      } else {
        // Parse coordinate strings
        const latParsed = parseCoordinateString(coordinateString.latitude, true);
        const lngParsed = parseCoordinateString(coordinateString.longitude, false);

        if (latParsed && lngParsed) {
          finalLat = dmsToDecimal(latParsed.degrees, latParsed.minutes, latParsed.seconds, latParsed.direction);
          finalLng = dmsToDecimal(lngParsed.degrees, lngParsed.minutes, lngParsed.seconds, lngParsed.direction);
        } else {
          throw new Error('Invalid coordinate format');
        }
      }

      const response = await fetch('/api/mines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: finalLat,
          longitude: finalLng,
          photoUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create mine');
      } else {
        setSuccess('Mine created successfully! Redirecting to map...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to add mines to the map.</p>
          <Link
            href="/auth/signin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Mine</h1>
            <p className="text-sm text-gray-600">Contribute to the global mine database</p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Mine Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Carlin Gold Mine"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Mineral Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {mineTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Location
              </h3>
              {/* Coordinate Format Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordinate Format
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="coordinateFormat"
                      value="decimal"
                      checked={coordinateFormat === 'decimal'}
                      onChange={() => setCoordinateFormat('decimal')}
                      className="mr-2"
                    />
                    <span className="text-sm">Decimal Degrees</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="coordinateFormat"
                      value="dms"
                      checked={coordinateFormat === 'dms'}
                      onChange={() => setCoordinateFormat('dms')}
                      className="mr-2"
                    />
                    <span className="text-sm">Degrees, Minutes, Seconds</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="coordinateFormat"
                      value="string"
                      checked={coordinateFormat === 'string'}
                      onChange={() => setCoordinateFormat('string')}
                      className="mr-2"
                    />
                    <span className="text-sm">Coordinate String (e.g., 392008N, 1204710W)</span>
                  </label>
                </div>
              </div>

              {coordinateFormat === 'decimal' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Decimal format fields */}
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      id="latitude"
                      name="latitude"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      id="longitude"
                      name="longitude"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., -116.1619"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                      Region/State
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Nevada"
                    />
                  </div>
                </div>
              )}

              {coordinateFormat === 'dms' && (
                <div className="space-y-4">
                  {/* DMS format fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (N/S) *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={dmsCoordinates.latDegrees}
                          onChange={(e) => { handleDmsChange('latDegrees', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="°"
                        />
                        <label className="block text-xs text-gray-500 mt-1">Degrees</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={dmsCoordinates.latMinutes}
                          onChange={(e) => { handleDmsChange('latMinutes', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="'"
                        />
                        <label className="block text-xs text-gray-500 mt-1">Minutes</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          step="0.01"
                          value={dmsCoordinates.latSeconds}
                          onChange={(e) => { handleDmsChange('latSeconds', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder='"'
                        />
                        <label className="block text-xs text-gray-500 mt-1">Seconds</label>
                      </div>
                      <div>
                        <select
                          value={dmsCoordinates.latDirection}
                          onChange={(e) => { handleDmsChange('latDirection', e.target.value as 'N' | 'S'); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="N">N</option>
                          <option value="S">S</option>
                        </select>
                        <label className="block text-xs text-gray-500 mt-1">Direction</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (E/W) *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="180"
                          value={dmsCoordinates.lngDegrees}
                          onChange={(e) => { handleDmsChange('lngDegrees', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="°"
                        />
                        <label className="block text-xs text-gray-500 mt-1">Degrees</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={dmsCoordinates.lngMinutes}
                          onChange={(e) => { handleDmsChange('lngMinutes', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="'"
                        />
                        <label className="block text-xs text-gray-500 mt-1">Minutes</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          step="0.01"
                          value={dmsCoordinates.lngSeconds}
                          onChange={(e) => { handleDmsChange('lngSeconds', e.target.value); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder='"'
                        />
                        <label className="block text-xs text-gray-500 mt-1">Seconds</label>
                      </div>
                      <div>
                        <select
                          value={dmsCoordinates.lngDirection}
                          onChange={(e) => { handleDmsChange('lngDirection', e.target.value as 'E' | 'W'); setTimeout(updateDecimalFromDms, 100); }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="E">E</option>
                          <option value="W">W</option>
                        </select>
                        <label className="block text-xs text-gray-500 mt-1">Direction</label>
                      </div>
                    </div>
                  </div>
                  {/* Country and Region */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                        Region/State
                      </label>
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Nevada"
                      />
                    </div>
                  </div>
                  {/* Decimal Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Decimal Preview:</strong> {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                </div>
              )}

              {coordinateFormat === 'string' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Supported Formats:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>DDMMSSN:</strong> 392008N, 1204710W</li>
                      <li>• <strong>DD.MMSSN:</strong> 39.2008N, 120.4710W</li>
                      <li>• <strong>DD MM SSN:</strong> 39 20 08N, 120 47 10W</li>
                      <li>• <strong>DD°MM'SS"N:</strong> 39°20'08"N, 120°47'10"W</li>
                      <li>• <strong>With decimals:</strong> 392008.5N, 1204710.5W</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude String *
                      </label>
                      <input
                        type="text"
                        value={coordinateString.latitude}
                        onChange={(e) => handleCoordinateStringChange('latitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 392008N"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: DDMMSSN (e.g., 392008N for 39°20'08"N)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude String *
                      </label>
                      <input
                        type="text"
                        value={coordinateString.longitude}
                        onChange={(e) => handleCoordinateStringChange('longitude', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1204710W"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: DDDMMSSW (e.g., 1204710W for 120°47'10"W)</p>
                    </div>
                  </div>
                  {/* Country and Region */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                        Region/State
                      </label>
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Nevada"
                      />
                    </div>
                  </div>
                  {/* Parsed Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Parsed Coordinates:</strong> {formData.latitude}, {formData.longitude}
                    </p>
                    {dmsCoordinates.latDegrees && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>DMS Format:</strong> {dmsCoordinates.latDegrees}°{dmsCoordinates.latMinutes}'{dmsCoordinates.latSeconds}"{dmsCoordinates.latDirection}, {dmsCoordinates.lngDegrees}°{dmsCoordinates.lngMinutes}'{dmsCoordinates.lngSeconds}"{dmsCoordinates.lngDirection}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Production & Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Production & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="production" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Production
                  </label>
                  <input
                    type="text"
                    id="production"
                    name="production"
                    value={formData.production}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1.2M oz/year"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Planned">Planned</option>
                    <option value="Development">Development</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Description
              </h3>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the mine, its history, operations, or any other relevant information..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🖼️</span> Photos
              </h3>
              <CloudinaryUploadWidget onUpload={(url) => setPhotoUrls((prev) => [...prev, url])} />
              <div className="flex flex-wrap gap-2 mt-2">
                {photoUrls.map((url) => (
                  <img key={url} src={url} alt="Mine photo" className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Globe className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Mine
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 