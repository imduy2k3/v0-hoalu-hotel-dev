import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hotel-exterior.jpg" alt="Hoa Lư City Hotel" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Về chúng tôi</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Khám phá câu chuyện và tầm nhìn của Hoa Lư City Hotel - nơi truyền thống gặp gỡ hiện đại
        </p>
      </div>
    </section>
  )
}
