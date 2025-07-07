'use client';
import { useState } from 'react';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';

interface MinePhotoGalleryProps {
  mineId: string;
  initialPhotos?: { url: string }[];
  initialPhotoUrls?: string[];
  onUpload?: (url: string) => void;
}

export default function MinePhotoGallery({ mineId, initialPhotos = [], initialPhotoUrls = [], onUpload }: MinePhotoGalleryProps) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const handleUpload = (url: string) => {
    setPhotoUrls((prev) => [...prev, url]);
    if (onUpload) onUpload(url);
  };

  return (
    <div>
      {(initialPhotos.length || initialPhotoUrls.length || photoUrls.length) > 0 && (
        <div className="mb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {initialPhotos.map((photo, idx) => (
              <img
                key={photo.url + idx}
                src={photo.url}
                alt="Mine photo"
                className="w-24 h-20 object-cover rounded border"
              />
            ))}
            {initialPhotoUrls.map((url, idx) => (
              <img
                key={url + idx}
                src={url}
                alt="Mine photo"
                className="w-24 h-20 object-cover rounded border"
              />
            ))}
            {photoUrls.map((url, idx) => (
              <img
                key={url + idx}
                src={url}
                alt="Mine photo"
                className="w-24 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-2">
        <CloudinaryUploadWidget onUpload={handleUpload} />
      </div>
    </div>
  );
} 