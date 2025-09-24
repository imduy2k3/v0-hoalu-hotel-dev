"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Booking, Customer, RoomType } from "@/lib/types"
import { Calendar, User, Home, CreditCard, MessageSquare, Clock } from "lucide-react"

interface BookingDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  customer: Customer | null
  roomType: RoomType | null
}

export function BookingDetailDialog({ 
  isOpen, 
  onClose, 
  booking, 
  customer, 
  roomType 
}: BookingDetailDialogProps) {
  if (!booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800"
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800"
      case "Đã nhận phòng":
        return "bg-green-100 text-green-800"
      case "Hoàn thành":
        return "bg-gray-100 text-gray-800"
      case "Đã hủy":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chi tiết đơn đặt phòng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Thông tin đơn đặt phòng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã đơn</label>
                  <p className="text-lg font-semibold">{booking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số đêm</label>
                  <p className="text-lg">{booking.nights} đêm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số phòng</label>
                  <p className="text-lg">{booking.roomsCount} phòng</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Người lớn</label>
                  <p className="text-lg">{booking.guestsAdult} người</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trẻ em</label>
                  <p className="text-lg">{booking.guestsChild} người</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          {customer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ tên</label>
                    <p className="text-lg font-semibold">{customer.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{customer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                    <p className="text-lg">{customer.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tổng chi tiêu</label>
                    <p className="text-lg font-semibold text-green-600">
                      {customer.totalSpent ? customer.totalSpent.toLocaleString("vi-VN") : '0'}₫
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin phòng */}
          {roomType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Thông tin loại phòng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loại phòng</label>
                    <p className="text-lg font-semibold">{roomType.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Giá mỗi đêm</label>
                    <p className="text-lg font-semibold text-green-600">
                      {roomType.price ? roomType.price.toLocaleString("vi-VN") : 'N/A'}₫
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Mô tả</label>
                    <p className="text-lg">{roomType.description || 'Không có mô tả'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thông tin thời gian */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày nhận phòng</label>
                  <p className="text-lg font-semibold">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày trả phòng</label>
                  <p className="text-lg font-semibold">{formatDate(booking.checkOut)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo đơn</label>
                  <p className="text-lg">{formatDateTime(booking.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                  <p className="text-lg">{formatDateTime(booking.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin thanh toán */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Tổng tiền</span>
                  <span className="text-2xl font-bold text-green-600">
                    {booking.totalAmount ? booking.totalAmount.toLocaleString("vi-VN") : '0'}₫
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ghi chú đặc biệt */}
          {booking.note && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ghi chú đặc biệt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg">{booking.note}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
