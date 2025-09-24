"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RoomTypeDialog } from "@/components/admin/room-type-dialog"
import { Plus, Search, Edit, Trash2, Image, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RoomType {
  id: number
  name: string
  slug: string
  basePrice: number
  capacity: number
  sizeSqm: number
  bedType: string
  shortDesc: string
  longDesc: string
  amenities: string[]
  policies?: string
  images: string[]
  isPublished: boolean
  updatedAt: string
}

export default function RoomTypesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/room-types')
        if (response.ok) {
          const data = await response.json()
          setRoomTypes(data)
        } else {
          throw new Error('Failed to load room types')
        }
      } catch (error) {
        console.error('Error loading room types:', error)
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách loại phòng",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const refreshData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/room-types')
      if (response.ok) {
        const data = await response.json()
        setRoomTypes(data)
      }
    } catch (error) {
      console.error('Error refreshing room types:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoomTypes = roomTypes.filter((roomType) =>
    roomType.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (roomType: RoomType) => {
    setEditingRoomType(roomType)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    toast({
      title: "Đã xóa loại phòng",
      description: "Loại phòng đã được xóa thành công",
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingRoomType(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý loại phòng</h1>
            <p className="text-gray-600">Quản lý các loại phòng và thông tin chi tiết</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-hotel-gold hover:bg-hotel-gold/90">
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại phòng
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách loại phòng ({filteredRoomTypes.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm loại phòng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Tên loại</th>
                    <th className="text-left py-3">Giá/đêm</th>
                    <th className="text-left py-3">Sức chứa</th>
                    <th className="text-left py-3">Diện tích</th>
                    <th className="text-left py-3">Ảnh</th>
                    <th className="text-left py-3">Trạng thái</th>
                    <th className="text-left py-3">Cập nhật</th>
                    <th className="text-left py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoomTypes.map((roomType) => (
                    <tr key={roomType.id} className="border-b">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">Phòng {roomType.name}</div>
                          <div className="text-sm text-gray-500">{roomType.bedType}</div>
                        </div>
                      </td>
                      <td className="py-3 font-medium">{roomType.basePrice.toLocaleString("vi-VN")}₫</td>
                      <td className="py-3">{roomType.capacity} khách</td>
                      <td className="py-3">{roomType.sizeSqm}m²</td>
                      <td className="py-3">
                        {roomType.images && roomType.images.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <img 
                              src={roomType.images[0]} 
                              alt={`Ảnh ${roomType.name}`}
                              className="w-12 h-8 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                            <Image className="h-4 w-4 text-gray-400 hidden" />
                            {roomType.images.length > 1 && (
                              <span className="text-xs text-gray-500 ml-1">
                                +{roomType.images.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">Chưa có ảnh</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge
                          className={roomType.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {roomType.isPublished ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(roomType.updatedAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(roomType)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(roomType.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
            
            {!loading && filteredRoomTypes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Không tìm thấy loại phòng nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        <RoomTypeDialog isOpen={isDialogOpen} onClose={handleCloseDialog} roomType={editingRoomType} />
      </div>
    </AdminLayout>
  )
}
