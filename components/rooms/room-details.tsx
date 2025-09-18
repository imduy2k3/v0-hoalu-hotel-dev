import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { amenityLabels, amenityIcons } from "@/lib/amenities"
import type { RoomType } from "@/lib/types"
import { Users, Maximize, Bed } from "lucide-react"

interface RoomDetailsProps {
  room: RoomType
}

export function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Room Title and Basic Info */}
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Phòng {room.name}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {room.capacity} khách
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {room.sizeSqm}m²
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            Giường {room.bedType}
          </Badge>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{room.longDesc}</p>
      </div>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Tiện nghi phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity]
              return (
                <div key={amenity} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-hotel-gold" />
                  <span className="text-gray-700">{amenityLabels[amenity]}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      {room.policies && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Chính sách phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{room.policies}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
