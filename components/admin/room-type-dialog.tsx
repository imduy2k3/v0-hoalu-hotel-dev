"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { amenityLabels } from "@/lib/amenities"
import type { RoomType, Amenity } from "@/lib/types"

interface RoomTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  roomType?: RoomType | null
}

export function RoomTypeDialog({ isOpen, onClose, roomType }: RoomTypeDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    basePrice: "",
    capacity: "",
    sizeSqm: "",
    bedType: "",
    shortDesc: "",
    longDesc: "",
    amenities: [] as Amenity[],
    policies: "",
    isPublished: true,
  })

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name,
        slug: roomType.slug,
        basePrice: roomType.basePrice.toString(),
        capacity: roomType.capacity.toString(),
        sizeSqm: roomType.sizeSqm.toString(),
        bedType: roomType.bedType,
        shortDesc: roomType.shortDesc,
        longDesc: roomType.longDesc,
        amenities: roomType.amenities,
        policies: roomType.policies || "",
        isPublished: roomType.isPublished,
      })
    } else {
      setFormData({
        name: "",
        slug: "",
        basePrice: "",
        capacity: "",
        sizeSqm: "",
        bedType: "",
        shortDesc: "",
        longDesc: "",
        amenities: [],
        policies: "",
        isPublished: true,
      })
    }
  }, [roomType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: roomType ? "Đã cập nhật loại phòng" : "Đã tạo loại phòng mới",
      description: "Thông tin loại phòng đã được lưu thành công",
    })

    onClose()
  }

  const handleAmenityChange = (amenity: Amenity, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{roomType ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên loại phòng *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Standard, Deluxe, Suite..."
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="standard, deluxe, suite..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="basePrice">Giá cơ bản/đêm (VNĐ) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: e.target.value }))}
                placeholder="800000"
                required
              />
            </div>
            <div>
              <Label htmlFor="capacity">Sức chứa tối đa *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                placeholder="2"
                required
              />
            </div>
            <div>
              <Label htmlFor="sizeSqm">Diện tích (m²) *</Label>
              <Input
                id="sizeSqm"
                type="number"
                value={formData.sizeSqm}
                onChange={(e) => setFormData((prev) => ({ ...prev, sizeSqm: e.target.value }))}
                placeholder="25"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bedType">Loại giường *</Label>
            <Select
              value={formData.bedType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, bedType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giường" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Twin">Twin</SelectItem>
                <SelectItem value="Queen">Queen</SelectItem>
                <SelectItem value="King">King</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="shortDesc">Mô tả ngắn *</Label>
            <Textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortDesc: e.target.value }))}
              placeholder="Mô tả ngắn gọn về loại phòng..."
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="longDesc">Mô tả chi tiết *</Label>
            <Textarea
              id="longDesc"
              value={formData.longDesc}
              onChange={(e) => setFormData((prev) => ({ ...prev, longDesc: e.target.value }))}
              placeholder="Mô tả chi tiết về loại phòng..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Tiện nghi</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {Object.entries(amenityLabels).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData.amenities.includes(key as Amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(key as Amenity, checked as boolean)}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="policies">Chính sách</Label>
            <Textarea
              id="policies"
              value={formData.policies}
              onChange={(e) => setFormData((prev) => ({ ...prev, policies: e.target.value }))}
              placeholder="Chính sách hủy, check-in/out..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked as boolean }))}
            />
            <Label htmlFor="isPublished">Hiển thị công khai</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-hotel-gold hover:bg-hotel-gold/90">
              {roomType ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
