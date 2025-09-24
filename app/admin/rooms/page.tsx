"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomDialog } from "@/components/admin/room-dialog"
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Room, RoomType } from "@/lib/types"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [roomsResponse, roomTypesResponse] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/room-types')
        ])
        
        if (roomsResponse.ok && roomTypesResponse.ok) {
          const roomsData = await roomsResponse.json()
          const roomTypesData = await roomTypesResponse.json()
          setRooms(roomsData)
          setRoomTypes(roomTypesData)
        } else {
          throw new Error('Failed to fetch data')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu phòng",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.roomTypeId === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

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

  const handleEdit = (room: any) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setRooms(rooms.filter(room => room.id !== id))
        toast({
          title: "Đã xóa phòng",
          description: "Phòng đã được xóa thành công",
        })
      } else {
        throw new Error('Failed to delete room')
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa phòng",
        variant: "destructive"
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingRoom(null)
  }

  const handleRoomSaved = (savedRoom: Room) => {
    if (editingRoom) {
      // Update existing room
      setRooms(rooms.map(room => room.id === savedRoom.id ? savedRoom : room))
    } else {
      // Add new room
      setRooms([...rooms, savedRoom])
    }
    setIsDialogOpen(false)
    setEditingRoom(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng</h1>
            <p className="text-gray-600">Quản lý danh sách phòng và trạng thái</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-hotel-gold hover:bg-hotel-gold/90">
            <Plus className="mr-2 h-4 w-4" />
            Thêm phòng
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <CardTitle>Danh sách phòng</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm số phòng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại phòng</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        Phòng {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Khả dụng">Khả dụng</SelectItem>
                    <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
                    <SelectItem value="Đang bảo trì">Đang bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Số phòng</th>
                      <th className="text-left py-3">Loại phòng</th>
                      <th className="text-left py-3">Tầng</th>
                      <th className="text-left py-3">Trạng thái</th>
                      <th className="text-left py-3">Ghi chú</th>
                      <th className="text-left py-3">Cập nhật</th>
                      <th className="text-left py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          Không có phòng nào
                        </td>
                      </tr>
                    ) : (
                      filteredRooms.map((room) => {
                        const roomType = roomTypes.find((type) => type.id === room.roomTypeId)
                        return (
                          <tr key={room.id} className="border-b">
                            <td className="py-3 font-medium">{room.roomNumber}</td>
                            <td className="py-3">Phòng {roomType?.name}</td>
                            <td className="py-3">Tầng {room.floor}</td>
                            <td className="py-3">
                              <Badge className={getStatusColor(room.status)}>{getStatusText(room.status)}</Badge>
                            </td>
                            <td className="py-3 text-sm text-gray-500">{room.notes || "-"}</td>
                            <td className="py-3 text-sm text-gray-500">
                              {new Date(room.updatedAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(room.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <RoomDialog 
          isOpen={isDialogOpen} 
          onClose={handleCloseDialog} 
          room={editingRoom}
          onSave={handleRoomSaved}
          roomTypes={roomTypes}
        />
      </div>
    </AdminLayout>
  )
}
