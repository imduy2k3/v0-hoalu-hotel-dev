import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { BookingForm } from "@/components/booking/booking-form"

export default function BookingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-hotel-gray py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-hotel-black mb-4">Đặt phòng</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Hoàn tất thông tin đặt phòng để trải nghiệm dịch vụ nghỉ dưỡng tuyệt vời tại Hoa Lư City Hotel
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BookingForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
