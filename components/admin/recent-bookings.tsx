"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import type { Booking, Customer, RoomType } from "@/lib/types"

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, use mock data until we implement the API endpoints
        setBookings([
          {
            id: "BK2024001",
            customerId: "1",
            checkIn: "2024-03-20T14:00:00Z",
            checkOut: "2024-03-22T12:00:00Z",
            nights: 2,
            roomTypeId: "2",
            roomsCount: 1,
            guestsAdult: 2,
            guestsChild: 0,
            totalAmount: 2400000,
            status: "Confirmed",
            createdAt: "2024-03-10T14:30:00Z",
            updatedAt: "2024-03-10T14:30:00Z",
          },
          {
            id: "BK2024002",
            customerId: "2",
            checkIn: "2024-03-25T14:00:00Z",
            checkOut: "2024-03-27T12:00:00Z",
            nights: 2,
            roomTypeId: "1",
            roomsCount: 1,
            guestsAdult: 2,
            guestsChild: 0,
            totalAmount: 1600000,
            status: "New",
            createdAt: "2024-03-15T16:45:00Z",
            updatedAt: "2024-03-15T16:45:00Z",
          }
        ])
        
        setCustomers([
          {
            id: "1",
            fullName: "Nguyễn Văn An",
            email: "nguyenvanan@email.com",
            phone: "0901234567",
            createdAt: "2024-01-15T10:00:00Z",
            lastBookingAt: "2024-03-10T14:30:00Z",
            totalSpent: 2400000,
          },
          {
            id: "2",
            fullName: "Trần Thị Bình",
            email: "tranthibinh@email.com",
            phone: "0912345678",
            createdAt: "2024-02-20T09:15:00Z",
            lastBookingAt: "2024-03-15T16:45:00Z",
            totalSpent: 1600000,
          }
        ])
        
        setRoomTypes([
          {
            id: "1",
            name: "Standard",
            slug: "standard",
            basePrice: 800000,
            capacity: 2,
            sizeSqm: 25,
            bedType: "Twin",
            shortDesc: "Phòng tiêu chuẩn",
            longDesc: "Phòng tiêu chuẩn với đầy đủ tiện nghi",
            amenities: ["wifi", "breakfast"],
            policies: "Hủy miễn phí 48h trước check-in",
            images: ["/placeholder.svg"],
            isPublished: true,
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Deluxe",
            slug: "deluxe",
            basePrice: 1200000,
            capacity: 3,
            sizeSqm: 35,
            bedType: "Queen",
            shortDesc: "Phòng cao cấp",
            longDesc: "Phòng cao cấp với không gian rộng rãi",
            amenities: ["wifi", "breakfast", "pool"],
            policies: "Hủy miễn phí 48h trước check-in",
            images: ["/placeholder.svg"],
            isPublished: true,
            updatedAt: new Date().toISOString(),
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn đặt phòng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
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
