import Image from "next/image"
import { amenityIcons, amenityLabels } from "@/lib/amenities"
import type { Amenity } from "@/lib/types"

const featuredAmenities: Amenity[] = ["wifi", "breakfast", "pool", "spa", "airport_pickup", "gym", "parking", "view"]

const amenityImages = {
  wifi: "/images/z6716141210427_5465b21560cf79051f816b6bc267c6cb.jpg",
  breakfast: "/images/z6716141210428_330c680596fe933e3e735188f518890c.jpg",
  pool: "/images/z6716141210430_8c5aadb458ac80bb37f65a270b18d3fb.jpg",
  spa: "/images/z6716141210432_cd5ad464607daf554b2de5db9c63a888.jpg",
  airport_pickup: "/images/z6716141210437_b8e843fbaaa85748d90f655101fec6f1.jpg",
  gym: "/images/z6716141210438_91f60698bba9fa71e3c77c350392458d.jpg",
  parking: "/images/z6716141210441_1bb8bcd816f583ac77a943b9d90e8d68.jpg",
  view: "/images/z6716141210443_128c629a5f3a278ef788a2533bf2008e.jpg"
}

export function AmenitiesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Tiện nghi & Dịch vụ</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trải nghiệm đầy đủ các tiện nghi hiện đại và dịch vụ chăm sóc tận tình
          </p>
        </div>

        {/* Visual Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredAmenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity]
            return (
              <div key={amenity} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image 
                    src={amenityImages[amenity] || "/placeholder.svg"} 
                    alt={amenityLabels[amenity]} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-hotel-gold transition-colors duration-300">
                      <Icon className="h-8 w-8 text-hotel-gold group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-hotel-black text-center">{amenityLabels[amenity]}</h3>
                </div>
              </div>
            )
          })}
        </div>

        {/* Icon-based Amenities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredAmenities.map((amenity) => {
            const Icon = amenityIcons[amenity]
            return (
              <div key={amenity} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-hotel-gray rounded-full flex items-center justify-center group-hover:bg-hotel-gold transition-colors duration-300">
                  <Icon className="h-8 w-8 text-hotel-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-hotel-black">{amenityLabels[amenity]}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
