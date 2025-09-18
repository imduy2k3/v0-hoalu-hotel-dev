"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Minus, Plus } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { vi } from "date-fns/locale"
import { roomTypes } from "@/lib/client-data"
import { BookingSummary } from "./booking-summary"
import { cn } from "@/lib/utils"

interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  roomType: string
  roomCount: number
  fullName: string
  email: string
  phone: string
  notes: string
  promoCode: string
}

export function BookingForm() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    children: 0,
    roomType: "",
    roomCount: 1,
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    promoCode: "",
  })

  // Pre-fill from URL params
  useEffect(() => {
    const roomTypeParam = searchParams.get("roomType")
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")

    if (roomTypeParam) {
      setBookingData((prev) => ({ ...prev, roomType: roomTypeParam }))
    }
    if (checkInParam) {
      setBookingData((prev) => ({ ...prev, checkIn: new Date(checkInParam) }))
    }
    if (checkOutParam) {
      setBookingData((prev) => ({ ...prev, checkOut: new Date(checkOutParam) }))
    }
  }, [searchParams])

  const selectedRoom = roomTypes.find((room) => room.id === bookingData.roomType)
  const nights =
    bookingData.checkIn && bookingData.checkOut ? differenceInDays(bookingData.checkOut, bookingData.checkIn) : 0
  const subtotal = selectedRoom ? nights * selectedRoom.basePrice * bookingData.roomCount : 0
  const tax = subtotal * 0.1 // 10% VAT
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate booking code
    const bookingCode = `HLH${Date.now().toString().slice(-6)}`

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to confirmation
    window.location.href = `/booking/confirmation?code=${bookingCode}`
  }

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">1. Chọn ngày</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Ngày nhận phòng *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingData.checkIn && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.checkIn ? format(bookingData.checkIn, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.checkIn}
                        onSelect={(date) => updateBookingData("checkIn", date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Ngày trả phòng *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingData.checkOut && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.checkOut
                          ? format(bookingData.checkOut, "dd/MM/yyyy", { locale: vi })
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.checkOut}
                        onSelect={(date) => updateBookingData("checkOut", date)}
                        disabled={(date) => date <= (bookingData.checkIn || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {nights > 0 && (
                <p className="text-sm text-gray-600">
                  Tổng cộng: <span className="font-medium">{nights} đêm</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Guest Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">2. Số lượng khách</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Người lớn</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingData("adults", Math.max(1, bookingData.adults - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{bookingData.adults}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingData("adults", bookingData.adults + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Trẻ em</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingData("children", Math.max(0, bookingData.children - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{bookingData.children}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingData("children", bookingData.children + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">3. Chọn phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Loại phòng *</Label>
                <Select value={bookingData.roomType} onValueChange={(value) => updateBookingData("roomType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes
                      .filter((room) => room.isPublished)
                      .map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Phòng {room.name} - {room.basePrice.toLocaleString("vi-VN")}₫/đêm
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Số lượng phòng</Label>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateBookingData("roomCount", Math.max(1, bookingData.roomCount - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{bookingData.roomCount}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateBookingData("roomCount", bookingData.roomCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">4. Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                  Họ và tên *
                </Label>
                <Input
                  id="fullName"
                  value={bookingData.fullName}
                  onChange={(e) => updateBookingData("fullName", e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => updateBookingData("email", e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phone"
                    value={bookingData.phone}
                    onChange={(e) => updateBookingData("phone", e.target.value)}
                    placeholder="0901234567"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                  Ghi chú (tùy chọn)
                </Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => updateBookingData("notes", e.target.value)}
                  placeholder="Yêu cầu đặc biệt, thời gian check-in dự kiến..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment & Promo */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">5. Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Phương thức thanh toán</Label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-medium">Thanh toán tại khách sạn</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quý khách có thể thanh toán bằng tiền mặt hoặc thẻ tại quầy lễ tân khi check-in
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="promoCode" className="text-sm font-medium mb-2 block">
                  Mã khuyến mãi (tùy chọn)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="promoCode"
                    value={bookingData.promoCode}
                    onChange={(e) => updateBookingData("promoCode", e.target.value)}
                    placeholder="Nhập mã khuyến mãi"
                  />
                  <Button type="button" variant="outline">
                    Áp dụng
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-hotel-gold hover:bg-hotel-gold/90 text-white"
            disabled={
              !bookingData.checkIn ||
              !bookingData.checkOut ||
              !bookingData.roomType ||
              !bookingData.fullName ||
              !bookingData.email ||
              !bookingData.phone
            }
          >
            Xác nhận đặt phòng
          </Button>
        </form>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <BookingSummary
          bookingData={bookingData}
          selectedRoom={selectedRoom}
          nights={nights}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  )
}
