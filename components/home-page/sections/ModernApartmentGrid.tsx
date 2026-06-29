// components/ModernApartmentGrid.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ModernApartmentCard from './ModernApartmentCard';

interface Apartment {
  id: string;
  title: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  yearBuilt: number;
  parking: boolean;
  type: 'condo' | 'apartment' | 'loft';
  status: 'available' | 'sold' | 'pending';
}

interface ModernApartmentGridProps {
  apartments: Apartment[];
  onViewDetails: (apartment: Apartment) => void;
  onContactAgent: (apartment: Apartment) => void;
}

const ModernApartmentGrid: React.FC<ModernApartmentGridProps> = ({
  apartments,
  onViewDetails,
  onContactAgent,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.apartment-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }
  }, [apartments]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Premium Apartments for Sale
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Discover modern living spaces in prime locations with exceptional amenities
        </p>
        
        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{apartments.length}</div>
            <div className="text-gray-600">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">
              {apartments.filter(a => a.status === 'available').length}
            </div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* Apartments Grid */}
      <div ref={gridRef} className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {apartments.map((apartment) => (
          <ModernApartmentCard
            key={apartment.id}
            apartment={apartment}
            onViewDetails={onViewDetails}
            onContactAgent={onContactAgent}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernApartmentGrid;