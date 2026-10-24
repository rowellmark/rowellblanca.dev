'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Loader2, ImageOff } from 'lucide-react';

interface BlobItem {
  url: string;
  pathname: string;
  uploadedAt: string;
  size: number;
}

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/admin/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBlobs(data.blobs);
      })
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-6">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-3xl w-full p-6 space-y-4 shadow-sm relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-950">Choose from Uploaded Photos</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : blobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-2">
            <ImageOff className="w-6 h-6" />
            <p className="text-xs font-bold">No uploaded photos yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {blobs.map((blob) => (
              <button
                key={blob.url}
                type="button"
                onClick={() => {
                  onSelect(blob.url);
                  onClose();
                }}
                className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 hover:ring-2 hover:ring-zinc-900 transition-all"
                title={blob.pathname}
              >
                <Image
                  src={blob.url}
                  alt={blob.pathname}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
