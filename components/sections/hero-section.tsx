import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hotel-exterior.jpg" alt="Hoa Lư City Hotel" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">Hoa Lư City Hotel</h1>
        <p className="font-serif text-xl md:text-2xl lg:text-3xl mb-4 text-hotel-gold">Sang trọng & Trang nhã</p>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
          Trải nghiệm nghỉ dưỡng đẳng cấp quốc tế tại trung tâm thành phố, gần cố đô Hoa Lư với dịch vụ 4 sao và tầm
          nhìn tuyệt đẹp
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-8 py-3 text-lg">
            <Link href="/rooms">Khám phá phòng</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-hotel-black px-8 py-3 text-lg bg-transparent"
          >
            <Link href="/booking">Đặt phòng ngay</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
