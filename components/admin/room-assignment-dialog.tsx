"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Home, Users, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Room, RoomType } from "@/lib/types"

interface RoomAssignmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (roomId: string) => void
  bookingId: string
  roomTypeId: string
  checkIn: string
  checkOut: string
  roomTypeName?: string
}

export function RoomAssignmentDialog({
  isOpen,
  onClose,
  onAssign,
  bookingId,
  roomTypeId,
  checkIn,
  checkOut,
  roomTypeName
}: RoomAssignmentDialogProps) {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && roomTypeId && checkIn && checkOut) {
      fetchAvailableRooms()
    }
  }, [isOpen, roomTypeId, checkIn, checkOut])

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/rooms/available?roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`
      )
      
      if (response.ok) {
        const rooms = await response.json()
        setAvailableRooms(rooms)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch available rooms')
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phòng trống",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = () => {
    if (selectedRoom) {
      onAssign(selectedRoom)
      onClose()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Khả dụng":
        return "bg-green-100 text-green-800"
      case "Đang sử dụng":
        return "bg-red-100 text-red-800"
      case "Đang bảo trì":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Khả dụng":
        return "Khả dụng"
      case "Đang sử dụng":
        return "Đang sử dụng"
      case "Đang bảo trì":
        return "Đang bảo trì"
      default:
        return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Chọn phòng cho đơn đặt phòng {bookingId}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p>Loại phòng: <span className="font-medium">{roomTypeName}</span></p>
            <p>Thời gian: {new Date(checkIn).toLocaleDateString("vi-VN")} - {new Date(checkOut).toLocaleDateString("vi-VN")}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Đang tải danh sách phòng...</span>
            </div>
          ) : availableRooms.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Không có phòng trống phù hợp</p>
              <p className="text-sm text-gray-400">Vui lòng thử lại sau hoặc chọn loại phòng khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.map((room) => (
                <Card 
                  key={room.id} 
                  className={`cursor-pointer transition-all ${
                    selectedRoom === room.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Phòng {room.roomNumber}</h3>
                      <Badge className={getStatusColor(room.status)}>
                        {getStatusText(room.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        <span>Tầng {room.floor}</span>
                      </div>
                      
                      {room.notes && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          {room.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {availableRooms.length > 0 && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button 
                onClick={handleAssign}
                disabled={!selectedRoom}
                className="bg-hotel-gold hover:bg-hotel-gold/90"
              >
                Gán phòng đã chọn
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
