"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { amenityLabels, amenityIcons } from "@/lib/amenities"
import { RoomType } from "@/lib/types"
import { roomTypes as fallbackRoomTypes } from "@/lib/client-data"
import { Loader2, TrendingUp } from "lucide-react"

interface PopularRoomType extends RoomType {
  bookingCount: number
  avgBookingAmount: number
}

export function FeaturedRoomsSectionWithAPI() {
  const [popularRooms, setPopularRooms] = useState<PopularRoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopularRooms = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/room-types/popular')
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Popular rooms data:', data)
          setPopularRooms(data)
        } else {
          console.error('❌ API response not ok:', response.status, response.statusText)
          throw new Error('Failed to fetch popular room types')
        }
      } catch (err) {
        console.error('Error fetching popular rooms:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Fallback to first 3 rooms from client data
        setPopularRooms(fallbackRoomTypes.slice(0, 3).map(room => ({
          ...room,
          bookingCount: 0,
          avgBookingAmount: 0
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchPopularRooms()
  }, [])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-hotel-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Loại phòng nổi bật</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá các loại phòng được thiết kế tinh tế với đầy đủ tiện nghi hiện đại
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-hotel-gold" />
            <span className="ml-2 text-gray-600">Đang tải phòng phổ biến...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-hotel-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Loại phòng nổi bật</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {error ? 
              "Khám phá các loại phòng được thiết kế tinh tế với đầy đủ tiện nghi hiện đại" :
              "Các loại phòng được đặt nhiều nhất bởi khách hàng"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRooms.map((room, index) => (
            <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-64">
                <Image 
                  src={Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : "/placeholder.svg"} 
                  alt={room.name} 
                  fill 
                  className="object-cover" 
                />
                {/* Popular badge */}
                {!error && room.bookingCount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-hotel-gold text-white px-3 py-1 text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    #{index + 1} Phổ biến
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{room.shortDesc}</p>


                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(room.amenities) && room.amenities.slice(0, 3).map((amenity) => {
                    const Icon = amenityIcons[amenity]
                    const label = amenityLabels[amenity]
                    
                    if (!Icon || !label) return null
                    
                    return (
                      <div key={amenity} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        <Icon className="h-3 w-3 text-hotel-gold" />
                        <span>{label}</span>
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
