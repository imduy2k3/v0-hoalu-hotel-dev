import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { amenityLabels, amenityIcons } from "@/lib/amenities"
import { Users, Maximize } from "lucide-react"
import type { RoomType } from "@/lib/types"

interface RoomsGridProps {
  roomTypes: RoomType[]
}

export function RoomsGrid({ roomTypes }: RoomsGridProps) {
  const publishedRooms = roomTypes.filter((room) => room.isPublished)

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-bold text-hotel-black mb-2">
          {publishedRooms.length} loại phòng có sẵn
        </h2>
        <p className="text-gray-600">Chọn loại phòng phù hợp với nhu cầu của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-56">
              <Image 
                src={Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : "/placeholder.svg"} 
                alt={room.name} 
                fill 
                className="object-cover" 
              />
              <Badge className="absolute top-4 left-4 bg-hotel-gold text-white px-3 py-1 text-sm font-medium">
                {room.capacity} khách
              </Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="font-serif text-2xl font-bold text-hotel-black mb-3">{room.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{room.shortDesc}</p>

              {/* Room Details */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4 text-hotel-gold" />
                  <span className="font-medium">{room.capacity} khách</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Maximize className="h-4 w-4 text-hotel-gold" />
                  <span className="font-medium">{room.sizeSqm}m²</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">{room.bedType}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Array.isArray(room.amenities) && room.amenities.slice(0, 4).map((amenity) => {
                  const Icon = amenityIcons[amenity]
                  const label = amenityLabels[amenity]
                  
                  // Skip if icon or label doesn't exist
                  if (!Icon || !label) {
                    return null
                  }
                  
                  return (
                    <div key={amenity} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      <Icon className="h-3 w-3 text-hotel-gold" />
                      <span>{label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">Từ</span>
                  <div className="text-2xl font-bold text-hotel-gold">{room.basePrice.toLocaleString("vi-VN")}₫</div>
                  <span className="text-sm text-gray-500">/đêm</span>
                </div>
                <Button asChild className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-6 py-2 font-medium">
                  <Link href={`/rooms/${room.slug}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
