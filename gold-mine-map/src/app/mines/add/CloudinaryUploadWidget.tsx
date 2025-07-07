import { useState } from 'react';

export default function CloudinaryUploadWidget({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const openWidget = () => {
    setUploading(true);
    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: 'YOUR_CLOUD_NAME', // TODO: Replace with your Cloudinary cloud name
        uploadPreset: 'mines_unsigned', // TODO: Replace with your unsigned preset name
        sources: ['local', 'url', 'camera'],
        multiple: true,
        folder: 'mines',
        cropping: false,
        maxFiles: 10,
      },
      (error: any, result: any) => {
        setUploading(false);
        if (!error && result && result.event === 'success') {
          onUpload(result.info.secure_url);
        }
      }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={openWidget}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Photo(s)'}
      </button>
    </div>
  );
} 