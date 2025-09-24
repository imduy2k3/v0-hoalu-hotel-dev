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
import { ImageSelector } from "./image-selector"
import { X, Plus } from "lucide-react"

interface RoomTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  roomType?: RoomType | null
}

export function RoomTypeDialog({ isOpen, onClose, roomType }: RoomTypeDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false)
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
    images: [] as string[],
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
        amenities: Array.isArray(roomType.amenities) ? roomType.amenities : [],
        policies: roomType.policies || "",
        images: Array.isArray(roomType.images) ? roomType.images : [],
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
        images: [],
        isPublished: true,
      })
    }
  }, [roomType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (roomType) {
        // Update existing room type
        const response = await fetch(`/api/room-types/${roomType.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            basePrice: parseInt(formData.basePrice),
            capacity: parseInt(formData.capacity),
            sizeSqm: parseInt(formData.sizeSqm),
            bedType: formData.bedType,
            shortDesc: formData.shortDesc,
            longDesc: formData.longDesc,
            amenities: formData.amenities,
            policies: formData.policies,
            images: formData.images,
            isPublished: formData.isPublished,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Không thể cập nhật loại phòng')
        }

        const result = await response.json()
        console.log('Room type updated:', result)

        toast({
          title: "Đã cập nhật loại phòng",
          description: result.message || "Thông tin loại phòng đã được lưu thành công",
        })
      } else {
        // Create new room type (placeholder for now)
        toast({
          title: "Đã tạo loại phòng mới",
          description: "Thông tin loại phòng đã được lưu thành công",
        })
      }

      onClose()
    } catch (error) {
      console.error('Error saving room type:', error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu loại phòng",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAmenityChange = (amenity: Amenity, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }


  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{roomType ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label>Ảnh loại phòng</Label>
            <div className="space-y-3 mt-2">
              {/* Current Images Display */}
              {Array.isArray(formData.images) && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg"
                          e.currentTarget.alt = "Ảnh không tải được"
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Image Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageSelectorOpen(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {formData.images.length > 0 ? "Thêm ảnh khác" : "Chọn ảnh"}
              </Button>
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" className="bg-hotel-gold hover:bg-hotel-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : (roomType ? "Cập nhật" : "Tạo mới")}
            </Button>
          </div>
        </form>
      </DialogContent>
      
      {/* Image Selector Modal */}
      <ImageSelector
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={(imageUrl) => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }))
        }}
        currentImages={formData.images}
      />
    </Dialog>
  )
}
