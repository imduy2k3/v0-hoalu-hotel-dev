import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Car, Plane } from "lucide-react"

export function AboutLocation() {
  const attractions = [
    { name: "Cố đô Hoa Lư", distance: "5 km", time: "10 phút" },
    { name: "Tràng An", distance: "8 km", time: "15 phút" },
    { name: "Tam Cốc - Bích Động", distance: "12 km", time: "20 phút" },
    { name: "Chùa Bái Đính", distance: "15 km", time: "25 phút" },
    { name: "Hang Múa", distance: "10 km", time: "18 phút" },
    { name: "Sân bay Nội Bài", distance: "95 km", time: "1.5 giờ" },
  ]

  return (
    <section className="py-16 lg:py-24 bg-hotel-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Vị trí đắc địa</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tọa lạc tại trung tâm thành phố Ninh Bình, thuận tiện di chuyển đến các điểm du lịch nổi tiếng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096890000000!2d105.97469!3d20.25789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135170c4c8f3c4b%3A0x123456789!2sNinh%20Binh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vị trí Hoa Lư City Hotel"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <div>
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-6 w-6 text-hotel-gold mt-1" />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường Trần Hưng Đạo</p>
                  <p className="text-gray-600">Phường Đông Thành, TP. Ninh Bình</p>
                  <p className="text-gray-600">Tỉnh Ninh Bình, Việt Nam</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-hotel-gold mt-1" />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-hotel-black mb-2">Giờ làm việc</h3>
                  <p className="text-gray-600">Lễ tân: 24/7</p>
                  <p className="text-gray-600">Check-in: 14:00 - 23:00</p>
                  <p className="text-gray-600">Check-out: 06:00 - 12:00</p>
                </div>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-hotel-black mb-4">Điểm du lịch gần đây</h3>
              <div className="space-y-3">
                {attractions.map((attraction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      {attraction.name.includes("Sân bay") ? (
                        <Plane className="h-4 w-4 text-hotel-gold" />
                      ) : (
                        <Car className="h-4 w-4 text-hotel-gold" />
                      )}
                      <span className="font-medium text-hotel-black">{attraction.name}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{attraction.distance}</div>
                      <div>{attraction.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
