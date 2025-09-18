"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    hotelName: "Hoa Lư City Hotel",
    address: "123 Đường Trần Hưng Đạo, TP. Ninh Bình, Ninh Bình",
    phone: "+84 229 123 4567",
    email: "info@hoalucityhotel.vn",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "Hủy miễn phí 48h trước check-in. Hủy muộn phí 50% tổng giá trị đơn hàng.",
    description:
      "Khách sạn Hoa Lư - Trải nghiệm nghỉ dưỡng sang trọng gần cố đô Hoa Lư với dịch vụ 4 sao đẳng cấp quốc tế.",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Đã lưu cài đặt",
      description: "Thông tin khách sạn đã được cập nhật thành công",
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý thông tin khách sạn và cài đặt chung</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách sạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hotelName">Tên khách sạn *</Label>
                <Input
                  id="hotelName"
                  value={formData.hotelName}
                  onChange={(e) => handleChange("hotelName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Mô tả khách sạn</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chính sách và quy định</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkInTime">Giờ check-in mặc định</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleChange("checkInTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOutTime">Giờ check-out mặc định</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleChange("checkOutTime", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cancellationPolicy">Chính sách hủy phòng</Label>
                <Textarea
                  id="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={(e) => handleChange("cancellationPolicy", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-hotel-gold hover:bg-hotel-gold/90">
              <Save className="mr-2 h-4 w-4" />
              Lưu cài đặt
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
