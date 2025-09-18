import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { bookings, customers, roomTypes } from "@/lib/data"

export function RecentBookings() {
  const recentBookings = bookings.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "New":
        return "Mới"
      case "Confirmed":
        return "Đã xác nhận"
      case "Cancelled":
        return "Đã hủy"
      case "Completed":
        return "Hoàn tất"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn đặt phòng gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Mã đơn</th>
                <th className="text-left py-2">Khách hàng</th>
                <th className="text-left py-2">Loại phòng</th>
                <th className="text-left py-2">Check-in</th>
                <th className="text-left py-2">Tổng tiền</th>
                <th className="text-left py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => {
                const customer = customers.find((c) => c.id === booking.customerId)
                const roomType = roomTypes.find((r) => r.id === booking.roomTypeId)

                return (
                  <tr key={booking.id} className="border-b">
                    <td className="py-3 font-medium">{booking.id}</td>
                    <td className="py-3">{customer?.fullName}</td>
                    <td className="py-3">Phòng {roomType?.name}</td>
                    <td className="py-3">{new Date(booking.checkIn).toLocaleDateString("vi-VN")}</td>
                    <td className="py-3 font-medium">{booking.totalAmount.toLocaleString("vi-VN")}₫</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
