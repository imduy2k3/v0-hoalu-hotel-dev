"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomAssignmentDialog } from "@/components/admin/room-assignment-dialog"
import { BookingDetailDialog } from "@/components/admin/booking-detail-dialog"
import { bookings as fallbackBookings, customers as fallbackCustomers, roomTypes as fallbackRoomTypes } from "@/lib/client-data"
import type { Booking, Customer, RoomType } from "@/lib/types"
import { Search, Eye, Check, X, RotateCcw, Home, Ban } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Default to show all bookings
  const [bookings, setBookings] = useState<Booking[]>(fallbackBookings)
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(fallbackRoomTypes)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [assigningRoom, setAssigningRoom] = useState<string | null>(null)
  const [roomAssignmentDialog, setRoomAssignmentDialog] = useState<{
    isOpen: boolean
    bookingId: string
    roomTypeId: string
    checkIn: string
    checkOut: string
    roomTypeName: string
  }>({
    isOpen: false,
    bookingId: '',
    roomTypeId: '',
    checkIn: '',
    checkOut: '',
    roomTypeName: ''
  })
  
  const [bookingDetailDialog, setBookingDetailDialog] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({
    isOpen: false,
    booking: null
  })
  const { toast } = useToast()

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsResponse, customersResponse, roomTypesResponse] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/customers'),
        fetch('/api/room-types')
      ])

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      } else {
        setBookings(fallbackBookings)
      }

      if (customersResponse.ok) {
        const customersData = await customersResponse.json()
        setCustomers(customersData)
      }

      if (roomTypesResponse.ok) {
        const roomTypesData = await roomTypesResponse.json()
        setRoomTypes(roomTypesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu từ server",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const customer = customers.find((c) => c.id === booking.customerId)
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Simple status filter logic
    if (statusFilter === "all") {
      return matchesSearch
    } else {
      return matchesSearch && booking.status === statusFilter
    }
  })



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

  const getStatusText = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "Chờ xác nhận"
      case "Đã xác nhận":
        return "Đã xác nhận"
      case "Đã nhận phòng":
        return "Đã nhận phòng"
      case "Hoàn thành":
        return "Hoàn thành"
      case "Đã hủy":
        return "Đã hủy"
      default:
        return status
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId)
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Cập nhật thành công",
          description: `Trạng thái đơn đặt phòng ${bookingId} đã được cập nhật`,
        })
        // Refresh data from API to get latest data
        setLoading(true)
        await fetchData()
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive"
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const fetchAvailableRooms = async (roomTypeId: string, checkIn: string, checkOut: string) => {
    try {
      console.log('🔍 Fetching available rooms:', { roomTypeId, checkIn, checkOut })
      const response = await fetch(
        `/api/rooms/available?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`
      )
      console.log('📡 API Response status:', response.status)
      
      if (response.ok) {
        const rooms = await response.json()
        console.log('✅ Available rooms:', rooms)
        setAvailableRooms(rooms)
        return rooms
      } else {
        const errorData = await response.json()
        console.error('❌ API Error:', errorData)
      }
    } catch (error) {
      console.error('❌ Network Error fetching available rooms:', error)
    }
    return []
  }

  const handleAssignRoom = async (bookingId: string, roomId: string) => {
    try {
      console.log('🏠 Assigning room:', { bookingId, roomId })
      setAssigningRoom(bookingId)
      
      const response = await fetch(`/api/bookings/${bookingId}/assign-room`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      })

      console.log('📡 Assign room response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Room assignment result:', result)
        
        toast({
          title: "Gán phòng thành công",
          description: `Đã gán phòng ${result.room_number} cho đơn đặt phòng ${bookingId}`,
        })
        // Refresh data
        setLoading(true)
        fetchData()
      } else {
        const errorData = await response.json()
        console.error('❌ Assign room error:', errorData)
        throw new Error(errorData.error || 'Failed to assign room')
      }
    } catch (error) {
      console.error('❌ Error assigning room:', error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gán phòng",
        variant: "destructive"
      })
    } finally {
      setAssigningRoom(null)
    }
  }

  const openRoomAssignmentDialog = (booking: Booking) => {
    const roomType = roomTypes.find(rt => rt.id === booking.roomTypeId)
    setRoomAssignmentDialog({
      isOpen: true,
      bookingId: booking.id,
      roomTypeId: booking.roomTypeId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomTypeName: roomType?.name || 'Unknown'
    })
  }

  const openBookingDetailDialog = (booking: Booking) => {
    setBookingDetailDialog({
      isOpen: true,
      booking: booking
    })
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by admin' }),
      })

      if (response.ok) {
        toast({
          title: "Đã hủy đơn đặt phòng",
          description: "Đơn đặt phòng đã được hủy thành công",
        })
        // Refresh data
        setLoading(true)
        fetchData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể hủy đơn đặt phòng",
        variant: "destructive"
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt phòng</h1>
            <p className="text-gray-600">Quản lý các đơn đặt phòng và trạng thái</p>
          </div>
          <Button 
            onClick={fetchData} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang tải...' : 'Làm mới'}
          </Button>
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
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
                      <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                      <SelectItem value="Đã nhận phòng">Đã nhận phòng</SelectItem>
                      <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                      <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                    <th className="text-left py-3">Gán phòng</th>
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
                          <Select
                            value={booking.status}
                            onValueChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                            disabled={updatingStatus === booking.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
                              <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                              <SelectItem value="Đã nhận phòng">Đã nhận phòng</SelectItem>
                              <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                              <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Xem chi tiết"
                              onClick={() => openBookingDetailDialog(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(booking.status === "Chờ xác nhận" || booking.status === "Đã xác nhận") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openRoomAssignmentDialog(booking)}
                                disabled={assigningRoom === booking.id}
                                className="text-blue-600"
                                title="Gán phòng"
                              >
                                <Home className="h-4 w-4" />
                              </Button>
                            )}
                            {(booking.status === "Chờ xác nhận" || booking.status === "Đã xác nhận" || booking.status === "Đã nhận phòng") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600"
                                title="Hủy đơn"
                              >
                                <Ban className="h-4 w-4" />
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

        <RoomAssignmentDialog
          isOpen={roomAssignmentDialog.isOpen}
          onClose={() => setRoomAssignmentDialog(prev => ({ ...prev, isOpen: false }))}
          onAssign={(roomId) => handleAssignRoom(roomAssignmentDialog.bookingId, roomId)}
          bookingId={roomAssignmentDialog.bookingId}
          roomTypeId={roomAssignmentDialog.roomTypeId}
          checkIn={roomAssignmentDialog.checkIn}
          checkOut={roomAssignmentDialog.checkOut}
          roomTypeName={roomAssignmentDialog.roomTypeName}
        />
        
        <BookingDetailDialog
          isOpen={bookingDetailDialog.isOpen}
          onClose={() => setBookingDetailDialog(prev => ({ ...prev, isOpen: false }))}
          booking={bookingDetailDialog.booking}
          customer={bookingDetailDialog.booking ? customers.find(c => c.id === bookingDetailDialog.booking?.customerId) || null : null}
          roomType={bookingDetailDialog.booking ? roomTypes.find(rt => rt.id === bookingDetailDialog.booking?.roomTypeId) || null : null}
        />
      </div>
    </AdminLayout>
  )
}
