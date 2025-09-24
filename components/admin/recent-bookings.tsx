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
        // Fetch recent bookings
        const bookingsResponse = await fetch('/api/bookings')
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json()
          setBookings(bookingsData.slice(0, 5)) // Get only 5 most recent
        }
        
        // Fetch customers
        const customersResponse = await fetch('/api/customers')
        if (customersResponse.ok) {
          const customersData = await customersResponse.json()
          setCustomers(customersData)
        }
        
        // Fetch room types
        const roomTypesResponse = await fetch('/api/room-types')
        if (roomTypesResponse.ok) {
          const roomTypesData = await roomTypesResponse.json()
          setRoomTypes(roomTypesData)
        }
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
      case "Chờ xác nhận":
        return "bg-blue-100 text-blue-800"
      case "Đã xác nhận":
        return "bg-green-100 text-green-800"
      case "Đã nhận phòng":
        return "bg-purple-100 text-purple-800"
      case "Hoàn thành":
        return "bg-gray-100 text-gray-800"
      case "Đã hủy":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    return status // Status is already in Vietnamese from database
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
