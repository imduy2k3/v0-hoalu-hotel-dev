import Image from "next/image"

export function IntroSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-6">
              Chào mừng đến với Hoa Lư City Hotel
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Tọa lạc tại vị trí đắc địa trong trung tâm thành phố Ninh Bình, Hoa Lư City Hotel mang đến cho quý khách
              trải nghiệm nghỉ dưỡng sang trọng với dịch vụ 4 sao đẳng cấp quốc tế.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Chỉ cách cố đô Hoa Lư vài phút di chuyển, khách sạn là điểm dừng chân lý tưởng để khám phá vẻ đẹp thiên
              nhiên và văn hóa lịch sử của vùng đất cố đô.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-hotel-gold mb-2">4★</div>
                <div className="text-sm text-gray-600">Khách sạn</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-hotel-gold mb-2">50+</div>
                <div className="text-sm text-gray-600">Phòng nghỉ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-hotel-gold mb-2">24/7</div>
                <div className="text-sm text-gray-600">Dịch vụ</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/reception.jpg"
              alt="Sảnh khách sạn Hoa Lư"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
