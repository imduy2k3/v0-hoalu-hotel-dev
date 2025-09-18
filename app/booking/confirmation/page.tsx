import { Suspense } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <BookingConfirmation />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
