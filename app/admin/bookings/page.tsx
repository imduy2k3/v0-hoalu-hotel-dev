"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bookings, customers, roomTypes } from "@/lib/client-data"
import { Search, Eye, Check, X, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const filteredBookings = bookings.filter((booking) => {
    const customer = customers.find((c) => c.id === booking.customerId)
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const handleStatusChange = (bookingId: string, newStatus: string, statusText: string) => {
    toast({
      title: `Đã ${statusText.toLowerCase()}`,
      description: `Đơn đặt phòng ${bookingId} đã được ${statusText.toLowerCase()}`,
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt phòng</h1>
          <p className="text-gray-600">Quản lý các đơn đặt phòng và trạng thái</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <CardTitle>Danh sách đặt phòng</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm mã đơn hoặc khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="New">Mới</SelectItem>
                    <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="Cancelled">Đã hủy</SelectItem>
                    <SelectItem value="Completed">Hoàn tất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Mã đơn</th>
                    <th className="text-left py-3">Khách hàng</th>
                    <th className="text-left py-3">Check-in</th>
                    <th className="text-left py-3">Check-out</th>
                    <th className="text-left py-3">Loại phòng</th>
                    <th className="text-left py-3">Tổng tiền</th>
                    <th className="text-left py-3">Trạng thái</th>
                    <th className="text-left py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const customer = customers.find((c) => c.id === booking.customerId)
                    const roomType = roomTypes.find((r) => r.id === booking.roomTypeId)

                    return (
                      <tr key={booking.id} className="border-b">
                        <td className="py-3 font-medium">{booking.id}</td>
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{customer?.fullName}</div>
                            <div className="text-sm text-gray-500">{customer?.email}</div>
                          </div>
                        </td>
                        <td className="py-3">{new Date(booking.checkIn).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3">{new Date(booking.checkOut).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3">
                          <div>
                            <div>Phòng {roomType?.name}</div>
                            <div className="text-sm text-gray-500">{booking.roomsCount} phòng</div>
                          </div>
                        </td>
                        <td className="py-3 font-medium">{booking.totalAmount.toLocaleString("vi-VN")}₫</td>
                        <td className="py-3">
                          <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.status === "New" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, "Confirmed", "xác nhận")}
                                className="text-green-600"
                                title="Xác nhận"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {(booking.status === "New" || booking.status === "Confirmed") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, "Cancelled", "hủy")}
                                className="text-red-600"
                                title="Hủy"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {booking.status === "Confirmed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, "Completed", "hoàn tất")}
                                className="text-blue-600"
                                title="Hoàn tất"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
