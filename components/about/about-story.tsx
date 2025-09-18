import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Heart, Star } from "lucide-react"

export function AboutStory() {
  const values = [
    {
      icon: Heart,
      title: "Tận tâm",
      description: "Phục vụ khách hàng với tất cả sự chân thành và nhiệt huyết",
    },
    {
      icon: Star,
      title: "Chất lượng",
      description: "Cam kết mang đến dịch vụ và trải nghiệm tốt nhất",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Đóng góp tích cực cho sự phát triển của địa phương",
    },
    {
      icon: Award,
      title: "Xuất sắc",
      description: "Không ngừng nâng cao chất lượng dịch vụ và tiện nghi",
    },
  ]

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-6">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Được thành lập vào năm 2020, Hoa Lư City Hotel ra đời với sứ mệnh mang đến trải nghiệm nghỉ dưỡng đẳng
                cấp quốc tế ngay tại trung tâm thành phố Ninh Bình - cửa ngõ của vùng đất cố đô Hoa Lư huyền thoại.
              </p>
              <p>
                Tọa lạc tại vị trí đắc địa, khách sạn không chỉ là nơi lưu trú mà còn là cầu nối giúp du khách khám phá
                vẻ đẹp thiên nhiên hùng vĩ và di sản văn hóa lịch sử phong phú của vùng đất này.
              </p>
              <p>
                Với đội ngũ nhân viên chuyên nghiệp và tận tâm, chúng tôi cam kết mang đến cho mỗi vị khách những kỷ
                niệm đáng nhớ và trải nghiệm dịch vụ hoàn hảo nhất.
              </p>
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

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 bg-hotel-gray">
            <CardContent className="p-0">
              <h3 className="font-serif text-2xl font-bold text-hotel-black mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 leading-relaxed">
                Trở thành khách sạn hàng đầu tại Ninh Bình, được khách hàng tin tưởng và lựa chọn bởi chất lượng dịch vụ
                xuất sắc, góp phần quảng bá vẻ đẹp của vùng đất cố đô Hoa Lư đến bạn bè quốc tế.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 bg-white border-2 border-hotel-gold">
            <CardContent className="p-0">
              <h3 className="font-serif text-2xl font-bold text-hotel-black mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed">
                Mang đến trải nghiệm nghỉ dưỡng đẳng cấp với dịch vụ tận tâm, tiện nghi hiện đại và không gian sang
                trọng, giúp mỗi chuyến đi của khách hàng trở nên ý nghĩa và đáng nhớ.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black text-center mb-12">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-hotel-gold rounded-full flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
