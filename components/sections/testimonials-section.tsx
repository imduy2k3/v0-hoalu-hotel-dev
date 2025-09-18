import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    location: "Hà Nội",
    rating: 5,
    comment:
      "Khách sạn rất đẹp và sang trọng. Nhân viên phục vụ nhiệt tình, phòng ốc sạch sẽ. Vị trí thuận tiện để tham quan cố đô Hoa Lư.",
    avatar: "/vietnamese-man-avatar.jpg",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    comment:
      "Trải nghiệm tuyệt vời! Phòng suite rộng rãi, tầm nhìn đẹp. Bữa sáng đa dạng và ngon miệng. Chắc chắn sẽ quay lại.",
    avatar: "/vietnamese-woman-avatar.jpg",
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    location: "Đà Nẵng",
    rating: 5,
    comment:
      "Dịch vụ chuyên nghiệp, không gian yên tĩnh. Rất phù hợp cho chuyến công tác và nghỉ dưỡng. Giá cả hợp lý.",
    avatar: "/vietnamese-businessman-avatar.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-hotel-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Đánh giá từ khách hàng</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ tại khách sạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-hotel-gold text-hotel-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-hotel-black">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
