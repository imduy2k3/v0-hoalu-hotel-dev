import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { roomTypes } from "@/lib/data"
import { amenityLabels, amenityIcons } from "@/lib/amenities"
import { Users, Maximize } from "lucide-react"

export function RoomsGrid() {
  const publishedRooms = roomTypes.filter((room) => room.isPublished)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{publishedRooms.length} loại phòng có sẵn</p>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Sắp xếp theo giá: Thấp đến cao</option>
          <option>Sắp xếp theo giá: Cao đến thấp</option>
          <option>Sắp xếp theo tên</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {publishedRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <Image src={room.images[0] || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
              <Badge className="absolute top-3 left-3 bg-hotel-gold text-white">{room.capacity} khách</Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">Phòng {room.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{room.shortDesc}</p>

              {/* Room Details */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{room.capacity} khách</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  <span>{room.sizeSqm}m²</span>
                </div>
                <span>{room.bedType}</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity) => {
                  const Icon = amenityIcons[amenity]
                  return (
                    <div key={amenity} className="flex items-center gap-1 text-xs text-gray-500">
                      <Icon className="h-3 w-3" />
                      <span>{amenityLabels[amenity]}</span>
                    </div>
                  )
                })}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Từ</span>
                  <div className="text-xl font-bold text-hotel-gold">{room.basePrice.toLocaleString("vi-VN")}₫</div>
                  <span className="text-sm text-gray-500">/đêm</span>
                </div>
                <Button asChild className="bg-hotel-gold hover:bg-hotel-gold/90 text-white">
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
