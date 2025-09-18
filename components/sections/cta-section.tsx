import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-16 lg:py-24 bg-hotel-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">Đặt phòng để nhận ưu đãi sớm</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Đặt phòng ngay hôm nay để được hưởng mức giá ưu đãi và đảm bảo có phòng trong thời gian bạn mong muốn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-hotel-gold hover:bg-hotel-gold/90 text-white px-8 py-3 text-lg">
            <Link href="/booking">Đặt phòng ngay</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-hotel-black px-8 py-3 text-lg bg-transparent"
          >
            <Link href="/about#contact">Liên hệ tư vấn</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
