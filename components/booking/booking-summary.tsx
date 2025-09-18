import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { RoomType } from "@/lib/types"

interface BookingSummaryProps {
  bookingData: {
    checkIn: Date | undefined
    checkOut: Date | undefined
    adults: number
    children: number
    roomType: string
    roomCount: number
    fullName: string
    email: string
    phone: string
    notes: string
    promoCode: string
  }
  selectedRoom: RoomType | undefined
  nights: number
  subtotal: number
  tax: number
  total: number
}

export function BookingSummary({ bookingData, selectedRoom, nights, subtotal, tax, total }: BookingSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Tóm tắt đặt phòng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        {bookingData.checkIn && bookingData.checkOut && (
          <div>
            <h4 className="font-medium mb-2">Thời gian lưu trú</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Nhận phòng: {format(bookingData.checkIn, "dd/MM/yyyy", { locale: vi })}</p>
              <p>Trả phòng: {format(bookingData.checkOut, "dd/MM/yyyy", { locale: vi })}</p>
              <p className="font-medium">{nights} đêm</p>
            </div>
          </div>
        )}

        {/* Guests */}
        <div>
          <h4 className="font-medium mb-2">Số lượng khách</h4>
          <p className="text-sm text-gray-600">
            {bookingData.adults} người lớn
            {bookingData.children > 0 && `, ${bookingData.children} trẻ em`}
          </p>
        </div>

        {/* Room */}
        {selectedRoom && (
          <div>
            <h4 className="font-medium mb-2">Phòng đã chọn</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Phòng {selectedRoom.name}</p>
              <p>{bookingData.roomCount} phòng</p>
              <p>{selectedRoom.basePrice.toLocaleString("vi-VN")}₫ / đêm</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Price Breakdown */}
        {subtotal > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Tiền phòng ({nights} đêm × {bookingData.roomCount} phòng)
              </span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Thuế VAT (10%)</span>
              <span>{tax.toLocaleString("vi-VN")}₫</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-hotel-gold">{total.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        )}

        {/* Policies */}
        <div className="text-xs text-gray-500 space-y-2 pt-4 border-t">
          <p>• Hủy miễn phí 48h trước check-in</p>
          <p>• Check-in: 14:00 - Check-out: 12:00</p>
          <p>• Thanh toán tại khách sạn khi check-in</p>
        </div>
      </CardContent>
    </Card>
  )
}
