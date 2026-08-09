"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  isRTL: boolean;
}

export default function PropertyImageGallery({ 
  images, 
  title,
  isRTL 
}: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <Building className="size-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image 
          src={images[currentImageIndex]} 
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority={currentImageIndex === 0}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={prevImage}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={nextImage}
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative shrink-0 overflow-hidden rounded-md border-2 transition-all hover:border-primary ${
                index === currentImageIndex 
                  ? 'border-primary ring-2 ring-primary ring-offset-2' 
                  : 'border-muted-foreground/20'
              }`}
              onClick={() => goToImage(index)}
            >
              <div className="relative size-20 md:size-24">
                <Image 
                  src={image} 
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}