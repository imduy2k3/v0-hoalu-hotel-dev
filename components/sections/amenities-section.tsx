import { amenityIcons, amenityLabels } from "@/lib/amenities"
import type { Amenity } from "@/lib/types"

const featuredAmenities: Amenity[] = ["wifi", "breakfast", "pool", "spa", "airport_pickup", "gym", "parking", "view"]

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
