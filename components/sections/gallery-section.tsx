import Image from "next/image"

const galleryImages = [
  {
    src: "/images/z6716141210451_98d4b5b24276541c59645b9a20c95b65.jpg",
    alt: "Hotel Interior",
    category: "interior"
  },
  {
    src: "/images/z6716141210459_1ef31243fe6913d3f6663a210f71d557.jpg",
    alt: "Hotel Lobby",
    category: "lobby"
  },
  {
    src: "/images/z6716141210460_771cb1a120f0c09d7ca85af079f8593d.jpg",
    alt: "Hotel Restaurant",
    category: "restaurant"
  },
  {
    src: "/images/z6716141210461_275e894070747b090c61c62ee7024c11.jpg",
    alt: "Hotel Bar",
    category: "bar"
  },
  {
    src: "/images/z6716141210462_c15ca94c895a0df80fc87e47b70d109d.jpg",
    alt: "Hotel Spa",
    category: "spa"
  },
  {
    src: "/images/z6716141210463_ee54e2c77e4b060996e560fd91070f52.jpg",
    alt: "Hotel Pool",
    category: "pool"
  },
  {
    src: "/images/z6716141210466_cc21cc4ea60d006e7c66ed6a4a36bd61.jpg",
    alt: "Hotel Garden",
    category: "garden"
  },
  {
    src: "/images/z6716141210468_285d9a096debd081b4baea450e04fb0a.jpg",
    alt: "Hotel Conference Room",
    category: "conference"
  }
]

export function GallerySection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Thư viện ảnh</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá không gian sang trọng và tiện nghi hiện đại của Hoa Lư City Hotel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className={`relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${index === 0 ? 'h-96' : 'h-48'}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-medium text-hotel-black capitalize">{image.category}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
