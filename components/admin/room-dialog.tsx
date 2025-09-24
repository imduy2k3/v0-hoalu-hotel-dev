"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Room, RoomType } from "@/lib/types"

interface RoomDialogProps {
  isOpen: boolean
  onClose: () => void
  room?: Room | null
  onSave?: (room: Room) => void
  roomTypes?: RoomType[]
}

export function RoomDialog({ isOpen, onClose, room, onSave, roomTypes = [] }: RoomDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    roomTypeId: "",
    status: "Khả dụng",
    notes: "",
  })

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor?.toString() || "",
        roomTypeId: room.roomTypeId,
        status: room.status,
        notes: room.notes || "",
      })
    } else {
      setFormData({
        roomNumber: "",
        floor: "",
        roomTypeId: "",
        status: "Khả dụng",
        notes: "",
      })
    }
  }, [room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const roomData = {
        roomNumber: formData.roomNumber,
        floor: parseInt(formData.floor) || 1,
        roomTypeId: formData.roomTypeId,
        status: formData.status as "Khả dụng" | "Đang sử dụng" | "Đang bảo trì",
        notes: formData.notes || undefined
      }

      const url = room ? `/api/rooms/${room.id}` : '/api/rooms'
      const method = room ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      })

      if (response.ok) {
        const savedRoom = await response.json()
        toast({
          title: room ? "Đã cập nhật phòng" : "Đã tạo phòng mới",
          description: "Thông tin phòng đã được lưu thành công",
        })
        
        if (onSave) {
          onSave(savedRoom)
        }
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save room')
      }
    } catch (error) {
      console.error('Error saving room:', error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể lưu phòng",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{room ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roomNumber">Số phòng *</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, roomNumber: e.target.value }))}
              placeholder="101, 201, 301..."
              required
            />
          </div>

          <div>
            <Label htmlFor="floor">Tầng</Label>
            <Input
              id="floor"
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData((prev) => ({ ...prev, floor: e.target.value }))}
              placeholder="1, 2, 3..."
            />
          </div>

          <div>
            <Label htmlFor="roomTypeId">Loại phòng *</Label>
            <Select
              value={formData.roomTypeId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, roomTypeId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại phòng" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    Phòng {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Khả dụng">Khả dụng</SelectItem>
                <SelectItem value="Đang sử dụng">Đang sử dụng</SelectItem>
                <SelectItem value="Đang bảo trì">Đang bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú về phòng..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-hotel-gold hover:bg-hotel-gold/90">
              {room ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
