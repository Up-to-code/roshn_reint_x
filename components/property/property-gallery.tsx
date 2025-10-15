"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  isRTL?: boolean;
}

export function PropertyGallery({ images, title, isRTL = false }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <div className="text-center text-muted-foreground">
          <div className="mb-2 text-4xl">🏠</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            fill
            className="cursor-pointer object-cover"
            onClick={() => setShowModal(true)}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 ${
                  isRTL ? 'left-auto right-4' : 'left-4'
                }`}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextImage}
                className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 ${
                  isRTL ? 'left-4 right-auto' : 'right-4'
                }`}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
        
        {images.length > 1 && (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-video overflow-hidden rounded-lg border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} ${index + 1}`}
                    width={200}
                    height={150}
                    className="size-full object-cover"
                  />
                </button>
              ))}
              {images.length > 4 && (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  +{images.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="size-8" />
            </button>
            
            <Image
              src={images[currentImageIndex]}
              alt={`${title} ${currentImageIndex + 1}`}
              width={800}
              height={600}
              className="max-h-full max-w-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 ${
                    isRTL ? 'left-auto right-4' : 'left-4'
                  }`}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  onClick={nextImage}
                  className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 ${
                    isRTL ? 'left-4 right-auto' : 'right-4'
                  }`}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
