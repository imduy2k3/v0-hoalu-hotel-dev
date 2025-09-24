import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { RoomsDataProvider } from "@/components/rooms/rooms-data-provider"
import { roomTypes as fallbackRoomTypes } from "@/lib/client-data"

export default function RoomsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-hotel-gray py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-hotel-black mb-4">Các loại phòng</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Khám phá các loại phòng được thiết kế tinh tế với đầy đủ tiện nghi hiện đại để mang đến trải nghiệm nghỉ
                dưỡng tuyệt vời
              </p>
            </div>
          </div>
        </section>

        {/* Rooms Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Rooms Grid - Full Width */}
            <RoomsDataProvider initialRoomTypes={fallbackRoomTypes} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
