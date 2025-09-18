import { notFound } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { RoomGallery } from "@/components/rooms/room-gallery"
import { RoomDetails } from "@/components/rooms/room-details"
import { RoomBookingCard } from "@/components/rooms/room-booking-card"

import { roomTypes } from "@/lib/client-data"

interface RoomPageProps {
  params: {
    slug: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  const room = roomTypes.find((r) => r.slug === params.slug && r.isPublished)

  if (!room) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <section className="bg-hotel-gray py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-600">
              <span>Trang chủ</span> / <span>Phòng</span> / <span className="text-hotel-gold">Phòng {room.name}</span>
            </nav>
          </div>
        </section>

        {/* Room Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <RoomGallery images={room.images} roomName={room.name} />
                <RoomDetails room={room} />
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <RoomBookingCard room={room} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
