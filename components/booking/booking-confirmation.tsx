"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Phone, Mail, MapPin, Calendar, Users, Home } from "lucide-react"

export function BookingConfirmation() {
  const searchParams = useSearchParams()
  const bookingCode = searchParams.get("code") || "HLH000000"

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-hotel-black mb-4">Đặt phòng thành công!</h1>
          <p className="text-gray-600 text-lg">
            Cảm ơn quý khách đã chọn Hoa Lư City Hotel. Chúng tôi đã nhận được yêu cầu đặt phòng của quý khách.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-hotel-gold" />
              Thông tin đặt phòng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-hotel-black mb-2">Mã đặt phòng</h4>
                <p className="text-2xl font-bold text-hotel-gold">{bookingCode}</p>
              </div>
              <div>
                <h4 className="font-medium text-hotel-black mb-2">Trạng thái</h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Chờ xác nhận
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div>
                <h4 className="font-medium text-hotel-black mb-2">Thời gian lưu trú</h4>
                <p className="text-sm text-gray-600">Nhận phòng: 20/03/2024</p>
                <p className="text-sm text-gray-600">Trả phòng: 22/03/2024</p>
                <p className="text-sm font-medium">2 đêm</p>
              </div>
              <div>
                <h4 className="font-medium text-hotel-black mb-2">Phòng & Khách</h4>
                <p className="text-sm text-gray-600">1 Phòng Deluxe</p>
                <p className="text-sm text-gray-600">2 người lớn</p>
              </div>
              <div>
                <h4 className="font-medium text-hotel-black mb-2">Tổng tiền</h4>
                <p className="text-xl font-bold text-hotel-gold">2.640.000₫</p>
                <p className="text-sm text-gray-600">Thanh toán tại khách sạn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Phone className="h-5 w-5 text-hotel-gold" />
              Thông tin liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-hotel-gold mt-0.5" />
                <div>
                  <h4 className="font-medium text-hotel-black">Điện thoại</h4>
                  <p className="text-sm text-gray-600">+84 229 123 4567</p>
                  <p className="text-xs text-gray-500">24/7 hỗ trợ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-hotel-gold mt-0.5" />
                <div>
                  <h4 className="font-medium text-hotel-black">Email</h4>
                  <p className="text-sm text-gray-600">info@hoalucityhotel.vn</p>
                  <p className="text-xs text-gray-500">Phản hồi trong 2h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-hotel-gold mt-0.5" />
                <div>
                  <h4 className="font-medium text-hotel-black">Địa chỉ</h4>
                  <p className="text-sm text-gray-600">123 Đường Trần Hưng Đạo</p>
                  <p className="text-sm text-gray-600">TP. Ninh Bình, Ninh Bình</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Chính sách hủy phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                • <strong>Hủy miễn phí:</strong> Trước 48 giờ so với thời gian check-in
              </p>
              <p>
                • <strong>Hủy muộn:</strong> Phí hủy 50% tổng giá trị đơn hàng nếu hủy trong vòng 48 giờ
              </p>
              <p>
                • <strong>Không đến:</strong> Tính phí 100% tổng giá trị đơn hàng
              </p>
              <p>
                • <strong>Check-in:</strong> 14:00 - <strong>Check-out:</strong> 12:00
              </p>
              <p>
                • <strong>Thanh toán:</strong> Tại khách sạn khi check-in (tiền mặt hoặc thẻ)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-hotel-gold hover:bg-hotel-gold/90 text-white">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent">
            <Link href="/rooms">
              <Users className="mr-2 h-4 w-4" />
              Đặt thêm phòng
            </Link>
          </Button>
        </div>

        {/* Email Notification */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            📧 Email xác nhận đã được gửi đến địa chỉ email của quý khách. Vui lòng kiểm tra hộp thư đến và thư rác.
          </p>
        </div>
      </div>
    </section>
  )
}
