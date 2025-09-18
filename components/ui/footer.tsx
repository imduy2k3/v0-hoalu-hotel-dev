import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-hotel-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/logo.png" alt="Hoa Lư City Hotel" width={40} height={40} className="w-10 h-10" />
              <span className="font-serif text-xl font-bold">Hoa Lư City Hotel</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Trải nghiệm nghỉ dưỡng sang trọng tại trung tâm thành phố, gần cố đô Hoa Lư với dịch vụ 4 sao đẳng cấp
              quốc tế.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-hotel-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-hotel-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-hotel-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-hotel-gold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="text-gray-300 hover:text-white transition-colors">
                  Loại phòng
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors">
                  Đặt phòng
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-hotel-gold">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-hotel-gold mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">123 Đường Trần Hưng Đạo, TP. Ninh Bình, Ninh Bình</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-hotel-gold flex-shrink-0" />
                <span className="text-gray-300 text-sm">+84 229 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-hotel-gold flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@hoalucityhotel.vn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Hoa Lư City Hotel. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
