import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { amenityLabels, amenityIcons } from "@/lib/amenities"
import { RoomType } from "@/lib/types"

interface FeaturedRoomsSectionProps {
  roomTypes: RoomType[]
}

export function FeaturedRoomsSection({ roomTypes }: FeaturedRoomsSectionProps) {
  // Get first 3 rooms as featured rooms
  const featuredRooms = roomTypes.slice(0, 3)

  return (
    <section className="py-16 lg:py-24 bg-hotel-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Loại phòng nổi bật</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá các loại phòng được thiết kế tinh tế với đầy đủ tiện nghi hiện đại
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <Image src={room.images[0] || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{room.shortDesc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity) => {
                    const Icon = amenityIcons[amenity]
                    return (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon className="h-3 w-3" />
                        <span>{amenityLabels[amenity]}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Từ</span>
                    <div className="text-xl font-bold text-hotel-gold">{room.basePrice.toLocaleString("vi-VN")}₫</div>
                    <span className="text-sm text-gray-500">/đêm</span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white bg-transparent"
                  >
                    <Link href={`/rooms/${room.slug}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-hotel-gold hover:bg-hotel-gold/90 text-white">
            <Link href="/rooms">Xem tất cả phòng</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
